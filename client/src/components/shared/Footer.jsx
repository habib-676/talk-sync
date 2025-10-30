import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import LogoForFooter from "../logo/LogoForFooter"; // Assuming this is your actual logo component

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white overflow-hidden">
      {/* Abstract Language Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            fillOpacity="0.7"
            d="M0,160L48,160C96,160,192,160,288,176C384,192,480,224,576,218.7C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="currentColor"
            fillOpacity="0.5"
            d="M0,96L48,106.7C96,117,192,139,288,144C384,149,480,139,576,128C672,117,768,107,864,106.7C960,107,1056,117,1152,133.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative maximum-w mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-12 z-10">
        {/* About */}
        <div>
          <LogoForFooter />
          <p className="text-blue-100 leading-relaxed mt-4 text-sm">
            Connect, learn, and grow with language learners worldwide. Practice
            languages in real-time with peers and expand your horizons.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-6 tracking-wide">Quick Links</h3>
          <ul className="space-y-3 text-blue-100">
            {[
              ["home", "Home"],
              ["about", "About Us"],
              ["find-partner", "Find a Partner"],
              ["howItsWork", "How it Works"],
              ["contact-us", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative hover:text-white transition-colors duration-300 text-sm before:block before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full before:absolute before:left-0 before:-bottom-1"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-6 tracking-wide">
            Stay Connected
          </h3>

          {/* Social Icons */}
          <div className="flex space-x-4 mb-7">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:scale-110"
                  aria-label="Social media link"
                >
                  <Icon className="text-lg" />
                </a>
              )
            )}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-3 text-blue-50">
              Join Our Newsletter
            </h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-white/30"
                aria-label="Email for newsletter"
              />
              <button className="px-5 py-2 bg-white text-indigo-700 rounded-r-lg font-semibold hover:bg-blue-100 transition shadow-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-400/30 text-center py-5 text-blue-200 text-xs relative z-10">
        © {new Date().getFullYear()} Talksync. All rights reserved.{" "}
        <a
          href="#"
          className="hover:text-white transition-colors duration-200 underline-offset-2 hover:underline"
        >
          Terms of Service
        </a>{" "}
        |{" "}
        <a
          href="#"
          className="hover:text-white transition-colors duration-200 underline-offset-2 hover:underline"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
