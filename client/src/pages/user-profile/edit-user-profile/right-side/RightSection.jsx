import React from "react";
import LanguageSettings from "./LanguageSettings";
import AboutMe from "./AboutMe";

const RightSection = () => {
  return (
    <div className="space-y-8">
      <LanguageSettings />
      <AboutMe />
    </div>
  );
};

export default RightSection;
