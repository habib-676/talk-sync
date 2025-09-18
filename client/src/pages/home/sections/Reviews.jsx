import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  return (
    <section className="py-16 bg-base-100">
      <h2 className="text-4xl font-bold text-center mb-12">What People Say</h2>
      <Marquee gradient={false} speed={60} pauseOnHover={true}>
        <div className="flex space-x-6 px-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-3xl  p-6 w-80 flex-shrink-0 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                />
                <h3 className="font-semibold text-lg">{review.name}</h3>
              </div>
              <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                "{review.review}"
              </p>
              <div className="flex">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5 text-yellow-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.845L19.335 24 12 20.012 4.665 24 6 15.268 0 9.423l8.332-1.268z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default Reviews;
