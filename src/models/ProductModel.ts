import type { Product } from '@/types';

export class ProductModel {
  static fromJson(raw: unknown): Product {
    const candidate = (raw ?? {}) as Partial<Product> & {
      categoryName?: string;
      image_url?: string;
      category_id?: string | number;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
      category_name?: string;
    };

    const categoryId = candidate.category?.id ?? candidate.category_id ?? '';
    const categoryName =
      candidate.category?.name ?? candidate.categoryName ?? candidate.category_name ?? 'Sin categoría';

    const category = candidate.category ?? {
      id: String(categoryId),
      name: String(categoryName),
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
      imageUrl: String(candidate.imageUrl ?? candidate.image_url ?? ''),
      category,
      isActive: Boolean(candidate.isActive ?? candidate.is_active ?? true),
      createdAt: String(candidate.createdAt ?? candidate.created_at ?? ''),
      updatedAt: String(candidate.updatedAt ?? candidate.updated_at ?? ''),
    };
  }

  static listFromJson(raw: unknown): Product[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(ProductModel.fromJson);
  }
}
