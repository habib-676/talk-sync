import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { X } from "lucide-react";

const AboutMe = () => {
  const { user } = useAuth();
  return (
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">About Me</h2>

      <div className="space-y-4">
        {/* user bio - textarea */}
        <div>
          <label htmlFor="country" className="block font-semibold mb-1">
            Short bio
          </label>
          <textarea className="textarea w-full resize-none" placeholder="Bio">
           
          </textarea>
        </div>
        {/* interests */}
        <div>
          <label htmlFor="country" className="block font-semibold mb-1">
            Interests
          </label>
          {/* selected language */}
          <div className="my-3 space-x-3 space-y-4">
            <span className="badge badge-success">
              Movie <X size={16} />
            </span>
            <span className="badge badge-success">
              Walking <X size={16} />
            </span>
            <span className="badge badge-success">
              Travel <X size={16} />
            </span>
            <span className="badge badge-success">
              Music <X size={16} />
            </span>
            {/* add more interests */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="input w-full font-semibold"
                placeholder="Add an interest..."
              />
              <button className="btn btn-primary">Add +</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
