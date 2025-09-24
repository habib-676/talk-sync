import React from "react";

const TopSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-secondary/10 py-12">
      <div className="maximum-w mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-24">
        {/* Content Section */}
        <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8">
         
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Speak a New Language, <span className="text-accent">Not Just</span>{" "}
            Learn It.
          </h1>

          {/* Supporting Text*/}
          <p className="text-lg lg:text-xl text-base-content/80 leading-relaxed max-w-2xl mx-auto md:mx-0">
            TalkSync connects you with a global community for real, authentic
            language practice. Move beyond flashcards and find your voice
            through conversation with native speakers around the world.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300">
              Find Your Partner
            </button>
            <button className="btn btn-outline btn-lg rounded-full px-8 border-2 border-base-content/20 hover:border-accent hover:bg-accent/10 transition-all duration-300">
              How It Works
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0 lg:mr-4">
          <div className="relative w-full max-w-md lg:max-w-lg">
            {/* Main Image with subtle shadow and rounded corners */}
            <img
              src="https://res.cloudinary.com/dnh9rdh01/image/upload/v1758187293/7423499_pud49n.jpg"
              alt="Two people from different cultures happily video calling through TalkSync"
              className="rounded-2xl shadow-2xl w-full z-10 relative ring-2 ring-base-200 ring-opacity-50"
            />
            {/*  Decorative background */}
            <div className="absolute -bottom-4 -right-4 -z-0 w-full h-full bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSection;
