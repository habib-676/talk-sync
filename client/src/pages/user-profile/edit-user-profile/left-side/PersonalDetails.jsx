import React from "react";
import { useFormContext } from "react-hook-form";
import { useCountryLanguage } from "../../../../hooks/useCountryLanguage";

const PersonalDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { countries, loading, error } = useCountryLanguage();

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" },
  ];

  if (loading) {
    return (
      <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Personal Details</h2>
        <div className="skeleton h-12 w-full"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Personal Details</h2>
        <div className="alert alert-error">
          Failed to load countries: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Personal Details</h2>

      <div className="space-y-4">
        {/* country */}
        <div>
          <label htmlFor="country" className="block font-semibold mb-1">
            Country
          </label>
          <select
            defaultValue="Select a country"
            className="select appearance-none w-full"
            {...register("country", { required: "Country is required" })}
          >
            <option value={""}>Select your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-error text-sm mt-1">
              {errors.country.message}
            </span>
          )}
        </div>

        {/* date of birth */}
        <div>
          <label
            htmlFor="dob"
            className="block font-semibold mb-2 text-gray-700"
          >
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            className="input input-bordered w-full font-medium"
            {...register("date_of_birth", {
              required: "Date of birth is required",
              validate: {
                pastDate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  return (
                    selectedDate <= today || "Date cannot be in the future"
                  );
                },
                validAge: (value) => {
                  const birthDate = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  return age >= 13 || "You must be at least 13 years old";
                },
              },
            })}
          />
        </div>
        {/* Gender */}
        <fieldset>
          <legend className="block font-semibold mb-2 text-gray-700">
            Gender
          </legend>
          <div className="flex items-center gap-4" role="radiogroup">
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-base-200 px-2 py-1 rounded"
              >
                <input
                  type="radio"
                  value={option.value}
                  className="radio radio-primary"
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default PersonalDetails;
