import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

const AboutMe = () => {
  const { register, setValue, watch } = useFormContext();
  const [newInterest, setNewInterest] = useState("");

  //get current interest
  const interests = watch("interests") || [];

  // Suggested interests list
  const suggestedInterests = [
    "Movie",
    "Dancing",
    "Coding",
    "Hiking",
    "Cooking",
    "Reading",
    "Travel",
    "Music",
    "Photography",
    "Gaming",
    "Sports",
    "Art",
    "Writing",
    "Swimming",
    "Cycling",
    "Yoga",
    "Meditation",
    "Food",
    "Technology",
    "Science",
    "History",
    "Nature",
    "Animals",
    "Fitness",
  ];

  //add interest functionalities
  const addInterest = () => {
    const interestToAdd = newInterest.trim();
    if (interestToAdd && !interests.includes(interestToAdd)) {
      const updatedInterests = [...interests, interestToAdd];
      setValue("interests", updatedInterests);
      setNewInterest("");
    }
  };

  const addSuggestedInterest = (interest) => {
    if (!interests.includes(interest)) {
      const updatedInterests = [...interests, interest];
      setValue("interests", updatedInterests);
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
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">About Me</h2>

      <div className="space-y-4">
        {/* User Bio */}
        <div>
          <label htmlFor="bio" className="block font-semibold mb-2">
            Short Bio
          </label>
          <textarea
            className="textarea textarea-bordered w-full resize-none h-32"
            placeholder="Tell us about yourself, your language learning goals, or what you'd like to share with the community..."
            {...register("bio", {
              required: "Bio is required",
              maxLength: {
                value: 500,
                message: "Bio should not exceed 500 characters",
              },
            })}
          ></textarea>
        </div>

        {/* interests */}
        <div>
          <label className="block font-semibold mb-2">Interests</label>

          {/* Selected Interests */}
          {interests.length > 0 && (
            <div className="my-3 flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="badge badge-success gap-2 px-3 py-2 text-sm font-medium"
                >
                  {interest}
                  <X
                    size={14}
                    className="cursor-pointer hover:scale-110 transition-transform"
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
              className="input input-bordered w-full"
              placeholder="Add an interest..."
              maxLength={30}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={addInterest}
              disabled={!newInterest.trim()}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Suggested Interests */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested interests:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedInterests
                .filter((interest) => !interests.includes(interest))
                .slice(0, 12)
                .map((interest, index) => (
                  <span
                    key={`suggested-${interest}-${index}`}
                    className="badge badge-outline cursor-pointer hover:badge-primary transition-all duration-200"
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
              <span className="text-error ml-2">
                Maximum 10 interests allowed
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
