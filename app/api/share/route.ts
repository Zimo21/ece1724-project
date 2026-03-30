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
    const ownerUid = decoded.uid;
    const ownerEmail = decoded.email;

    if (!ownerEmail) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { id: ownerUid },
      create: { id: ownerUid, email: ownerEmail },
      update: { email: ownerEmail },
    });

    const body = await request.json();
    const { targetEmail, fileName, storagePath } = body;

    if (!targetEmail || !fileName || !storagePath) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found. They need to sign up first." },
        { status: 404 }
      );
    }

    if (targetUser.id === ownerUid) {
      return NextResponse.json(
        { error: "Cannot share with yourself" },
        { status: 400 }
      );
    }

    const existing = await prisma.sharedFile.findFirst({
      where: { ownerId: ownerUid, sharedWithId: targetUser.id, storagePath },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already shared with this user" },
        { status: 400 }
      );
    }

    const shared = await prisma.sharedFile.create({
      data: {
        fileName,
        storagePath,
        ownerId: ownerUid,
        sharedWithId: targetUser.id,
      },
    });

    return NextResponse.json({ success: true, id: shared.id });
  } catch (error) {
    console.error("Share error:", error);
    const message = error instanceof Error ? error.message : "Failed to share file";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
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

    const sharedWithMe = await prisma.sharedFile.findMany({
      where: { sharedWithId: userId },
      include: { owner: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files: sharedWithMe });
  } catch (error) {
    console.error("Get shared error:", error);
    const message = error instanceof Error ? error.message : "Failed to get shared files";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const app = getAdminApp();
    const auth = getAuth(app);
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;

    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("id");

    if (!shareId) {
      return NextResponse.json({ error: "Missing share ID" }, { status: 400 });
    }

    const share = await prisma.sharedFile.findUnique({
      where: { id: shareId },
    });

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    if (share.ownerId !== userId && share.sharedWithId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.sharedFile.delete({ where: { id: shareId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete share error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete share";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}