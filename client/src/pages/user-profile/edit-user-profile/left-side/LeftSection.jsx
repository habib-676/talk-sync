import React from "react";
import UploadPhoto from "./UploadPhoto";
import BasicInfo from "./BasicInfo";
import PersonalDetails from "./PersonalDetails";
import StatusAndRole from "./StatusAndRole";

const LeftSection = () => {
  return (
    <section className="space-y-8">
      <UploadPhoto />
      <BasicInfo />
      <PersonalDetails />
      <StatusAndRole />
    </section>
  );
};

export default LeftSection;
