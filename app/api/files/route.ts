import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

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

  const now = new Date();

  const snapshot = await adminDb
    .collection("zipFiles")
    .where("userId", "==", userId)
    .where("expiresAt", ">", now)
    .orderBy("expiresAt", "desc")
    .limit(50)
    .get();

  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt =
      typeof data.createdAt?.toDate === "function"
        ? data.createdAt.toDate()
        : new Date(data.createdAt);
    const expiresAt =
      typeof data.expiresAt?.toDate === "function"
        ? data.expiresAt.toDate()
        : new Date(data.expiresAt);

    return {
      id: doc.id,
      fileName: data.fileName ?? "output.zip",
      downloadUrl: data.downloadUrl,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  });

  return NextResponse.json(items);
}