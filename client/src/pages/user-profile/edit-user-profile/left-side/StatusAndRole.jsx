import React from "react";
import { useFormContext } from "react-hook-form";
import { Wifi, UserCog } from "lucide-react"; // Added Wifi and UserCog icons

const StatusAndRole = () => {
  const { register, watch } = useFormContext();
  const isOnline = watch("status", true);

  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Status & Role</h2>
      <div className="space-y-5">
        {/* status toggle button */}
        <div className="flex items-center justify-between py-2">
          <label
            htmlFor="status"
            className=" font-semibold text-gray-700 flex items-center gap-2 cursor-pointer"
          >
            <Wifi
              size={20}
              className={isOnline ? "text-green-500" : "text-gray-400"}
            />
            Online Status
          </label>
          <input
            type="checkbox"
            id="status"
            className="toggle toggle-lg toggle-success"
            {...register("status")}
            defaultChecked
          />
        </div>
        {/* user role */}
        <div className="flex items-center justify-between py-2">
          <label
            htmlFor="role"
            className=" font-semibold text-gray-700 flex items-center gap-2"
          >
            <UserCog size={20} className="text-purple-500" />
            Role
          </label>
          <p className="py-1.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-md shadow-indigo-200">
            General User
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatusAndRole;
