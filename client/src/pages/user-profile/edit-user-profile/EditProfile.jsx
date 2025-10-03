import React, { useEffect } from "react";
import LeftSection from "./left-side/LeftSection";
import RightSection from "./right-side/RightSection";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { updateUserProfile } from "../../../lib/updateUserDB";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getUserByEmail } from "../../../lib/utils";

const EditProfile = () => {
  const methods = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();

  //fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => getUserByEmail(user?.email),
    enabled: !!user?.email,
  });

  //reset the form with updated data
  useEffect(() => {
    if (userData) {
      methods.reset({
        user_name: userData.name || "",
        photo: userData.image || "",
        bio: userData.bio || "",
        country: userData.user_country || "",
        date_of_birth: userData.date_of_birth || "",
        native_language: userData.native_language || "",
        learning_languages: userData.learning_language || "",
        gender: userData.gender || "",
        interests: userData.interests || [],
        proficiency_level: userData.proficiency_level || "",
      });
    }
  }, [methods, userData]);

  const onsubmit = async (data) => {
    //destructuring form data
    const {
      bio,
      country,
      date_of_birth,
      gender,
      interests,
      learning_languages,
      native_language,
      proficiency_level,
      user_name,
      photo,
    } = data;

    //user data obj
    const userData = {
      name: user_name,
      image: photo,
      bio,
      user_country: country,
      date_of_birth,
      native_language,
      learning_language: learning_languages,
      gender,
      interests,
      proficiency_level,
    };
    try {
      const userEmail = user.email; //from auth provider
      const res = await updateUserProfile(userEmail, userData);
      console.log("Profile updated", res);
      if ( res.result.modifiedCount > 0) {
        toast.success("Your profile is updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update:", error);
    }
  };

  if (isLoading) return <p className="text-center">Loading profile...</p>;

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
