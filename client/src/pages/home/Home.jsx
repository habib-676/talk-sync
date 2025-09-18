import Faq from "./sections/Faq";
import Hero from "./sections/Hero";

const Home = () => {
  return (
    <div>
      <section>
        <Hero />
      </section>
      <section>
        <Faq />
      </section>
    </div>
  );
};

export default Home;
