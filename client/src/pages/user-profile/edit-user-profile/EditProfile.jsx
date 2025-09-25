import React from "react";
import LeftSection from "./left-side/LeftSection";
import RightSection from "./right-side/RightSection";
import { FormProvider, useForm } from "react-hook-form";

const EditProfile = () => {
  const methods = useForm();

  const onsubmit = (data) => {
    console.log("Final form data", data);
  };
  return (
    <div className="bg-base-300 p-6 min-h-screen">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onsubmit)}
          className="max-w-7xl mx-auto space-y-8 bg-base-100 p-5"
        >
          <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeftSection></LeftSection>
            <RightSection></RightSection>
          </main>

          {/* divider */}
          <div className="divider"></div>

          <div className="flex justify-end gap-4 col-span-full">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button className="btn btn-error">Cancel</button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditProfile;
