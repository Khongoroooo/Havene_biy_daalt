import Image from "next/image";

export default function PropertyBanner() {
  return (
    <div className="relative w-full h-[320px] md:h-[400px]">
      <Image
        src="/house.jpg"
        alt="Banner"
        fill
        className="object-cover brightness-75"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Үл хөдлөх хөрөнгийн зарууд
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-200">
          Худалдах болон түрээслэх байруудыг нэг дороос
        </p>
      </div>
    </div>
  );
}
