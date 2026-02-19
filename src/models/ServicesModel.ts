import type { Service } from '@/types';

export class ServiceModel {
  static fromJson(raw: unknown): Service {
    const candidate = (raw ?? {}) as Partial<Service> & {
      is_active?: boolean;
      created_at?: string;
    };

    return {
      id: String(candidate.id ?? ''),
      title: String(candidate.title ?? ''),
      slug: String(candidate.slug ?? ''),
      description: String(candidate.description ?? ''),
      icon: String(candidate.icon ?? ''),
      isActive: Boolean(candidate.isActive ?? candidate.is_active ?? true),
      createdAt: String(candidate.createdAt ?? candidate.created_at ?? ''),
    };
  }

  static listFromJson(raw: unknown): Service[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(ServiceModel.fromJson);
  }
}
