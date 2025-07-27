import React, { useEffect } from 'react';

const Alert = ({ message, type = 'info', onClose = () => {} }) => {
  // Return null if there's no message to display
  if (!message) {
    return null;
  }

  // Set a timer to automatically close the alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Clean up the timer if the component unmounts or the message changes
    return () => clearTimeout(timer);
  }, [message, onClose]);

  // Define Tailwind CSS classes for different alert types
  const alertClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    danger: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const alertTypeClass = alertClasses[type] || alertClasses.info;

  return (
    <div
      className={`border px-4 py-3 rounded relative mb-4 ${alertTypeClass}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        aria-label="Close"
      >
        <svg
          className="fill-current h-6 w-6"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l3.029-2.651-3.029-2.651a1.2 1.2 0 0 1 1.697-1.697l2.651 3.029 2.651-3.029a1.2 1.2 0 1 1 1.697 1.697l-3.029 2.651 3.029 2.651a1.2 1.2 0 0 1 0 1.697z" />
        </svg>
      </button>
    </div>
  );
};

export default Alert;