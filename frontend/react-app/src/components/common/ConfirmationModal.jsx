import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                                </svg>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">{children}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isConfirming}
                                className="inline-flex w-full justify-center items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                            >
                                {isConfirming && <SpinnerIcon />}
                                {isConfirming ? 'Logging out...' : 'Confirm Logout'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;