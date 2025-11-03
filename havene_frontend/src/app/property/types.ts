// src/app/property/types.ts

export type PropertySummary = {
    id: number;
    title: string;
    price: string; // human readable (жишээ: "125,500,000₮")
    priceNumber?: number; // тоон үнэ (₮) — серверээс ирвэл ашиглана
    location_text: string;
    main_image?: string;
    view_count?: number;
    image_count?: number;
    created_at?: string;
    source?: string;
    property_type?: string; // жишээ: "Зарна" / "Түрээслүүлнэ" / "Орон сууц" гэх мэт
  };
  
  export type PropertyDetail = {
    id: number;
    title: string;
    price: number;
    priceNumber?: number;
    currency?: string;
    location_text?: string;
    description?: string;
    main_image?: string;
    images?: { id: number; image_url: string; is_main?: boolean }[];
    view_count?: number;
    image_count?: number;
    area_size?: number;
    balcony?: boolean;
    floor_count?: number;
    sunlight_direction?: string;
    latitude?: number;
    longitude?: number;
    is_available?: boolean;
    created_at?: string;
    user?: { id?: number; name?: string; phone?: string; avatar?: string; other_count?: number };
    property_type?: string;
  };
  