// src/app/property/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPropertyById } from "../service";
import PropertySidebar from "../components/PropertySidebar";
import PropertyGallery from "../components/PropertyGallery";
import RelatedCarousel from "../components/RelatedCarousel";
import type { PropertyDetail } from "../types";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const id = params.id;
  const prop: PropertyDetail | null = await getPropertyById(id);

  if (!prop) {
    return <div className="max-w-4xl mx-auto py-20">Зар олдсонгүй</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Gallery */}
          <PropertyGallery
            images={(prop.images && prop.images.length) ? prop.images : [{ id: prop.id, image_url: prop.main_image ?? "/placeholder.png", is_main: true }]}
            mainImage={prop.main_image}
            title={prop.title}
          />

          {/* Basic info */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h1 className="text-2xl font-semibold mb-2">{prop.title}</h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="text-xl text-[#2A2A2A] font-semibold">
                {prop.currency ?? "₮"}{prop.price?.toLocaleString?.() ?? prop.price}
              </div>
              <div className="text-sm text-gray-600">{prop.location_text}</div>
            </div>

            <div className="prose max-w-none text-gray-700">
              <p>{prop.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-sm text-gray-700">
              <div><span className="font-medium">Талбай:</span> {prop.area_size ?? "—"} м²</div>
              <div><span className="font-medium">Давхар:</span> {prop.floor_count ?? "—"}</div>
              <div><span className="font-medium">Тагт:</span> {prop.balcony ? "Тийм" : "Үгүй"}</div>
              <div><span className="font-medium">Цонхны чиглэл:</span> {prop.sunlight_direction ?? "—"}</div>
              <div><span className="font-medium">Хэрэв байрлал байна:</span> {prop.latitude ? `${prop.latitude}, ${prop.longitude}` : "—"}</div>
              <div><span className="font-medium">Статус:</span> {prop.is_available ? "Захиалга авч байна" : "Боломжгүй"}</div>
            </div>
          </div>

          {/* Related / similar */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Ижил зарууд</h2>
            <RelatedCarousel currentId={prop.id} />
          </div>
        </div>

        {/* Sidebar (sticky on large screens) */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <PropertySidebar
              owner={prop.user}
              phoneMasked={prop.user?.phone ? maskPhone(prop.user.phone) : "—"}
              phoneRaw={prop.user?.phone ?? ""}
              propertyId={prop.id}
              propertyTitle={prop.title}
              propertyPrice={`${prop.currency ?? "₮"}${prop.price}`}
              propertyUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/property/${prop.id}`}
              related={[]} // optional
              latitude={prop.latitude}
              longitude={prop.longitude}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function maskPhone(phone?: string) {
  if (!phone) return "";
  // 88061234 -> 880-xx-34
  return phone.replace(/(\d{3})(\d{2})(\d{2})/, "$1-xx-$3");
}
