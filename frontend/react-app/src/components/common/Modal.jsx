import React from 'react';

const Modal = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;