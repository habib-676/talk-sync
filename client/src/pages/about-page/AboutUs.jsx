import React from "react";
import TopSection from "./sections/TopSection";
import OurMission from "./sections/OurMission";
import WhyWeBuilt from "./sections/WhyWeBuilt";
import MeetTheTeam from "./sections/MeetTheTeam";
import OurValues from "./sections/OurValues";

const AboutUs = () => {
  return (
    <section className="min-h-screen mt-16">
      <title>About Us - TalkSync</title>
      <TopSection />
      <OurMission />
      <WhyWeBuilt />
      <MeetTheTeam />
      <OurValues />
    </section>
  );
};

export default AboutUs;
