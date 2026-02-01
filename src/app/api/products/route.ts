/**
 * GET /api/products
 * Obtiene todos los productos activos
 */

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching products",
      },
      { status: 500 }
    );
  }
}
