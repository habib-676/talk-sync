import { use } from "react";

const faqPromise = fetch("/faq.json").then((res) => res.json());

const Faq = () => {
  const faqData = use(faqPromise);
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2  mx-auto mt-10">
        {faqData.map((faq) => (
          <div key={faq.id}>
            <div className="collapse collapse-arrow join-item bg-base-200 border-base-300 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <input type="radio" name="my-accordion-4" />
              <div className="collapse-title font-semibold">{faq.question}</div>
              <div className="collapse-content text-sm">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
