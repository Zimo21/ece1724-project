import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth, adminStorage } from "@/lib/firebase/admin";

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
    const [entries, shareCounts] = await Promise.all([
      prisma.historyFile.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.sharedFile.groupBy({
        by: ["storagePath"],
        where: { ownerId: userId },
        _count: { _all: true },
      }),
    ]);

    const countByPath = Object.fromEntries(
      shareCounts.map((r) => [r.storagePath, r._count._all])
    );

    return NextResponse.json({
      entries: entries.map((e) => ({
        ...e,
        shareCount: countByPath[e.storagePath] ?? 0,
      })),
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
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
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing history id" }, { status: 400 });
  }

  const entry = await prisma.historyFile.findFirst({
    where: { id, userId },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.sharedFile.deleteMany({
    where: { ownerId: userId, storagePath: entry.storagePath },
  });

  await prisma.historyFile.delete({ where: { id } });

  try {
    await adminStorage.file(entry.storagePath).delete();
  } catch (e) {
    console.error("History storage delete:", e);
  }

  return NextResponse.json({ success: true });
}