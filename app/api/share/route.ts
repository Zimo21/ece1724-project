import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let ownerUid: string;
  let ownerEmail: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    ownerUid = decoded.uid;
    ownerEmail = decoded.email;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sharedWithMe = await prisma.sharedFile.findMany({
    where: { sharedWithId: userId },
    include: { owner: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ files: sharedWithMe });
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    userId = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}