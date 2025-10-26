import React from "react";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";

const WhyWeBuilt = () => {
  return (
    <section className="bg-white py-12">
      <div className="maximum-w mx-auto px-4">
        {/* section header */}
        <div className="flex flex-col justify-center items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why We Built TalkSync
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto text-center">
            We experienced the challenges of language learning firsthand and
            knew there had to be a better way.
          </p>
        </div>

        {/* content grid: problem and solution */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16 items-center max-w-5xl mx-auto mt-12">
          {/* problem section - that people face usually */}
          <div className="bg-error/5 p-6 rounded-2xl border-l-4 border-error">
            {/* problem icon */}
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-error/10 text-error mb-6">
              <BiError size={30} />
            </div>
            <h3 className="text-2xl font-semibold text-error mb-4">
              The Problem
            </h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-2">
                <IoIosCloseCircle size={20} className="text-error" />

                <span>
                  Feeling <strong>isolated</strong> studying with apps and
                  textbooks.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <IoIosCloseCircle size={20} className="text-error" />

                <span>
                  <strong>Fear and anxiety</strong> about speaking with real
                  people.
                </span>
              </li>
              <li className="flex gap-2">
                <IoIosCloseCircle size={20} className="text-error" />

                <span>
                  Struggling to find{" "}
                  <strong>safe, reliable, and patient</strong> partners online.
                </span>
              </li>
            </ul>
          </div>
          {/* solution - that TalkSync provide */}
          <div className="bg-success/5 p-6 rounded-2xl border-l-4 border-success">
            {/* solution icon */}
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-success/10 text-success mb-6">
              <AiOutlineCheckCircle size={30} />
            </div>
            <h3 className="text-2xl font-semibold text-success mb-4">
              The Solution
            </h3>
            <ul className="space-y-5">
              <li className="flex gap-2">
                <AiFillCheckCircle size={20} className="text-success" />

                <span>
                  <strong>Smart matching</strong> based on your language,
                  interests, and goals.
                </span>
              </li>
              <li className="flex gap-2">
                <AiFillCheckCircle size={20} className="text-success" />

                <span>
                  An <strong>integrated, safe platform</strong> for video calls
                  and chat.
                </span>
              </li>
              <li className="flex gap-2">
                <AiFillCheckCircle size={20} className="text-success" />

                <span>
                  Built-in <strong>tools for learning</strong> like translation
                  and correction.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
};

export default WhyWeBuilt;
