import { use, useState } from "react";

const faqPromise = fetch("/faq.json").then((res) => res.json());
const ContactFaq = () => {
  const faqData = use(faqPromise);

  //state for the active faq item/card (fnc added by - Asif)
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFaq = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Quick Help</h2>
      <p className="text-base-content/70 mb-8">
        Many questions are answered in our FAQ. Find your answer faster!
      </p>

      <div className="space-y-2  mx-auto mt-10">
        {faqData.map((faq) => (
          <div key={faq.id}>
            <div className="collapse collapse-arrow join-item bg-base-200 border-base-300 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <input
                type="checkbox"
                name="my-accordion-4"
                checked={activeIndex === faq.id}
                onChange={() => toggleFaq(faq.id)}
              />
              <div className="collapse-title font-semibold">{faq.question}</div>
              <div className="collapse-content text-sm">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactFaq;
