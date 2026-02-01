import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.service.deleteMany();
  await prisma.contactMessage.deleteMany();

  // Create categories
  const audiosCategory = await prisma.category.create({
    data: {
      name: "Audífonos",
      slug: "audifonos",
    },
  });

  const chargerCategory = await prisma.category.create({
    data: {
      name: "Cargadores",
      slug: "cargadores",
    },
  });

  const powerCategory = await prisma.category.create({
    data: {
      name: "Power Banks",
      slug: "power-banks",
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: "NOVA Pro Wireless",
        slug: "nova-pro-wireless",
        description:
          "Audífonos inalámbricos premium con cancelación de ruido activa y sonido envolvente de clase mundial.",
        price: 299.99,
        imageUrl: "/products/nova-pro-wireless.jpg",
        categoryId: audiosCategory.id,
        isActive: true,
      },
      {
        name: "NOVA Fast Charger 65W",
        slug: "nova-fast-charger-65w",
        description:
          "Cargador rápido USB-C con tecnología GaN para carga segura y eficiente de múltiples dispositivos.",
        price: 79.99,
        imageUrl: "/products/nova-fast-charger.jpg",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "NOVA PowerBank 20000mAh",
        slug: "nova-powerbank-20000mah",
        description:
          "Power bank compacto con capacidad de 20000mAh, carga rápida y diseño minimalista.",
        price: 59.99,
        imageUrl: "/products/nova-powerbank.jpg",
        categoryId: powerCategory.id,
        isActive: true,
      },
    ],
  });

  // Create services
  await prisma.service.createMany({
    data: [
      {
        title: "Garantía Premium",
        slug: "garantia-premium",
        description: "Cobertura completa de 2 años con soporte técnico prioritario.",
        icon: "shield-check",
        isActive: true,
      },
      {
        title: "Envío Gratis",
        slug: "envio-gratis",
        description:
          "Envío rápido y gratuito a toda la región en pedidos mayores a $50.",
        icon: "truck",
        isActive: true,
      },
      {
        title: "Soporte 24/7",
        slug: "soporte-24-7",
        description: "Atención al cliente disponible 24 horas, 7 días a la semana.",
        icon: "headset",
        isActive: true,
      },
      {
        title: "Devolución Fácil",
        slug: "devolucion-facil",
        description:
          "Devuelve tu producto dentro de 30 días sin preguntas para un reembolso completo.",
        icon: "undo",
        isActive: true,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("📊 Seed Summary:");
  console.log(`   - ${audiosCategory.name} category created`);
  console.log(`   - ${chargerCategory.name} category created`);
  console.log(`   - ${powerCategory.name} category created`);
  console.log("   - 3 products created");
  console.log("   - 4 services created");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
