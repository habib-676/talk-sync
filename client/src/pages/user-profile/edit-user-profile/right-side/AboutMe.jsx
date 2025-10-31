import React, { useState } from "react";
import { Plus, X, AlignLeft, Sparkles } from "lucide-react"; // Added icons
import { useFormContext } from "react-hook-form";

const AboutMe = () => {
  const { register, setValue, watch } = useFormContext();
  const [newInterest, setNewInterest] = useState("");

  //get current interest
  const interests = watch("interests") || [];

  // Suggested interests list
  const suggestedInterests = [
    "Movies & TV",
    "Dancing",
    "Coding & Tech",
    "Hiking & Outdoors",
    "Cooking & Food",
    "Reading & Books",
    "Travel & Culture",
    "Music & Concerts",
    "Photography",
    "Gaming",
    "Sports",
    "Art & Design",
    "Writing",
    "Swimming",
    "Cycling",
    "Yoga & Wellness",
    "Meditation",
    "Science",
    "History",
    "Nature",
    "Animals & Pets",
    "Fitness",
    "Learning Languages",
  ];

  //add interest functionalities
  const addInterest = () => {
    const interestToAdd = newInterest.trim();
    if (interestToAdd && !interests.includes(interestToAdd)) {
      if (interests.length < 10) {
        // Limit to 10 interests
        const updatedInterests = [...interests, interestToAdd];
        setValue("interests", updatedInterests);
        setNewInterest("");
      } else {
        alert("You can add a maximum of 10 interests."); // Or use a toast notification
      }
    }
  };

  const addSuggestedInterest = (interest) => {
    if (!interests.includes(interest)) {
      if (interests.length < 10) {
        // Limit to 10 interests
        const updatedInterests = [...interests, interest];
        setValue("interests", updatedInterests);
      } else {
        alert("You can add a maximum of 10 interests."); // Or use a toast notification
      }
    }
  };

  //remove interests
  const removeInterest = (interestToRemove) => {
    const updatedInterests = interests.filter(
      (interest) => interest !== interestToRemove
    );
    setValue("interests", updatedInterests);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <section className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">About Me</h2>

      <div className="space-y-5">
        {/* User Bio */}
        <div>
          <label
            htmlFor="bio"
            className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <AlignLeft size={16} className="text-blue-500" /> Short Bio
          </label>
          <textarea
            className="textarea textarea-bordered w-full resize-y h-32 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
            placeholder="Tell us about yourself, your language learning goals, or what you'd like to share with the community..."
            {...register("bio", {
              maxLength: {
                value: 500,
                message: "Bio should not exceed 500 characters",
              },
            })}
          ></textarea>
          {/* Display character count or error if needed */}
          {watch("bio") && (
            <p className="text-sm text-gray-500 mt-1 text-right">
              {watch("bio").length} / 500 characters
            </p>
          )}
        </div>

        {/* interests */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" /> Interests
          </label>

          {/* Selected Interests */}
          {interests.length > 0 && (
            <div className="my-3 flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="badge bg-green-100 text-green-700 border-green-200 gap-2 px-3 py-2 text-sm font-medium rounded-full"
                >
                  {interest}
                  <X
                    size={14}
                    className="cursor-pointer text-green-500 hover:text-green-700 transition-colors"
                    onClick={() => removeInterest(interest)}
                  />
                </span>
              ))}
            </div>
          )}

          {/* Add Interest Input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input input-bordered w-full rounded-lg text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
              placeholder="Add an interest..."
              maxLength={30}
              disabled={interests.length >= 10}
            />
            <button
              type="button"
              className="btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-lg shadow-md"
              onClick={addInterest}
              disabled={!newInterest.trim() || interests.length >= 10}
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Suggested Interests */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested interests:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedInterests
                .filter((interest) => !interests.includes(interest))
                .slice(0, 10 - interests.length) // Show only remaining available slots
                .map((interest, index) => (
                  <span
                    key={`suggested-${interest}-${index}`}
                    className="badge badge-outline border-gray-300 text-gray-700 cursor-pointer hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 rounded-full"
                    onClick={() => addSuggestedInterest(interest)}
                  >
                    {interest}
                  </span>
                ))}
            </div>
          </div>

          {/* Interest Count */}
          <div className="mt-3 text-sm text-gray-500">
            {interests.length} of 10 interests added
            {interests.length >= 10 && (
              <span className="text-red-500 ml-2 font-medium flex items-center gap-1">
                <X size={14} /> Maximum 10 interests allowed
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
