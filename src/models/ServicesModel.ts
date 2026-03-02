import type { Service } from '@/types';

export class ServiceModel {
  static fromJson(raw: unknown): Service {
    const candidate = (raw ?? {}) as Partial<Service> & {
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
      short_description?: string;
      price_range?: string;
    };

    let features: string[] | undefined;
    if (candidate.features) {
      features = Array.isArray(candidate.features) ? candidate.features : undefined;
    }

    return {
      id: String(candidate.id ?? ''),
      title: String(candidate.title ?? ''),
      slug: String(candidate.slug ?? ''),
      description: String(candidate.description ?? ''),
      icon: String(candidate.icon ?? ''),
      priceRange: candidate.priceRange ?? candidate.price_range,
      shortDescription: candidate.shortDescription ?? candidate.short_description,
      features,
      isActive: Boolean(candidate.isActive ?? candidate.is_active ?? true),
      createdAt: String(candidate.createdAt ?? candidate.created_at ?? ''),
      updatedAt: candidate.updatedAt ?? candidate.updated_at,
    };
  }

  static listFromJson(raw: unknown): Service[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(ServiceModel.fromJson);
  }
}
