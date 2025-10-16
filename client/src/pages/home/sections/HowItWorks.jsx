import React from "react";
import {
  User,
  Heart,
  MessageSquare,
  Star,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { Link } from "react-router";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create your profile",
      description: "Photo • Languages • Availability",
      progress: 25,
      icon: User,
    },
    {
      id: 2,
      title: "Find a match",
      description: "Smart pairing or tutor",
      progress: 50,
      icon: Heart,
    },
    {
      id: 3,
      title: "Start a session",
      description: "Video • Screen share • Prompts",
      progress: 75,
      icon: MessageSquare,
    },
    {
      id: 4,
      title: "Reflect & grow",
      description: "Feedback • Badges • Review",
      progress: 100,
      icon: Star,
    },
  ];

  return (
    <section
      id="howItsWork"
      className="min-h-screen bg-gray-50 text-gray-900 p-8"
    >
      {/* Background Gradient for the entire page for better glassmorphism contrast */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)",
        }}
      ></div>
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)",
        }}
      ></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center text-blue-600 mb-4">
            <Check size={16} className="mr-2" />
            <span className="text-sm font-medium">How It Works</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Your journey to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              fluency
            </span>{" "}
            starts here
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Master any language through AI-powered conversations and real
            partner connections. Four simple steps to transform your language
            learning experience.
          </p>
          <div className="flex flex-col md:flex-row gap-5 mb-12">
            <Link to={"/auth/register"}>
              <button className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition duration-300 shadow-md hover:shadow-lg">
                Get started free <ArrowUpRight size={18} className="ml-2" />
              </button>
            </Link>
            <button className="flex items-center px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 transition duration-300 bg-white shadow-sm hover:shadow-md">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>{" "}
              Watch demo
            </button>
          </div>
          <div className="flex space-x-8">
            <div>
              <p className="text-3xl font-bold text-gray-900">50K+</p>
              <p className="text-gray-600 text-sm">Active learners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">30+</p>
              <p className="text-gray-600 text-sm">Languages</p>
            </div>
            <div>
              <p className="text-3xl font-bold flex items-center text-gray-900">
                4.9
                <Star
                  fill="currentColor"
                  stroke="none"
                  className="ml-1 text-yellow-500 w-6 h-6"
                />
              </p>
              <p className="text-gray-600 text-sm">Average rating</p>
            </div>
          </div>
        </div>

        {/* Right Section - Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-6 rounded-2xl shadow-md relative overflow-hidden transform transition duration-500
                ${
                  step.progress === 100
                    ? "bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
                }
                hover:scale-105 hover:shadow-xl hover:border-blue-300
                group
              `}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* Hover gradient background */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl
                  ${
                    step.progress === 100
                      ? "bg-gradient-to-br from-indigo-50 to-purple-50"
                      : "bg-gradient-to-br from-blue-50 to-indigo-50"
                  }
                `}
                style={{
                  zIndex: -1,
                }}
              ></div>

              {/* Decorative elements */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
                  zIndex: 0,
                }}
              ></div>
              <div className="absolute top-4 right-4 text-blue-400 opacity-20">
                {React.createElement(step.icon, { size: 48 })}
              </div>

              <div className="flex items-center mb-4 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-sm
                    ${step.progress === 100 ? "bg-indigo-500" : "bg-blue-500"}
                  `}
                >
                  {step.id}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative z-10">
                <div
                  className={`h-full rounded-full shadow-sm ${
                    step.progress === 100
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{ width: `${step.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-gray-600 text-sm mt-2 relative z-10">
                Step {step.id} of 4
              </p>
            </div>
          ))}

          <button className="flex items-center justify-center w-full py-4 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition duration-300 mt-6 relative z-10 shadow-sm hover:shadow-md">
            <Check size={18} className="mr-2" /> Complete all steps to unlock
            premium features
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
