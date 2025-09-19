import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-base-100 border-t border-secondary-content">
      <div className="maximum-w mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold text-base-100 mb-4">Talksync</h2>
          <p className="text-base-300">
            Connect, learn, and grow with language learners worldwide. Practice
            languages in real-time with peers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="home" className="hover:text-accent transition">
                Home
              </a>
            </li>
            <li>
              <a href="about" className="hover:text-accent transition">
                About Us
              </a>
            </li>
            <li>
              <a href="find-partner" className="hover:text-accent transition">
                Find a Partner
              </a>
            </li>
            <li>
              <a href="how-it-works" className="hover:text-accent transition">
                How it Works
              </a>
            </li>
            <li>
              <a href="contact-us" className="hover:text-accent transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-base-300/50 hover:text-base-100 transition-all duration-300">
              <FaFacebookF />
            </a>
            <a href="#" className="text-base-300/50 hover:text-base-100 transition-all duration-300">
              <FaTwitter />
            </a>
            <a href="#" className="text-base-300/50 hover:text-base-100 transition-all duration-300">
              <FaInstagram />
            </a>
            <a href="#" className="text-base-300/50 hover:text-base-100 transition-all duration-300">
              <FaLinkedinIn />
            </a>
          </div>
          <div>
            <h4 className="font-medium mb-2">Subscribe</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border rounded-lg border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="btn btn-secondary ml-3">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-500 text-center py-4 text-base-300 text-sm">
        © 2025 Talksync. All rights reserved.{" "}
        <a href="#" className="hover:text-secondary">
          Terms
        </a>{" "}
        |{" "}
        <a href="#" className="hover:text-secondary">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
