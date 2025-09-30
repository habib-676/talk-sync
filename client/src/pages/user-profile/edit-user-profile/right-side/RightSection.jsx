import React from "react";
import LanguageSettings from "./LanguageSettings";
import AboutMe from "./AboutMe";
import Friends from "./Friends";

const RightSection = () => {
  return (
    <div className="space-y-8">
      <LanguageSettings />
      <AboutMe />
      <Friends />
    </div>
  );
};

export default RightSection;
