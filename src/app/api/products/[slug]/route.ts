/**
 * GET /api/products/[slug]
 * Obtiene un producto específico por slug
 */

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid slug parameter",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching product",
      },
      { status: 500 }
    );
  }
}
