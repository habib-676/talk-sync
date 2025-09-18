import Faq from "./sections/Faq";
import Hero from "./sections/Hero";
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
        <Faq />
      </section>
    </div>
  );
};

export default Home;
