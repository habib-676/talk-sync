import { use, useState } from "react";

const faqPromise = fetch("/faq.json").then((res) => res.json());

const Faq = () => {
  const faqData = use(faqPromise);

  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFaq = (id) => {
    setActiveIndex(activeIndex === id ? null : id);
  };
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-5xl font-bold text-center mb-8">
        <span className="text-primary">Frequently</span> Asked Questions
      </h2>
      <div className="space-y-2  mx-auto mt-10">
        {faqData.map((faq) => (
          <div key={faq.id}>
            <div
              className={`collapse collapse-arrow join-item border-base-300 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300
                ${activeIndex === faq.id ? "bg-base-200" : "bg-base-200"}
              `}
            >
              <input
                type="checkbox"
                name="my-accordion-4"
                checked={activeIndex === faq.id}
                onChange={() => toggleFaq(faq.id)}
              />
              <div
                className={`collapse-title font-semibold
                  ${
                    activeIndex === faq.id
                      ? "bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-xl"
                      : ""
                  }
                `}
              >
                {faq.question}
              </div>
              <div className="collapse-content text-lg text-gray-600">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
