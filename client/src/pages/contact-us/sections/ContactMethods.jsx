import { Mail, Twitter, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  {
    name: "Twitter",
    icon: Twitter,
    href: "#",
    color: "hover:bg-blue-100 hover:text-blue-600",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "#",
    color: "hover:bg-blue-100 hover:text-blue-700",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
    color: "hover:bg-pink-100 hover:text-pink-600",
  },
];

export default function ContactMethods() {
  return (
    <div className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3 font-semibold">Other Ways to Reach Us</h2>
          <p className="text-gray-600">
            Connect with us through your preferred channel
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Email */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Email us at</div>
              <a
                href="mailto:hello@talksync.com"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                hello@talksync.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-gray-300"></div>
          <div className="md:hidden w-12 h-px bg-gray-300"></div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 mr-2">Follow us:</span>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-md ${social.color}`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Our support team is available Sunday-Thursday, 9:00 AM–6:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}
