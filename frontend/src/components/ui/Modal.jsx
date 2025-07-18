import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ onClose, children, title }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>

      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
