import ContactFaq from "./sections/ContactFaq";
import ContactForm from "./sections/ContactForm";

const ContactUs = () => {
  return (
    <section className="bg-base-100 min-h-screen max-w-7xl mx-auto px-4 mt-16 flex flex-col items-center justify-center">
      {/* page header section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-base-content/80 max-w-2xl mx-auto">
          Have feedback, spotted a bug, or want to partner with us? We're all
          ears! We strive to respond within{" "}
          <span className="text-accent font-semibold">24-48 hours</span>.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-10">
        <ContactFaq />
        <ContactForm />
      </div>
      <title>Contact Us - TalkSync</title>
    </section>
  );
};

export default ContactUs;
