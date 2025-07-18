import React from 'react';
import Modal from './Modal';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Hapus", 
    cancelText = "Batal", 
    isLoading = false,
    confirmColorClass = "bg-red-600 hover:bg-red-700"
}) => {

    if (!isOpen) return null;

    return (
        <Modal title={title} onClose={onClose}>
            <div className="text-center">
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2 text-white font-bold rounded-lg ${confirmColorClass}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
