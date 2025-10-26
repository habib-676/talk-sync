import React from "react";
import { useFormContext } from "react-hook-form";

const StatusAndRole = () => {
  const { register } = useFormContext();
  return (
    <section className="bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Status & Role</h2>
      <div>
        {/* status toggle button */}
        <div className="flex  items-center justify-between">
          <label htmlFor="status" className="block font-medium mb-1">
            Online Status
          </label>
          <input
            type="checkbox"
            defaultChecked
            className="toggle toggle-success toggle-lg"
            {...register("status", { required: true })}
          />
        </div>
        {/* user role */}
        <div className="flex items-center justify-between mt-5">
          <label htmlFor="role" className="block font-medium">
            Role
          </label>
          <p className="py-1 px-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-base-100 rounded-full">
            General User
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatusAndRole;
