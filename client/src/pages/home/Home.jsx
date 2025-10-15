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
      <section>
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
      <section>
        <Faq />
      </section>
    </div>
  );
};

export default Home;
