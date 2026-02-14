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

  // Create products - UGREEN Real Products
  await prisma.product.createMany({
    data: [
      {
        name: "UGREEN Nexode 300W GaN Charger",
        slug: "ugreen-nexode-300w-gan",
        description:
          "Cargador GaN de 300W con 6 puertos - el más potente del mercado. Carga 3 laptops simultáneamente. USB-C 140W, 2x USB-C 65W, 3x USB-A. Perfecto para profesionales.",
        price: 249.99,
        imageUrl: "https://via.placeholder.com/500x500?text=UGREEN+300W+Charger",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN Nexode 140W GaN Charger",
        slug: "ugreen-nexode-140w-gan",
        description:
          "Cargador USB-C 140W con tecnología GaN avanzada. Carga MacBook Pro 16 en 40 minutos. 2 puertos USB-C simultáneos. Compacto y premium.",
        price: 89.99,
        imageUrl: "https://via.placeholder.com/500x500?text=UGREEN+140W+Charger",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN Power Bank 25000mAh 65W",
        slug: "ugreen-power-bank-25000",
        description:
          "Power bank 25000mAh con carga rápida 65W. Carga tu iPhone 15 7 veces. USB-C entrada/salida. Display digital. Ultra rápido y confiable.",
        price: 79.99,
        imageUrl: "https://via.placeholder.com/500x500?text=PowerBank+25000mAh",
        categoryId: powerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN Wireless Earbuds T8 Pro",
        slug: "ugreen-wireless-earbuds-t8",
        description:
          "Audífonos inalámbricos con cancelación activa de ruido (ANC). Batería 10 horas. Conexión estable Bluetooth 5.3. Diseño ergonómico premium.",
        price: 199.99,
        imageUrl: "https://via.placeholder.com/500x500?text=Earbuds+T8+Pro",
        categoryId: audiosCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN USB-C Hub 12 in 1",
        slug: "ugreen-usb-hub-12in1",
        description:
          "Hub USB-C 12 puertos - 4K HDMI, USB 3.0, SD, Ethernet, PD 100W. Convierte tu laptop en workstation profesional. Compatible con MacBook y Windows.",
        price: 129.99,
        imageUrl: "https://via.placeholder.com/500x500?text=USB-C+Hub+12in1",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN Lightning Cable 2M (3-pack)",
        slug: "ugreen-lightning-cable-3pack",
        description:
          "Cables Lightning certificados MFi. 3 unidades de 2 metros. Carga y transferencia rápida. Durabilidad garantizada. Perfectos para oficina, hogar, carro.",
        price: 34.99,
        imageUrl: "https://via.placeholder.com/500x500?text=Lightning+Cable+3Pack",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN MagSafe Power Bank 10000mAh",
        slug: "ugreen-magsafe-power-bank-10000",
        description:
          "Power bank magnético 10000mAh compatible con MagSafe. Carga inalámbrica 15W y USB-C 20W. Diseño compacto, ideal para iPhone y viajes.",
        price: 59.99,
        imageUrl: "https://via.placeholder.com/500x500?text=MagSafe+PowerBank+10000",
        categoryId: powerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN 65W Car Charger Dual USB-C",
        slug: "ugreen-65w-car-charger-dual-usbc",
        description:
          "Cargador para auto con 2 puertos USB-C y salida total 65W. Compatible con carga rápida PD y QC. Carga laptop y teléfono a la vez.",
        price: 29.99,
        imageUrl: "https://via.placeholder.com/500x500?text=Car+Charger+65W",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN AirLite ANC Headphones",
        slug: "ugreen-airlite-anc-headphones",
        description:
          "Audífonos over-ear con ANC híbrido y 60 horas de batería. Sonido Hi-Res, modo transparencia y comodidad premium para largas jornadas.",
        price: 149.99,
        imageUrl: "https://via.placeholder.com/500x500?text=AirLite+ANC+Headphones",
        categoryId: audiosCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN Spark Buds Mini",
        slug: "ugreen-spark-buds-mini",
        description:
          "Audífonos compactos con estuche ultraligero. Sonido balanceado, 30 horas con estuche y modo gaming de baja latencia.",
        price: 49.99,
        imageUrl: "https://via.placeholder.com/500x500?text=Spark+Buds+Mini",
        categoryId: audiosCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN USB-C Cable 240W (2m)",
        slug: "ugreen-usbc-cable-240w-2m",
        description:
          "Cable USB-C certificado para hasta 240W (PD 3.1). Ideal para laptops y estaciones de trabajo. Trenzado, resistente y confiable.",
        price: 19.99,
        imageUrl: "https://via.placeholder.com/500x500?text=USB-C+Cable+240W",
        categoryId: chargerCategory.id,
        isActive: true,
      },
      {
        name: "UGREEN Power Bank 20000mAh 100W",
        slug: "ugreen-power-bank-20000-100w",
        description:
          "Power bank 20000mAh con salida 100W y 2x USB-C. Carga MacBook, Steam Deck y más. Pantalla digital y múltiples protecciones.",
        price: 99.99,
        imageUrl: "https://via.placeholder.com/500x500?text=PowerBank+20000mAh",
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
  console.log(`   - Audífonos category created`);
  console.log(`   - Cargadores category created`);
  console.log(`   - Power Banks category created`);
  console.log("   - 12 UGREEN products created ✨");
  console.log("   - 4 services created");
  console.log("\n📦 Products loaded:");
  console.log("   1. UGREEN Nexode 300W GaN - $249.99");
  console.log("   2. UGREEN Nexode 140W GaN - $89.99");
  console.log("   3. UGREEN Power Bank 25000mAh - $79.99");
  console.log("   4. UGREEN Wireless Earbuds T8 - $199.99");
  console.log("   5. UGREEN USB-C Hub 12 in 1 - $129.99");
  console.log("   6. UGREEN Lightning Cable 3-pack - $34.99");
  console.log("   7. UGREEN MagSafe Power Bank 10000mAh - $59.99");
  console.log("   8. UGREEN 65W Car Charger Dual USB-C - $29.99");
  console.log("   9. UGREEN AirLite ANC Headphones - $149.99");
  console.log("  10. UGREEN Spark Buds Mini - $49.99");
  console.log("  11. UGREEN USB-C Cable 240W (2m) - $19.99");
  console.log("  12. UGREEN Power Bank 20000mAh 100W - $99.99");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
