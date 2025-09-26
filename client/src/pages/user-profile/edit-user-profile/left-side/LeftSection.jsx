import React from "react";
import UploadPhoto from "./UploadPhoto";
import BasicInfo from "./BasicInfo";
import PersonalDetails from "./PersonalDetails";

const LeftSection = () => {
  return (
    <section className="space-y-8">
      <UploadPhoto />
      <BasicInfo />
      <PersonalDetails />
    </section>
  );
};

export default LeftSection;
