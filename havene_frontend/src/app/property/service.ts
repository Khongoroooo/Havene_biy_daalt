// src/app/property/service.ts
import { PropertySummary, PropertyDetail } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export async function getAllProperties(): Promise<PropertySummary[]> {
  if (!API) {
    const mod = await import("./mock");
    return mod.mockProperties;
  }

  try {
    const res = await fetch(`${API}/properties/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      // price display или тоон утга байвал priority-оор оруулна
      price: d.price_display ?? (d.price ? `${d.price}` : "—"),
      priceNumber: d.price_number ?? d.price ?? undefined, // API-д янз бүр байж болзошгүй
      location_text: d.location_text ?? d.location ?? "",
      main_image: d.main_image ?? d.images?.[0]?.image_url ?? undefined,
      view_count: d.view_count ?? 0,
      image_count: d.image_count ?? (d.images ? d.images.length : 0),
      created_at: d.created_at,
      source: d.source,
      property_type: d.property_type ?? d.type ?? undefined,
    }));
  } catch (e) {
    const mod = await import("./mock");
    return mod.mockProperties;
  }
}
export async function getPropertyById(id: string | number): Promise<PropertyDetail | null> {
  if (!API) {
    const mod = await import("./mock");
    const p = mod.mockProperties[0];
    return {
      id: p.id,
      title: p.title,
      price: p.priceNumber ?? 0,
      priceNumber: p.priceNumber ?? 0,
      currency: "₮",
      location_text: p.location_text,
      description: "Mock description",
      main_image: p.main_image,
      images: [],
      view_count: p.view_count,
      image_count: p.image_count,
      created_at: p.created_at,
      property_type: p.property_type ?? undefined,
      user: undefined, // ← Энд null биш undefined болгов
    };
  }

  try {
    const res = await fetch(`${API}/properties/${id}/`, { cache: "no-store" });
    if (!res.ok) return null;
    const d = await res.json();
    return {
      id: d.id,
      title: d.title,
      price: d.price,
      priceNumber: d.price_number ?? d.price ?? undefined,
      currency: d.currency,
      location_text: d.location_text,
      description: d.description,
      main_image: d.main_image,
      images: d.images ?? [],
      view_count: d.view_count ?? 0,
      image_count: d.image_count ?? (d.images ? d.images.length : 0),
      area_size: d.area_size,
      balcony: d.balcony,
      floor_count: d.floor_count,
      sunlight_direction: d.sunlight_direction,
      latitude: d.latitude,
      longitude: d.longitude,
      is_available: d.is_available,
      created_at: d.created_at,
      user: d.user ?? undefined, // ← энд мөн undefined болгов
      property_type: d.property_type ?? d.type ?? undefined,
    };
  } catch {
    return null;
  }
}
