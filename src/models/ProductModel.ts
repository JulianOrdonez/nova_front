import type { Product } from '@/types';

export class ProductModel {
  static fromJson(raw: unknown): Product {
    const candidate = (raw ?? {}) as Partial<Product> & {
      categoryName?: string;
    };

    const category = candidate.category ?? {
      id: '',
      name: candidate.categoryName || 'Sin categoría',
      slug: '',
    };

    return {
      id: String(candidate.id ?? ''),
      name: String(candidate.name ?? ''),
      slug: String(candidate.slug ?? ''),
      description: String(candidate.description ?? ''),
      price:
        typeof candidate.price === 'number' || candidate.price === null
          ? candidate.price
          : null,
      imageUrl: String(candidate.imageUrl ?? ''),
      category,
      isActive: Boolean(candidate.isActive ?? true),
      createdAt: String(candidate.createdAt ?? ''),
      updatedAt: String(candidate.updatedAt ?? ''),
    };
  }

  static listFromJson(raw: unknown): Product[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(ProductModel.fromJson);
  }
}
