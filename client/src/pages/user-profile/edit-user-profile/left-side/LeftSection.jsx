import React from "react";
import UploadPhoto from "./UploadPhoto";
import BasicInfo from "./BasicInfo";

const LeftSection = () => {
  return (
    <section className="space-y-8">
      <UploadPhoto />
      <BasicInfo />
    </section>
  );
};

export default LeftSection;
