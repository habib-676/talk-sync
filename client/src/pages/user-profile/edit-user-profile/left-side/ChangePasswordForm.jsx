import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";

const ChangePasswordForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const { updateUserPassword } = useAuth();

  const onsubmit = async (data) => {
    console.log("Final form data", data);
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New password and confirm new password do not match");
      return;
    }

    try {
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully!");
      reset();
      document.getElementById("changePasswordModal").checked = false;
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.message);
      }
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
      <div>
        <label className="block text-sm font-medium mb-1">
          Current Password
        </label>
        <input
          type="password"
          placeholder="Enter current password"
          {...register("currentPassword", { required: true })}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          {...register("newPassword", { required: true })}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          {...register("confirmNewPassword", { required: true })}
          className="input input-bordered w-full"
        />
      </div>

      {/* Actions */}
      <div className="modal-action">
        <label htmlFor="changePasswordModal" className="btn">
          Cancel
        </label>
        <button type="submit" className="btn btn-primary">
          Update Password
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
