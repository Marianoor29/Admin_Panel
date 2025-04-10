import React from "react";

interface LoaderProps {
  state: boolean; // This prop controls the visibility of the loader
}

const Loader: React.FC<LoaderProps> = ({ state }) => {
  if (!state) return null; // Return null if the loader is not active

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-lamaPurple rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
