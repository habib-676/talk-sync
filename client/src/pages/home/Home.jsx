import SpeakingPracticeDemo from "../Demo/SpeakingDemo";
import ChooseUs from "../WhyUs/ChooseUs";
import Ads from "./sections/Ads";
import BadgesPreview from "./sections/BadgesPreview";
import Faq from "./sections/Faq";
import FlagsWithCountry from "./sections/FlagsWithCountry";
import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Reviews from "./sections/Reviews";
import StatsWithLanguages from "./sections/StatsWithLanguages";
import FloatingAIButton from "../../components/shared/FloatingAIButton";

const Home = () => {
  return (
    <div>
      <section>
        <Hero />
      </section>
      <section>
        <StatsWithLanguages></StatsWithLanguages>
      </section>
      <section>
        <FlagsWithCountry></FlagsWithCountry>
      </section>
      <section>
        <Ads />
      </section>
      <section className="bg-primary/5">
        <Reviews />
      </section>
      <section>
        <HowItWorks />
      </section>
      <section>
        <SpeakingPracticeDemo></SpeakingPracticeDemo>
      </section>
      <section>
        <BadgesPreview />
      </section>
      <section>
        <ChooseUs></ChooseUs>
      </section>
      <section className="bg-gray-100">
        <Faq />
      </section>
      {/* Floating AI button (fixed bottom-right) */}
      <FloatingAIButton />
    </div>
  );
};

export default Home;
