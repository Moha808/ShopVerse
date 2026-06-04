const Loader = ({ size = "default", text = "" }) => {
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    default: "w-10 h-10 border-3",
    large: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className={`${sizeClasses[size]} border-surface-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm text-surface-500 font-medium animate-pulse-soft">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
