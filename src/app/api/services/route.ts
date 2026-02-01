/**
 * GET /api/services
 * Obtiene todos los servicios activos
 */

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: services,
        count: services.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching services",
      },
      { status: 500 }
    );
  }
}
