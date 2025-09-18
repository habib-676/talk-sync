import heroImg from "../../../assets/svg/undraw_reading-time_gcvc.svg";
import { TiWorld } from "react-icons/ti";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Practice Languages. <br /> Connect Globally.
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-xl">
            Find partners worldwide to practice your target language through
            live video, audio, and chat for free.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="/signup"
              className="bg-white text-primary font-semibold px-6 py-3 rounded-2xl shadow hover:bg-accent hover:text-white transition"
            >
              Get Started
            </a>
            <a
              href="/find-partner"
              className="bg-indigo-700 text-white font-semibold px-6 py-3 rounded-2xl shadow hover:bg-indigo-800 transition"
            >
              Find a Partner
            </a>
          </div>

          {/* Small Trust Badge */}
          <div className="mt-6 text-sm opacity-90 flex gap-1 justify-center md:justify-start items-center">
            <span>
              {" "}
              <TiWorld size={20} className="mr-1 " />
            </span>
            <span>Trusted by learners in </span>
            <span className="font-semibold"> 50+ countries</span>
          </div>
        </div>

        {/* Right Content  */}
        <div className="flex-1 mt-10 md:mt-0 flex justify-center">
          <img src={heroImg} alt="Talksync App Preview" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
