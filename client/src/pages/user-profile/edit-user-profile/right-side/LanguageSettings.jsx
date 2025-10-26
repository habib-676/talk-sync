import React from "react";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useCountryLanguage } from "../../../../hooks/useCountryLanguage";

const LanguageSettings = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { languages, loading } = useCountryLanguage();

  const learningLanguages = watch("learning_language") || [];
  const nativeLanguage = watch("native_language");

  const addLearningLanguage = (e) => {
    const selectedLanguage = e.target.value;
    if (selectedLanguage && !learningLanguages.includes(selectedLanguage)) {
      setValue("learning_language", [...learningLanguages, selectedLanguage]);
    }
    e.target.value = "";
  };

  const removeLearningLanguage = (languageToRemove) => {
    setValue(
      "learning_language",
      learningLanguages.filter((lang) => lang !== languageToRemove)
    );
  };

  const proficiencyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "elementary", label: "Elementary" },
    { value: "intermediate", label: "Intermediate" },
    { value: "upper-intermediate", label: "Upper Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "fluent", label: "Fluent" },
    { value: "native", label: "Native" },
  ];

  if (loading) {
    return (
      <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Language Settings</h2>
        <div className="space-y-4">
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-12 w-full"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Language Settings</h2>

      <div className="space-y-4">
        {/* Native Language */}
        <div>
          <label className="block font-semibold mb-2">Native Language</label>
          <select
            className="select select-bordered w-full"
            {...register("native_language", {
              required: "Native language is required",
            })}
            defaultValue=""
          >
            <option value="">Select your native language</option>
            {languages.map((language, index) => (
              <option key={`${language}-${index}`} value={language}>
                {language}
              </option>
            ))}
          </select>
          {errors.native_language && (
            <span className="text-error text-sm mt-1">
              {errors.native_language.message}
            </span>
          )}
        </div>

        {/* Learning Languages */}
        <div>
          <label className="block font-semibold mb-2">Learning Languages</label>

          {/* Selected Learning Languages */}
          {learningLanguages.length > 0 && (
            <div className="my-3 flex flex-wrap gap-2">
              {learningLanguages.map((language, index) => (
                <span
                  key={`${language}-${index}`}
                  className="badge badge-primary gap-2 px-3 py-2 text-sm font-medium"
                >
                  {language}
                  <X
                    size={14}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => removeLearningLanguage(language)}
                  />
                </span>
              ))}
            </div>
          )}

          {/* Add Learning Language */}
          <select
            className="select select-bordered w-full"
            onChange={addLearningLanguage}
            defaultValue=""
          >
            <option value="" disabled>
              Select language to learn
            </option>
            {languages
              .filter((language) => language !== nativeLanguage)
              .filter((language) => !learningLanguages.includes(language))
              .map((language, index) => (
                <option key={`${language}-${index}`} value={language}>
                  {language}
                </option>
              ))}
          </select>

          {learningLanguages.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Select languages you want to learn
            </p>
          )}
        </div>

        {/* Proficiency Level for Learning Languages */}
        <div>
          <label className="block font-semibold mb-2">
            Overall Proficiency Level
          </label>
          <select
            className="select select-bordered w-full"
            {...register("proficiency_level", {
              required: "Proficiency level is required",
            })}
            defaultValue=""
          >
            <option value="">Select your current level</option>
            {proficiencyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {errors.proficiency_level && (
            <span className="text-error text-sm mt-1">
              {errors.proficiency_level.message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default LanguageSettings;
