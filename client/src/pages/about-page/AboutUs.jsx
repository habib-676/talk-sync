import React from "react";
import TopSection from "./sections/TopSection";
import OurMission from "./sections/OurMission";
import WhyWeBuilt from "./sections/WhyWeBuilt";
import MeetTheTeam from "./sections/MeetTheTeam";
import OurValues from "./sections/OurValues";

const AboutUs = () => {
  return (
    <section className="bg-white min-h-screen max-w-7xl mx-auto mt-16">
      <TopSection />
      <OurMission />
      <WhyWeBuilt />
      <MeetTheTeam />
      <OurValues />
    </section>
  );
};

export default AboutUs;
