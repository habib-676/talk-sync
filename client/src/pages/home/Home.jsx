import ChooseUs from "../WhyUs/Chooseus";
import BadgesPreview from "./sections/BadgesPreview";
import Faq from "./sections/Faq";
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
        <Reviews />
      </section>
      <section>
        <HowItWorks />
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
