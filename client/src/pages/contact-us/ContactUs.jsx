import { MessageCircle } from "lucide-react";
import ContactForm from "./sections/ContactForm";
import { FAQSection } from "./sections/FAQSection";
import { ContactMethods } from "./sections/ContactMethods";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-5xl mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We're here to help you connect, learn, and grow.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Main Content - Two Column Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - FAQ */}
          <FAQSection />

          {/* Right Side - Contact Form */}
          <ContactForm />
        </div>
      </div>

      {/* Additional Contact Methods */}
      <ContactMethods />

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default ContactUs;
