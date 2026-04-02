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

  if (!userEmail) {
    return NextResponse.json(
      { error: "No email found in token" },
      { status: 400 }
    );
  }

  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email: userEmail },
    update: { email: userEmail },
  });

  return NextResponse.json({ success: true });
}