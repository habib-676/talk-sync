import { HelpCircle } from "lucide-react";
import { use, useState } from "react";
const faqPromise = fetch("/faq.json").then((res) => res.json());


export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
    const faqs = use(faqPromise);


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-3xl">Quick Help</h2>
        </div>
        <p className="text-gray-600">
          Find answers to common questions before reaching out.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <button
              className="flex justify-between items-center w-full p-6 text-left hover:no-underline"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-medium text-gray-900">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
