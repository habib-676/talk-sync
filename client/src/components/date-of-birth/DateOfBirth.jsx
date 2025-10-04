import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Calendar, AlertCircle } from "lucide-react";

const DateOfBirth = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const dobDay = watch("dob_day");
  const dobMonth = watch("dob_month");
  const dobYear = watch("dob_year");

  // Effect to combine into single field
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const formattedDate = `${dobYear}-${dobMonth
        .toString()
        .padStart(2, "0")}-${dobDay.toString().padStart(2, "0")}`;
      setValue("date_of_birth", formattedDate);
    }
  }, [dobDay, dobMonth, dobYear, setValue]);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
          <Calendar size={16} />
          Date of Birth
        </span>
      </label>

      <div className="grid grid-cols-3 gap-3">
        {/* Day */}
        <div className="form-control">
          <select
            {...register("dob_day", { required: false })}
            className={`select select-bordered w-full ${
              errors.dob_day ? "select-error" : ""
            }`}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Day
            </option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="form-control">
          <select
            {...register("dob_month", { required: false })}
            className={`select select-bordered w-full ${
              errors.dob_month ? "select-error" : ""
            }`}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Month
            </option>
            {[
              { value: 1, label: "Jan" },
              { value: 2, label: "Feb" },
              { value: 3, label: "Mar" },
              { value: 4, label: "Apr" },
              { value: 5, label: "May" },
              { value: 6, label: "Jun" },
              { value: 7, label: "Jul" },
              { value: 8, label: "Aug" },
              { value: 9, label: "Sep" },
              { value: 10, label: "Oct" },
              { value: 11, label: "Nov" },
              { value: 12, label: "Dec" },
            ].map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="form-control">
          <select
            {...register("dob_year", { required: false })}
            className={`select select-bordered w-full ${
              errors.dob_year ? "select-error" : ""
            }`}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Year
            </option>
            {Array.from(
              { length: 120 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Individual field errors */}
      <div className="flex gap-3 mt-2">
        {errors.dob_day && (
          <span className="text-error text-xs flex-1">
            {errors.dob_day.message}
          </span>
        )}
        {errors.dob_month && (
          <span className="text-error text-xs flex-1">
            {errors.dob_month.message}
          </span>
        )}
        {errors.dob_year && (
          <span className="text-error text-xs flex-1">
            {errors.dob_year.message}
          </span>
        )}
      </div>

      {/* Combined validation */}
      <input
        type="hidden"
        {...register("date_of_birth", {
          validate: () => {
            if (!dobDay || !dobMonth || !dobYear) return true;

            const day = parseInt(dobDay);
            const month = parseInt(dobMonth);
            const year = parseInt(dobYear);

            const date = new Date(year, month - 1, day);
            const isValidDate =
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day;

            if (!isValidDate) return "Please select a valid date";

            const today = new Date();
            if (date >= today) return "Date cannot be in the future";

            // Age check
            let age = today.getFullYear() - year;
            const monthDiff = today.getMonth() - (month - 1);
            const dayDiff = today.getDate() - day;
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              age--;
            }

            if (age < 13) return "You must be at least 13 years old";

            // If valid, set formatted value
            const formattedDate = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            setValue("date_of_birth", formattedDate);

            return true;
          },
        })}
      />

      {/* Combined error */}
      {errors.date_of_birth && (
        <label className="label pt-2">
          <span className="label-text-alt text-error flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.date_of_birth.message}
          </span>
        </label>
      )}

      <label className="label">
        <span className="label-text-alt text-gray-500">
          You must be at least 13 years old to use this platform
        </span>
      </label>
    </div>
  );
};

export default DateOfBirth;
