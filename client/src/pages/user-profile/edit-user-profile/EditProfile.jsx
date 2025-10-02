import React from "react";
import LeftSection from "./left-side/LeftSection";
import RightSection from "./right-side/RightSection";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { updateUserProfile } from "../../../lib/updateUserDB";

const EditProfile = () => {
const methods = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("user from edit-profile", user.email);

  const onsubmit = async (data) => {
    console.log("Final form data", data);
    try {
      const userEmail = user.email;
      const res = await updateUserProfile(userEmail, data);
      console.log("Profile updated", res);
    } catch (error) {
      console.error("❌ Failed to update:", error);
    }
  };
  return (
    <div className="bg-base-300 p-6 min-h-screen py-16">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onsubmit)}
          className="max-w-7xl mx-auto space-y-8 bg-base-100 p-5 rounded-2xl"
        >
          <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeftSection></LeftSection>
            <RightSection></RightSection>
          </main>

          {/* divider */}
          <div className="divider"></div>

          <div className="flex items-center justify-between">
            <div className="space-x-3">
              <Link to={"/"} className="btn btn-primary">
                Home
              </Link>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
            <div className="flex justify-end gap-4 col-span-full">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button type="button" className="btn btn-error">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditProfile;
