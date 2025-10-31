import React from "react";
import { useFormContext } from "react-hook-form";
import { useCountryLanguage } from "../../../../hooks/useCountryLanguage";
import { MapPin, User, AlertCircle, CalendarDays } from "lucide-react";
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
      <section className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-pulse">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <User size={24} className="text-blue-500" />
          Personal Details
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-red-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <User size={24} className="text-blue-500" />
          Personal Details
        </h2>
        <div className="alert alert-error shadow-lg bg-red-50 text-red-700 border-l-4 border-red-500">
          <AlertCircle size={20} />
          <div>
            <h3 className="font-semibold">Failed to load countries</h3>
            <div className="text-sm">{error.message || error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
      {/* Header with Icon */}
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <User size={24} className="text-blue-500" />
        Personal Details
      </h2>

      <div className="space-y-6">
        {/* Country Select */}
        <div className="form-control">
          <label htmlFor="country" className="label">
            <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" />
              Country
            </span>
          </label>
          <div className="relative">
            <select
              id="country"
              className={`
                select select-bordered w-full pl-10 pr-4 py-3 rounded-lg
                transition-all duration-200
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                ${
                  errors.country ? "border-error text-error" : "border-gray-300"
                }
                ${selectedCountry ? "text-gray-800" : "text-gray-500"}
              `}
              {...register("country", { required: false })}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Select your country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
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
        </div>

        {/* Date of Birth Component */}
        <div>
          <label className="label">
            <span className="label-text font-semibold text-gray-700 flex items-center gap-2"></span>
          </label>
          <DateOfBirth />{" "}
          {/* This component should handle its own errors for 'date_of_birth' field */}
        </div>

        {/* Gender Selection */}
        <div className="form-control">
          <legend className="label-text font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <User size={16} className="text-purple-500" />
            Gender
          </legend>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            role="radiogroup"
          >
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className={`
                  relative flex items-center justify-center py-3 px-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    selectedGender === option.value
                      ? "border-blue-600 bg-blue-50 shadow-md text-blue-700"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm text-gray-700"
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
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${
                      selectedGender === option.value
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-400"
                    }
                  `}
                  >
                    {selectedGender === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      selectedGender === option.value
                        ? "text-blue-700"
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
