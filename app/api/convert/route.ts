import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const dummyMarkdown = `# Converted Document, this is just a placeholder, we will need to implement the actual conversion logic here`;

  return new NextResponse(dummyMarkdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": 'attachment; filename="converted.md"',
    },
  });
}