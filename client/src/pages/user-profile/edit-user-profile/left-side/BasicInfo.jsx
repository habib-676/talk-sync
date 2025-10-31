import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { KeyRound, User, Mail } from "lucide-react"; // Added User and Mail icons
import { useFormContext } from "react-hook-form";
import ChangePasswordForm from "./ChangePasswordForm"; // Assuming this component exists

const BasicInfo = () => {
  const { user } = useAuth();
  const { register } = useFormContext();

  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Basic Information
      </h2>
      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="font-semibold mb-2 text-gray-700 flex items-center gap-2"
          >
            <User size={18} className="text-blue-500" /> Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Full Name is required" })}
            placeholder="Enter your full name"
            className="input input-bordered w-full rounded-lg px-4 py-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        {/* User Email */}
        <div>
          <label
            htmlFor="email"
            className="font-semibold mb-2 text-gray-700 flex items-center gap-2"
          >
            <Mail size={18} className="text-indigo-500" /> Email
          </label>
          <input
            type="email"
            id="email"
            defaultValue={user?.email}
            disabled
            className="input input-bordered w-full rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed border-gray-300"
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed.</p>
        </div>
        {/* Open Modal Button */}
        <div>
          <label
            htmlFor="changePasswordModal"
            className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-full px-6 text-sm font-semibold mt-2"
          >
            <KeyRound size={16} />
            Change Password
          </label>
        </div>

        {/* Modal for Change Password */}
        <input
          type="checkbox"
          id="changePasswordModal"
          className="modal-toggle"
        />
        <div className="modal" role="dialog">
          <div className="modal-box p-6 bg-white rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl text-gray-800 mb-5">
              Change Password
            </h3>
            <ChangePasswordForm />
            <div className="modal-action">
              <label
                htmlFor="changePasswordModal"
                className="btn btn-sm btn-ghost"
              >
                Close
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
