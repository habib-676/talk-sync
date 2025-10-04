import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";
import { useState } from "react";

const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const { updateUserPassword, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await updateUserPassword(
        data.currentPassword,
        data.newPassword
      );

      if (result.success) {
        toast.success(result.message || "Password updated successfully!");
        reset();
        // Close modal
        document.getElementById("changePasswordModal").checked = false;
      } else {
        toast.error(result.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm font-medium mb-1">
          Current Password
        </label>
        <input
          type="password"
          placeholder="Enter current password"
          {...register("currentPassword", {
            required: "Current password is required",
          })}
          className="input input-bordered w-full"
        />
        {errors.currentPassword && (
          <p className="text-error text-sm mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          placeholder="Enter new password (min. 6 characters)"
          {...register("newPassword", {
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="input input-bordered w-full"
        />
        {errors.newPassword && (
          <p className="text-error text-sm mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Confirm new password"
          {...register("confirmNewPassword", {
            required: "Please confirm your new password",
            validate: (value) =>
              value === watch("newPassword") || "Passwords do not match",
          })}
          className="input input-bordered w-full"
        />
        {errors.confirmNewPassword && (
          <p className="text-error text-sm mt-1">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="modal-action">
        <label
          htmlFor="changePasswordModal"
          className="btn"
          disabled={isSubmitting}
        >
          Cancel
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
