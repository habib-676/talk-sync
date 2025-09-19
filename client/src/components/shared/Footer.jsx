import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import LogoForFooter from "../logo/LogoForFooter";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 text-gray-900 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto py-14 px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* About */}
        <div>
          <LogoForFooter />
          <p className="text-gray-700 leading-relaxed mt-4">
            Connect, learn, and grow with language learners worldwide. Practice
            languages in real-time with peers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
          <ul className="space-y-3 text-gray-700">
            {[
              ["home", "Home"],
              ["about", "About Us"],
              ["find-partner", "Find a Partner"],
              ["how-it-works", "How it Works"],
              ["contact-us", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative hover:text-blue-600 transition-colors duration-300 after:block after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full after:absolute after:left-0 after:-bottom-1"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Stay Connected</h3>

          {/* Social Icons */}
          <div className="flex space-x-4 mb-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon />
                </a>
              )
            )}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium mb-3 text-gray-800">Subscribe</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-r-lg font-medium transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/10 text-center py-5 text-gray-600 text-sm relative z-10">
        © 2025 Talksync. All rights reserved.{" "}
        <a href="#" className="hover:text-blue-600">
          Terms
        </a>{" "}
        |{" "}
        <a href="#" className="hover:text-blue-600">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
