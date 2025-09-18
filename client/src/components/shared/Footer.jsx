import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-secondary text-base-100 border-t border-secondary-content">
      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Talksync</h2>
          <p className="text-gray-600">
            Connect, learn, and grow with language learners worldwide. Practice
            languages in real-time with peers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-accent transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition">
                Find a Partner
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition">
                How it Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-gray-600 hover:text-accent transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-600 hover:text-accent transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-600 hover:text-accent transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-600 hover:text-accent transition">
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
              <button className="btn btn-primary ml-3">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-200 text-center py-4 text-gray-500 text-sm">
        © 2025 Talksync. All rights reserved.{" "}
        <a href="#" className="hover:text-accent">
          Terms
        </a>{" "}
        |{" "}
        <a href="#" className="hover:text-accent">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
