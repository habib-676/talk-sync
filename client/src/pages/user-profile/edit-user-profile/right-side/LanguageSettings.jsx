import { X } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

const LanguageSettings = () => {
  const { register } = useFormContext();
  return (
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Language Settings</h2>

      <div className="space-y-4">
        {/* native language */}
        <div>
          <label htmlFor="country" className="block font-semibold mb-1">
            Native Language
          </label>
          <select
            defaultValue="Select a language"
            className="select appearance-none w-full"
            {...register("user_country", { required: true })}
          >
            <option>English</option>
            <option>Bengali</option>
            <option>Hindi</option>
            <option>German</option>
            <option>Mandarin</option>
          </select>
        </div>

        {/* leaning language */}
        <div>
          <label htmlFor="country" className="block font-semibold mb-1">
            Leaning Languages
          </label>
          {/* selected language */}
          <div className="my-3 space-x-3">
            <span className="badge badge-primary">
              French <X />
            </span>
            <span className="badge badge-primary">
              French <X />
            </span>
          </div>
          <select
            defaultValue="Select language"
            className="select appearance-none w-full"
            {...register("user_country", { required: true })}
          >
            <option>English</option>
            <option>Bengali</option>
            <option>Hindi</option>
            <option>German</option>
            <option>Mandarin</option>
          </select>
        </div>

        {/*  proficiency level */}
        <div>
          <label htmlFor="country" className="block font-semibold mb-1">
            Proficiency Level
          </label>
          <select
            defaultValue="Select your level"
            className="select appearance-none w-full"
            {...register("user_country", { required: true })}
          >
            <option value="" disabled={true}>Select your level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Professional</option>
            <option>Fluent</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default LanguageSettings;
