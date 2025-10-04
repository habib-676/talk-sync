import { MapPin } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useCountryLanguage } from "../../hooks/useCountryLanguage";
import AvatarGenerator from "../../components/avatar-generator/AvatarGenerator";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

const OnBoarding = () => {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = methods;

  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useAuth();
  const { languages } = useCountryLanguage();

  //redirect user
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!user?.email) return toast.error("User not found");
    setIsCompleting(true);

    const {
      bio,
      image,
      learning_language,
      name,
      native_language,
      user_country,
    } = data;

    const userData = {
      bio,
      image,
      learning_language: [learning_language],
      name,
      native_language,
      user_country,
    };

    console.log(userData);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/onboarding/${user?.email}`,
        userData
      );

      console.log(res.data);

      if (res.data?.success && res.data?.modifiedCount > 0) {
        toast.success("Onboarding complete!");
        reset();
        navigate(from, { replace: true });
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl w-full bg-base-100 p-6 rounded-xl shadow-lg space-y-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Complete Your Profile
          </h2>

          {/* Avatar Generator */}
          <AvatarGenerator setValue={setValue} />

          {/* Full name */}
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              className="input w-full rounded-full"
              placeholder="Jonathan Isabella"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="text-error text-sm">{errors.name.message}</span>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-1">Bio</label>
            <textarea
              className="textarea textarea-bordered w-full resize-none h-28 rounded-2xl"
              placeholder="Tell something about yourself"
              {...register("bio", { required: "Bio is required" })}
            />
            {errors.bio && (
              <span className="text-error text-sm">{errors.bio.message}</span>
            )}
          </div>

          {/* Native & Learning Languages */}
          <div className="flex items-center gap-6">
            <div className="w-full">
              <label className="block mb-1">Native Language</label>
              <select
                className="select select-bordered w-full rounded-full"
                {...register("native_language", {
                  required: "Native language is required",
                })}
              >
                <option value="">Select your native language</option>
                {languages.map((language, index) => (
                  <option key={`${language}-${index}`} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              {errors.native_language && (
                <span className="text-error text-sm">
                  {errors.native_language.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-1">Learning Language</label>
              <select
                className="select select-bordered w-full rounded-full"
                {...register("learning_language", {
                  required: "Learning language is required",
                })}
              >
                <option value="">Select your learning language</option>
                {languages.map((language, index) => (
                  <option key={`${language}-${index}`} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              {errors.learning_language && (
                <span className="text-error text-sm">
                  {errors.learning_language.message}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="relative">
            <label className="block mb-1">Location</label>
            <input
              type="text"
              className="relative input w-full rounded-full px-8"
              placeholder="City, Country"
              {...register("user_country", { required: "Country is required" })}
            />
            <span className="absolute top-9 left-2 text-gray-400">
              <MapPin size={16} />
            </span>
            {errors.user_country && (
              <span className="text-error text-sm">
                {errors.user_country.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-secondary w-full rounded-full"
            disabled={isCompleting}
          >
            {isCompleting ? (
              <span className="loading loading-spinner loading-sm">
                Completing
              </span>
            ) : (
              "Complete Onboarding"
            )}
          </button>
        </form>
      </FormProvider>
    </section>
  );
};

export default OnBoarding;
