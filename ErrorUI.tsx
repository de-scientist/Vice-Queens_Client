import React from "react";

interface ErrorUIProps {
  message: string;
  suggestion?: string;
}

const ErrorUI: React.FC<ErrorUIProps> = ({ message, suggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-red-500 text-6xl mb-4">
        <i className="fas fa-exclamation-circle" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
      {suggestion && <p className="text-gray-600 text-center">{suggestion}</p>}
    </div>
  );
};

export default ErrorUI;
