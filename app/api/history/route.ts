import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Firebase Admin SDK not configured. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuth(getAdminApp());
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;
    const userEmail = decoded.email;

    if (userEmail) {
      await prisma.user.upsert({
        where: { id: userId },
        create: { id: userId, email: userEmail },
        update: { email: userEmail },
      });
    }

    const body = await request.json();
    const { fileName, storagePath } = body;

    if (!fileName || !storagePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const entry = await prisma.historyFile.create({
      data: {
        fileName,
        storagePath,
        userId,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Save history error:", error);
    const message = error instanceof Error ? error.message : "Failed to save history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = getAuth(getAdminApp());
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;

    const entries = await prisma.historyFile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Get history error:", error);
    const message = error instanceof Error ? error.message : "Failed to get history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}