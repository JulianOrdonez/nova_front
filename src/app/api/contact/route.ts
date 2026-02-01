/**
 * POST /api/contact
 * Recibe mensajes de contacto y los almacena en la BD
 */

import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Validación básica
function validateContactData(data: unknown): data is {
  name: string;
  email: string;
  message: string;
} {
  if (typeof data !== "object" || data === null) return false;

  const { name, email, message } = data as Record<string, unknown>;

  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    name.trim().length <= 100 &&
    typeof email === "string" &&
    email.includes("@") &&
    email.length <= 100 &&
    typeof message === "string" &&
    message.trim().length > 0 &&
    message.trim().length <= 5000
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos
    if (!validateContactData(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
        },
        { status: 400 }
      );
    }

    // Crear mensaje de contacto
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        message: body.message.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: contactMessage.id,
          message: "Message received successfully",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error processing contact message",
      },
      { status: 500 }
    );
  }
}
