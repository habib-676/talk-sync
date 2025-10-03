import React from "react";
import useAuth from "../../../../hooks/useAuth";
import { KeyRound } from "lucide-react";
import { useFormContext } from "react-hook-form";
import ChangePasswordForm from "./ChangePasswordForm";

const BasicInfo = () => {
  const { user } = useAuth();
  const { register } = useFormContext();

  return (
    <section className="bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
      <div className="space-y-4">
        {/* user name */}
        <div>
          <label htmlFor="displayName" className="block font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            {...register("user_name", { required: false })}
            defaultValue={user?.displayName}
            className="input w-full font-medium"
          />
        </div>
        {/* user email */}
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            defaultValue={user?.email}
            disabled
            className="input w-full"
          />
        </div>
        {/* Open Modal Button */}
        <label
          htmlFor="changePasswordModal"
          className="btn btn-sm btn-outline hover:bg-error hover:text-base-100 transition-all duration-300 cursor-pointer"
        >
          <KeyRound size={16} />
          Change Password
        </label>

        {/* Modal */}
        <input
          type="checkbox"
          id="changePasswordModal"
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Change Password</h3>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
