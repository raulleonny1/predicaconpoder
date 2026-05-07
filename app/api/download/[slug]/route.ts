import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { BIBLIOTECA_RECURSOS } from "@/lib/content/biblioteca-recursos";

const resourceMap = new Map(BIBLIOTECA_RECURSOS.map((resource) => [resource.slug, resource]));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const resource = resourceMap.get(slug);
  if (!resource) {
    return NextResponse.json({ error: "Recurso no encontrado." }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "resources", resource.fileName);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resource.fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo leer el recurso. Contacta al administrador." },
      { status: 500 },
    );
  }
}
