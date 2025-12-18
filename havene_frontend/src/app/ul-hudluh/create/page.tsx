// src/app/ul-hudluh/create/page.tsx
"use client";

import React, { useRef, useState } from "react";
import LocationPicker from "./_LocationPicker";
import "leaflet/dist/leaflet.css";

type Uploaded = {
  file: File;
  preview: string;
  uploading: boolean;
  path?: string;
  error?: string;
};

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
}

export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [areaSize, setAreaSize] = useState<string>("");
  const [floorCount, setFloorCount] = useState<string>("");
  const [balcony, setBalcony] = useState(false);
  const [garage, setGarage] = useState(false);
  const [builtYear, setBuiltYear] = useState<string>("");
  const [elevator, setElevator] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isVip, setIsVip] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [uploads, setUploads] = useState<Uploaded[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files).slice(0, 8);
    const newItems = arr.map((f) => ({
      file: f,
      uploading: false,
      preview: URL.createObjectURL(f),
    }));
    setUploads((prev) => [...prev, ...newItems]);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadSingle(file: File, folder: string, filename: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    fd.append("filename", filename);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? "Upload failed");
    }
    const data = await res.json();
    return data.path as string;
  }

  async function handleUploadAll(): Promise<string[]> {
    const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    let userIdPart = "";
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (u?.id) userIdPart = `-u${u.id}`;
      } catch {}
    }
    const folder = `uploads/ul_hudluh-${Date.now()}${userIdPart}`;

    const results: string[] = [];
    for (let i = 0; i < uploads.length; i++) {
      const u = uploads[i];
      if (u.path) {
        results.push(u.path);
        continue;
      }
      setUploads((prev) => prev.map((p, idx) => (idx === i ? { ...p, uploading: true, error: undefined } : p)));
      const safeName = `${Date.now()}-${i}-${sanitizeFilename(u.file.name)}`;
      try {
        const p = await uploadSingle(u.file, folder, safeName);
        results.push(p);
        const uploadedPath: string = p;
        setUploads((prev) => prev.map((p, idx) => (idx === i ? { ...p, uploading: false, path: uploadedPath } : p)));
      } catch (err: any) {
        setUploads((prev) => prev.map((p, idx) => (idx === i ? { ...p, uploading: false, error: String(err?.message ?? err) } : p)));
      }
    }
    return results;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    setError(null);

    if (!title && !description) {
      setError("Гарчиг эсвэл тайлбар шаардлагатай");
      return;
    }
    setSubmitting(true);

    try {
      const imagePaths = await handleUploadAll();

      const details: any = {
        description,
        area_size: areaSize ? Number(areaSize) : undefined,
        floor_count: floorCount ? Number(floorCount) : undefined,
        balcony,
        is_available: true,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        district_ids: undefined,
      };

      const payload: any = {
        action: "create",
        title: title || undefined,
        price: price ? Number(price) : undefined,
        currency: "MNT",
        location_text: locationText || undefined,
        main_image: imagePaths[0] || undefined,
        images: imagePaths,
        is_active: isActive,
        is_vip: isVip,
        area_size: areaSize ? Number(areaSize) : undefined,
        details,
      };

      // do NOT include id on create
      const token = typeof window !== "undefined" ? localStorage.getItem("havene_token") : null;

      const resp = await fetch("/api/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(result?.error || result?.message || `Status ${resp.status}`);
      }

      setMessage("Зар амжилттай хадгалагдлаа");
      // reset
      setTitle("");
      setPrice("");
      setLocationText("");
      setDescription("");
      setAreaSize("");
      setFloorCount("");
      setBalcony(false);
      setGarage(false);
      setBuiltYear("");
      setElevator(false);
      setIsActive(true);
      setIsVip(false);
      setUploads([]);
      setLatitude(null);
      setLongitude(null);
    } catch (err: any) {
      console.error("submit error", err);
      setError(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  function removeUpload(i: number) {
    const u = uploads[i];
    if (u?.preview) URL.revokeObjectURL(u.preview);
    setUploads((prev) => prev.filter((_, idx) => idx !== i));
  }

  function onMapSelect(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
    setLocationText(`lat:${lat.toFixed(5)}, lng:${lng.toFixed(5)}`);
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Шинэ Үл хөдлөхийн зар оруулах</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Гарчиг</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Жишээ: 2 өрөө байр, Баянгол"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Үнэ (₮)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Байршил текст</label>
            <input value={locationText} onChange={(e) => setLocationText(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="УБ — Баянгол, Хороо 17" />
          </div>
        <div>
          <label className="block text-sm font-medium">Талбай (м²)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ж: 45.5"
          />
        </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Тайлбар</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Газрын зураг (байршил авах)</label>
          <div className="h-64 mb-2">
            <LocationPicker initialLat={47.9186} initialLng={106.9170} initialZoom={12} onSelect={onMapSelect} />
          </div>
          <div className="text-sm text-gray-600">Сонгосон цэг: {latitude ? `${latitude.toFixed(6)}, ${longitude?.toFixed(6)}` : "Сонгоогүй"}</div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Зураг (нэг болон олон) — хамгийн их 8</label>
          <div className="flex items-center gap-2 mb-3">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFilesSelected} />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {uploads.map((u, i) => (
              <div key={i} className="relative border rounded overflow-hidden">
                <img src={u.preview} alt="" className="w-full h-28 object-cover" />
                <button type="button" onClick={() => removeUpload(i)} className="absolute top-2 right-2 bg-black/60 text-white px-1 rounded">
                  x
                </button>
                {u.uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm">Uploading...</div>}
                {u.path && <div className="absolute left-1 bottom-1 text-xs bg-white/80 px-1 rounded">{u.path}</div>}
                {u.error && <div className="absolute left-1 bottom-1 text-xs text-red-600 bg-white/80 px-1 rounded">{u.error}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={balcony} onChange={(e) => setBalcony(e.target.checked)} />
            <span>Балкон</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={elevator} onChange={(e) => setElevator(e.target.checked)} />
            <span>Лифт</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isVip} onChange={(e) => setIsVip(e.target.checked)} />
            <span>VIP</span>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-600">{message ?? ""}</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setUploads([]); setMessage(null); setError(null); }} className="px-3 py-2 border rounded">
              Цэвэрлэх
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">
              {submitting ? "Хадгалж байна..." : "Зар оруулах"}
            </button>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
}
