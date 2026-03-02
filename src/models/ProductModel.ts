import type { Product } from '@/types';

export class ProductModel {
  static fromJson(raw: unknown): Product {
    const candidate = (raw ?? {}) as any;

    // Debug: ver qué datos llegan del backend
    console.log('Product data from backend:', candidate);

    // El backend puede devolver category de diferentes formas:
    // 1. Como objeto: { category: { id, name, slug } }
    // 2. Como campos separados del JOIN: { category_id, category_name, etc }
    let category = {
      id: '',
      name: 'Sin categoría',
      slug: '',
    };

    if (candidate.category && typeof candidate.category === 'object') {
      // Caso 1: viene como objeto completo
      category = {
        id: Number(candidate.category.id ?? 0),
        name: String(candidate.category.name ?? 'Sin categoría'),
        slug: String(candidate.category.slug ?? ''),
      };
    } else if (candidate.category_id) {
      // Caso 2: viene del JOIN de SQL con campos separados
      category = {
        id: Number(candidate.category_id),
        name: String(candidate.category_name || 'Sin categoría'),
        slug: String(candidate.category_slug || ''),
      };
    }

    const rawStok = candidate.stok ?? candidate.stock ?? null;
    const parsedStok =
      typeof rawStok === 'number'
        ? rawStok
        : rawStok === null || rawStok === undefined || rawStok === ''
          ? null
          : Number(rawStok);

    return {
      id: Number(candidate.id ?? 0),
      name: String(candidate.name ?? ''),
      slug: String(candidate.slug ?? ''),
      description: String(candidate.description ?? ''),
      price:
        typeof candidate.price === 'number' || candidate.price === null
          ? candidate.price
          : null,
      stok: Number.isFinite(parsedStok) ? parsedStok : null,
      imageUrl: String(candidate.image_url || candidate.imageUrl || ''),
      category,
      isActive: Boolean(candidate.is_active ?? candidate.isActive ?? true),
      createdAt: String(candidate.created_at || candidate.createdAt || ''),
      updatedAt: String(candidate.updated_at || candidate.updatedAt || ''),
    };
  }

  static listFromJson(raw: unknown): Product[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(ProductModel.fromJson);
  }
}
