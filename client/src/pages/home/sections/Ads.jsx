import { Settings, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Ads = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Background Image */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3">
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="People connecting globally"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="maximum-w mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Start Your{" "}
              <span className="text-yellow-300">Language Journey</span>?
            </h3>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl leading-relaxed">
              Join <span className="font-bold text-white">2.5+ million</span>{" "}
              language partners worldwide. Practice naturally, make friends
              across cultures, and learn together through real conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={"/dashboard/follow"}>
                <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 min-w-[200px]">
                  <span>
                    <Users />
                  </span>
                  Find Your Partner - Free!
                </button>
              </Link>
              <button
                onClick={() => {
                  const section = document.getElementById("howItsWork");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 min-w-[200px]"
              >
                <span>
                  <Settings />
                </span>
                How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-8 text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Instant matching</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Safe & verified partners</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="flex-1 flex justify-center ">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-sm border border-white/20 p-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Happy language exchange partners"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">45K+</div>
                  <div className="text-sm font-medium">Active Partners</div>
                  <div className="text-xs text-gray-500 mt-1">Online now</div>
                </div>
              </div>

              {/* Another Floating Element */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-800 p-3 rounded-xl shadow-2xl">
                <div className="text-center">
                  <div className="text-lg font-bold">🌍</div>
                  <div className="text-xs font-bold">180+ Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ads;
