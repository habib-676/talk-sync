import React from "react";
import { X, Globe, BookOpen, BarChart2 } from "lucide-react";
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
    if (
      selectedLanguage &&
      selectedLanguage !== "" &&
      !learningLanguages.includes(selectedLanguage)
    ) {
      setValue("learning_language", [...learningLanguages, selectedLanguage]);
    }
    e.target.value = ""; // Reset the select input
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
      <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Language Settings
        </h2>
        <div className="space-y-4">
          <div className="skeleton h-12 w-full rounded-lg"></div>
          <div className="skeleton h-12 w-full rounded-lg"></div>
          <div className="skeleton h-12 w-full rounded-lg"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Language Settings
      </h2>

      <div className="space-y-5">
        {/* Native Language */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Globe size={16} className="text-blue-500" /> Native Language
          </label>
          <div className="relative">
            <select
              className={`
                select select-bordered w-full pl-10 pr-4 py-3 rounded-lg
                transition-all duration-200
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50
                ${
                  errors.native_language
                    ? "border-error text-error"
                    : "text-gray-800"
                }
              `}
              {...register("native_language", {
                required: "Native language is required",
              })}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Select your native language
              </option>
              {languages.map((language, index) => (
                <option key={`${language}-${index}`} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Globe size={18} className="text-gray-400" />
            </div>
          </div>
          {errors.native_language && (
            <span className="text-error text-sm mt-1 flex items-center gap-1">
              <X size={14} />
              {errors.native_language.message}
            </span>
          )}
        </div>

        {/* Learning Languages */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen size={16} className="text-blue-500" /> Learning Languages
          </label>

          {/* Selected Learning Languages */}
          {learningLanguages.length > 0 && (
            <div className="my-3 flex flex-wrap gap-2">
              {learningLanguages.map((language, index) => (
                <span
                  key={`${language}-${index}`}
                  className="badge bg-blue-100 text-blue-700 border-blue-200 gap-2 px-3 py-2 text-sm font-medium rounded-full"
                >
                  {language}
                  <X
                    size={14}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={() => removeLearningLanguage(language)}
                  />
                </span>
              ))}
            </div>
          )}

          {/* Add Learning Language */}
          <div className="relative">
            <select
              className="select select-bordered w-full pl-10 pr-4 py-3 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-gray-800"
              onChange={addLearningLanguage}
              value=""
            >
              <option value="" disabled className="text-gray-400">
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
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <BookOpen size={18} className="text-gray-400" />
            </div>
          </div>

          {learningLanguages.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Select languages you want to learn.
            </p>
          )}
        </div>

        {/* Proficiency Level */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <BarChart2 size={16} className="text-blue-500" /> Overall
            Proficiency Level
          </label>
          <div className="relative">
            <select
              className={`
                select select-bordered w-full pl-10 pr-4 py-3 rounded-lg
                transition-all duration-200
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50
                ${
                  errors.proficiency_level
                    ? "border-error text-error"
                    : "text-gray-800"
                }
              `}
              {...register("proficiency_level", {
                required: "Proficiency level is required",
              })}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Select your current level
              </option>
              {proficiencyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <BarChart2 size={18} className="text-gray-400" />
            </div>
          </div>
          {errors.proficiency_level && (
            <span className="text-error text-sm mt-1 flex items-center gap-1">
              <X size={14} />
              {errors.proficiency_level.message}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default LanguageSettings;
