import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-[#F6F2EB] w-full h-52 flex flex-col justify-center">
      {/* Logo зүүн талд */}
      <div className="absolute top-1/2 left-16 -translate-y-1/2">
        <Link href="/">
          <Image
            src="/haveneLogo.png"
            alt="site logo"
            width={105}
            height={89}
          />
        </Link>
      </div>

      {/* Footer content center */}
      <div className="flex flex-col items-center mt-32 space-y-2">
        <p className="text-gray-700">© 2025 Havene. All rights reserved.</p>
        <div className="flex space-x-6 text-gray-700">
          <p>📧 info@havene.mn</p>
          <p>📞 +976 9911 2233</p>
          <p>🏢 Ulaanbaatar, Mongolia</p>
        </div>
        {/* <div className="flex space-x-4 mt-2">
          <Link href="#">
            <span className="hover:text-blue-600">Facebook</span>
          </Link>
          <Link href="#">
            <span className="hover:text-blue-400">Twitter</span>
          </Link>
          <Link href="#">
            <span className="hover:text-pink-500">Instagram</span>
          </Link>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
