import { NextRequest, NextResponse } from "next/server";
import { getPropertiesFromDb } from "@/lib/sync";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    tipo: searchParams.get("tipo") ?? undefined,
    precioMin: searchParams.get("precioMin") ? Number(searchParams.get("precioMin")) : undefined,
    precioMax: searchParams.get("precioMax") ? Number(searchParams.get("precioMax")) : undefined,
    habitaciones: searchParams.get("habitaciones") ? Number(searchParams.get("habitaciones")) : undefined,
    m2Min: searchParams.get("m2Min") ? Number(searchParams.get("m2Min")) : undefined,
    ciudad: searchParams.get("ciudad") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
  };

  try {
    const { properties, total } = getPropertiesFromDb(filters);
    return NextResponse.json({
      properties,
      total,
      page: filters.page,
      totalPages: Math.ceil(total / (filters.limit ?? 12)),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
