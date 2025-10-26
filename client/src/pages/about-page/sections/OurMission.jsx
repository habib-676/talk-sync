import React from "react";
import mission1 from "../../../assets/about-page/mission-1.jpg";
import mission2 from "../../../assets/about-page/mission-2.jpg";
import mission3 from "../../../assets/about-page/mission-3.jpg";

const OurMission = () => {
  const missions = [
    {
      title: "Mission 1",
      image: mission1,
    },
    {
      title: "Mission 2",
      image: mission2,
    },
    {
      title: "Mission 3",
      image: mission3,
    },
  ];
  return (
    <section className="bg-base-100 py-12">
      <div className="maximum-w mx-auto px-4  flex flex-col items-center gap-6 sm:gap-8">
        <h1 className="text-3xl sm:text-5xl font-bold text-accent">
          Our Mission
        </h1>
        <p className="text-center max-w-5xl mx-auto text-accent-neutral">
          To break down language barriers and build cultural bridges by
          providing a platform for genuine, supportive, and effective language
          exchange. We believe everyone should have the tools and the confidence
          to connect with the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((mission, idx) => (
            <div key={idx} className="border border-base-300 shadow-md p-4">
              <h3 className="text-2xl font-semibold text-center mb-4 text-warning">
                {mission.title}
              </h3>
              <img src={mission.image} alt={mission.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurMission;
