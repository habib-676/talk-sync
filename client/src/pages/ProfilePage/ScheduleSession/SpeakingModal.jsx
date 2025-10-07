import React from "react";

const SpeakingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button>

        {/* Motivational Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-3xl font-bold text-indigo-700 mb-3">
            Speak English Like a Pro 🌟
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Join our live speaking sessions and boost your fluency, confidence,
            and pronunciation with expert tutors.
          </p>
        </div>

        {/* Pricing Section */}
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl mb-10 md:mx-auto text-center">
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-indigo-900 uppercase rounded-full bg-indigo-100">
              Speaking Packages
            </p>
            <h2 className="max-w-lg mb-6 text-2xl font-bold text-accent">
              Choose the perfect plan for your learning journey
            </h2>
            <p className="text-base text-gray-600">
              Flexible options for every learner — from casual practice to
              professional growth.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="flex flex-col justify-between p-8 bg-white border rounded shadow-sm hover:shadow-lg transition">
              <div className="text-center">
                <div className="text-lg font-semibold">Starter</div>
                <div className="flex justify-center mt-2">
                  <div className="mr-1 text-4xl text-info font-bold">$0</div>
                </div>
                <p className="text-gray-600 mt-2">1 free trial session</p>
                <p className="text-gray-600">15 minutes with a tutor</p>
              </div>
              <button className="mt-6 bg-info text-white py-2 rounded-lg hover:bg-indigo-700">
                Try for Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative flex flex-col justify-between p-8 bg-white border rounded shadow-lg border-indigo-400">
              <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
                <span className="bg-indigo-500 text-white px-3 py-1 text-xs rounded-full uppercase font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">Pro Speaker</div>
                <div className="flex justify-center mt-2">
                  <div className="mr-1 text-accent text-4xl font-bold">$25</div>
                  <div className="text-gray-700">/session</div>
                </div>
                <p className="text-gray-600 mt-2">1-on-1 live speaking session</p>
                <p className="text-gray-600">Professional feedback included</p>
              </div>
              <button className="mt-6 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                Book Now
              </button>
            </div>

            {/* Advanced Plan */}
            <div className="flex flex-col justify-between p-8 bg-white border rounded shadow-sm hover:shadow-lg transition">
              <div className="text-center">
                <div className="text-lg font-semibold">Fluency Pro+</div>
                <div className="flex justify-center mt-2">
                  <div className="mr-1 text-4xl text-info font-bold">$60</div>
                  <div className="text-gray-700">/month</div>
                </div>
                <p className="text-gray-600 mt-2">5 live sessions/month</p>
                <p className="text-gray-600">Priority tutor access</p>
              </div>
              <button className="mt-6 bg-info text-white py-2 rounded-lg hover:bg-gray-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingModal;
