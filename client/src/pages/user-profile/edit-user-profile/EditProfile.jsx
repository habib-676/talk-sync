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
        name: userData.name || "",
        image: userData.image || "",
        bio: userData.bio || "",
        country: userData.user_country || "",
        date_of_birth: userData.date_of_birth || "",
        native_language: userData.native_language || "",
        learning_language: userData.learning_language || [],
        gender: userData.gender || "",
        interests: userData.interests || [],
        proficiency_level: userData.proficiency_level || "",
      });
    }
  }, [methods, userData]);

  const onsubmit = async (data) => {
    console.log(data);
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
      if (res.result.modifiedCount > 0) {
        toast.success("Your profile is updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update:", error);
    }
  };

  if (isLoading) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 min-h-screen py-16">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onsubmit)}
          className="max-w-7xl mx-auto space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 pb-4 border-b-2 border-indigo-200">
            Edit Profile
          </h1>
          <main className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <LeftSection />
            <RightSection />
          </main>

          {/* divider */}
          <div className="divider my-10"></div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <Link
                to={"/"}
                className="btn btn-outline btn-info px-8 font-semibold transition-all duration-300 hover:scale-105"
              >
                Home
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-warning px-8 font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                className="btn btn-error px-8 font-semibold text-white transition-all duration-300 hover:scale-105"
                onClick={() => methods.reset(userData)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
export default EditProfile;
