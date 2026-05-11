import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/content/blog-posts";
import { getAdminFirestore } from "@/lib/firebase-admin";

const validSlugs = new Set(BLOG_POSTS.map((p) => p.slug));

function isValidSlug(slug: string | null): slug is string {
  return Boolean(slug && validSlugs.has(slug));
}

/** Lectura del contador (sin incrementar). */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!isValidSlug(slug)) {
    return NextResponse.json({ enabled: false, count: 0 }, { status: 400 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ enabled: false, count: 0 });
  }

  const snap = await db.collection("blogReads").doc(slug).get();
  const count = typeof snap.data()?.count === "number" ? (snap.data()!.count as number) : 0;
  return NextResponse.json({ enabled: true, count });
}

/** Registra una lectura (incremento atómico). Solo slugs de entradas existentes. */
export async function POST(request: Request) {
  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json({ enabled: false, error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ enabled: false }, { status: 400 });
  }

  const rawSlug = typeof body === "object" && body !== null && "slug" in body ? (body as { slug?: string }).slug : undefined;
  if (!isValidSlug(rawSlug ?? null)) {
    return NextResponse.json({ enabled: false }, { status: 400 });
  }
  const slug = rawSlug as string;

  const ref = db.collection("blogReads").doc(slug);
  await ref.set(
    {
      count: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const snap = await ref.get();
  const count = typeof snap.data()?.count === "number" ? (snap.data()!.count as number) : 0;
  return NextResponse.json({ enabled: true, count });
}
