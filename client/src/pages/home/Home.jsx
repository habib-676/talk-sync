import Faq from "./sections/Faq";
import Hero from "./sections/Hero";
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
        <Faq />
      </section>
    </div>
  );
};

export default Home;
