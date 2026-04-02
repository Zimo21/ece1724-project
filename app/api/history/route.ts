import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  let userEmail: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    userId = decoded.uid;
    userEmail = decoded.email;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    userId = decoded.uid;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await prisma.historyFile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}