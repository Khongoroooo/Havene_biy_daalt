// components/footer.tsx
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-[#F6F2EB] w-full flex flex-col md:flex-row items-center justify-between h-auto md:h-52 p-6 md:px-16">
      <div className="mb-4 md:mb-0">
        <Link href="/">
          <Image src="/haveneLogo.png" alt="site logo" width={105} height={89} />
        </Link>
      </div>

      <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
        <p className="text-gray-700">© 2025 Havene. All rights reserved.</p>
        <div className="flex flex-col md:flex-row md:space-x-6 text-gray-700">
          <p>📧 info@havene.mn</p>
          <p>📞 +976 9911 2233</p>
          <p>🏢 Ulaanbaatar, Mongolia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
