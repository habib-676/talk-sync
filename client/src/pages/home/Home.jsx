import BadgesPreview from "./sections/BadgesPreview";
import Faq from "./sections/Faq";
import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Reviews from "./sections/Reviews";

const Home = () => {
  return (
    <div>
      <section>
        <Hero />
      </section>
      <section>
        <Reviews />
      </section>
      <section>
        <HowItWorks/>
      </section>
      <section>
        <BadgesPreview />
      </section>
      <section>
        <Faq />
      </section>
    </div>
  );
};

export default Home;
