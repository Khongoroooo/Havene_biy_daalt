"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MapPin, Eye, Calendar, ArrowLeft, Home, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import для MapViewer (SSR-гүй)
const MapViewer = dynamic(() => import("./_MapViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Газрын зураг ачааллаж байна...</p>
    </div>
  ),
});

type ApiResp = {
  status?: string;
  property?: any;
  details?: any;
  images?: Array<any>;
  is_favorite?: boolean;
  is_owner?: boolean;
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/property/${id}`);
      const json = await res.json();
      if (!res.ok) {
        console.error("detail load error", json);
        setData(null);
      } else {
        setData(json);
      }
    } catch (err) {
      console.error("detail fetch error", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("havene_token") : null;
      const res = await fetch("/api/property/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ property_id: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to toggle");
      await load();
    } catch (err: any) {
      alert(err?.message ?? "Алдаа гарлаа");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABA48D]"></div>
      </div>
    );
  }

  if (!data || !data.property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Зар олдсонгүй</p>
          <button
            onClick={() => router.push("/ul-hudluh")}
            className="px-6 py-2 bg-[#ABA48D] text-white rounded-lg hover:bg-[#9A9380]"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  const prop = data.property;
  const details = data.details ?? {};
  const images = data.images ?? [];
  const isOwner = data.is_owner ?? false;
  const isFav = data.is_favorite ?? false;

  const displayImages = images.length > 0 ? images : [{ image_url: prop.main_image ?? "/placeholder.png" }];
  const selectedImage = displayImages[selectedImageIndex]?.image_url ?? displayImages[0]?.image_url ?? "/placeholder.png";

  // Байршлын мэдээлэл
  const hasLocation = details.latitude && details.longitude;

  function formatPrice(p?: number): string {
    if (typeof p === "number") {
      return p.toLocaleString("en-US") + "₮";
    }
    return "Үнэ тохиролцоно";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/ul-hudluh")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Буцах</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Images Section */}
            <div>
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-4">
                <Image
                  src={selectedImage}
                  alt={prop.title ?? "Property"}
                  fill
                  className="object-cover"
                />
              </div>

              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {displayImages.slice(0, 8).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImageIndex === idx ? "border-[#ABA48D] scale-105" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img.image_url ?? img.image ?? "/placeholder.png"}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900 pr-4">{prop.title ?? "Гарчиггүй"}</h1>
                <button
                  onClick={toggleFavorite}
                  className="p-3 rounded-full border hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <Heart
                    size={24}
                    className={isFav ? "text-red-500 fill-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              <div className="text-3xl font-bold text-[#ABA48D] mb-6">
                {formatPrice(prop.price)}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={20} className="flex-shrink-0" />
                  <span>{prop.location_text ?? "Байршил тодорхойгүй"}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Eye size={20} className="flex-shrink-0" />
                  <span>{prop.view_count ?? 0} үзсэн</span>
                </div>

                {prop.created_at && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={20} className="flex-shrink-0" />
                    <span>Нийтэлсэн: {new Date(prop.created_at).toLocaleDateString("mn-MN")}</span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Home size={20} />
                  Үндсэн мэдээлэл
                </h3>
                
                {(prop.area_size || details.area_size) && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Maximize2 size={16} />
                      Талбай:
                    </span>
                    <span className="font-medium">{prop.area_size ?? details.area_size} м²</span>
                  </div>
                )}

                {details.floor_count && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Давхар:</span>
                    <span className="font-medium">{details.floor_count}</span>
                  </div>
                )}

                {details.balcony !== undefined && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Тагт:</span>
                    <span className="font-medium">{details.balcony ? "Тийм" : "Үгүй"}</span>
                  </div>
                )}

                {details.usage_status && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Ашиглалтын төлөв:</span>
                    <span className="font-medium">{details.usage_status}</span>
                  </div>
                )}

                {details.purpose && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Зориулалт:</span>
                    <span className="font-medium">{details.purpose}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwner && (
                  <button
                    onClick={() => router.push(`/ul-hudluh/create?edit=${prop.id}`)}
                    className="flex-1 px-6 py-3 bg-[#ABA48D] text-white rounded-lg hover:bg-[#9A9380] transition-colors font-medium"
                  >
                    Засах
                  </button>
                )}
                <button
                  onClick={() => alert("Холбогдох: " + (prop.user_id ?? "Мэдээлэл байхгүй"))}
                  className="flex-1 px-6 py-3 border-2 border-[#ABA48D] text-[#ABA48D] rounded-lg hover:bg-[#ABA48D] hover:text-white transition-colors font-medium"
                >
                  Холбогдох
                </button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {(details.description || prop.description) && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Дэлгэрэнгүй мэдээлэл</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {details.description ?? prop.description}
              </p>
            </div>
          )}

          {/* Map Section */}
          {hasLocation && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin size={24} />
                Байршил
              </h3>
              
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Координат:</span>
                  <span className="text-sm font-mono">
                    {details.latitude.toFixed(6)}, {details.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                <MapViewer
                  latitude={details.latitude}
                  longitude={details.longitude}
                  locationText={prop.location_text}
                  zoom={15}
                />
              </div>

              <p className="text-sm text-gray-500 mt-3">
                💡 Зургийг чирж хөдөлгөж, товчлуур ашиглан томруулах боломжтой
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}