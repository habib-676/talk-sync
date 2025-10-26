export const Button = ({ children, size, variant, className, ...props }) => {
  const baseClasses =
    "px-6 py-3 rounded-full font-semibold transition-colors duration-200";
  let sizeClasses = "";
  if (size === "lg") sizeClasses = "px-8 py-4 text-lg";

  let variantClasses = "";
  if (variant === "outline") variantClasses = "border-2";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
