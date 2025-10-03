import React from "react";
import { useFormContext } from "react-hook-form";
import { useCountryLanguage } from "../../../../hooks/useCountryLanguage";
import { MapPin, User, AlertCircle } from "lucide-react";
import DateOfBirth from "../../../../components/date-of-birth/DateOfBirth";

const PersonalDetails = () => {
  const {
    formState: { errors },
    watch,
    register,
  } = useFormContext();
  const { countries, loading, error } = useCountryLanguage();

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" },
  ];

  // Watch values for better UX
  const selectedCountry = watch("country");
  const selectedGender = watch("gender");

  if (loading) {
    return (
      <section className="space-y-6 bg-base-300 p-6 rounded-lg shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <User size={24} className="text-primary" />
          Personal Details
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-12 w-full rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 bg-base-300 p-6 rounded-lg shadow-md border border-base-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <User size={24} className="text-primary" />
          Personal Details
        </h2>
        <div className="alert alert-error shadow-lg">
          <AlertCircle size={20} />
          <div>
            <h3 className="font-semibold">Failed to load countries</h3>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 bg-base-300 p-6 rounded-lg shadow-md border border-base-200">
      {/* Header with Icon */}
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <User size={24} className="text-primary" />
        Personal Details
      </h2>

      <div className="space-y-6">
        {/* Country Select */}
        <div className="form-control">
          <label htmlFor="country" className="label">
            <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} />
              Country
            </span>
          </label>
          <div className="relative">
            <select
              className={`
                select select-bordered w-full pl-10 pr-4 py-3
                transition-all duration-200
                focus:select-primary focus:ring-2 focus:ring-primary/20
                ${errors.country ? "select-error" : ""}
                ${selectedCountry ? "text-gray-800" : "text-gray-500"}
              `}
              {...register("country", { required: false })}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Select your country
              </option>
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.name}
                  className="flex items-center gap-2"
                >
                  {country.name}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45"></div>
            </div>
          </div>
          {errors.country && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.country.message}
              </span>
            </label>
          )}
        </div>

        {/* Date of Birth Component */}
        <DateOfBirth />

        {/* Gender Selection */}
        <div className="form-control">
          <legend className="label-text font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User size={16} />
            Gender
          </legend>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            role="radiogroup"
          >
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className={`
                  relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedGender === option.value
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-gray-200 bg-base-100 hover:border-gray-300 hover:shadow-sm"
                  }
                  ${errors.gender ? "border-error/50" : ""}
                `}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="radio radio-primary absolute opacity-0"
                  {...register("gender", {
                    required: "Please select your gender",
                  })}
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${
                      selectedGender === option.value
                        ? "border-primary bg-primary"
                        : "border-gray-400"
                    }
                  `}
                  >
                    {selectedGender === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      selectedGender === option.value
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.gender && (
            <label className="label">
              <span className="label-text-alt text-error flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.gender.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </section>
  );
};

export default PersonalDetails;
