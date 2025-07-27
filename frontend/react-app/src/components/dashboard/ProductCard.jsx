import React from 'react';

// --- Helper Data & Components ---

// Defines the visual style for each status using Tailwind CSS classes.
// This makes the component self-contained, with no need for external CSS.
const statusStyles = {
    DESIGN: 'bg-blue-100 text-blue-800',
    PROTOTYPE: 'bg-purple-100 text-purple-800',
    APPROVED: 'bg-green-100 text-green-800',
    PRODUCTION: 'bg-yellow-100 text-yellow-800',
    MARKET: 'bg-indigo-100 text-indigo-800',
    DISCONTINUED: 'bg-gray-100 text-gray-800',
    default: 'bg-gray-100 text-gray-800',
};

// Defines the valid state transitions for a product.
const statusFlow = {
    DESIGN: 'PROTOTYPE',
    PROTOTYPE: 'APPROVED',
    APPROVED: 'PRODUCTION',
    PRODUCTION: 'MARKET',
    MARKET: 'DISCONTINUED',
};

// Icon components for clarity
const CategoryIcon = () => (
    <svg className="h-10 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h2.5S10 3 10 5" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// --- Main ProductCard Component ---

const ProductCard = ({ product, onStatusUpdate, canAdvanceStatus }) => {
    const nextStatus = statusFlow[product.status];
    const showAdvanceButton = nextStatus && canAdvanceStatus;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            {/* Main Content Area */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    {/* Product Name & ID */}
                    <div className="flex-1 pr-4">
                        <h3 className="text-xl font-bold text-gray-800 truncate" title={product.name}>
                            {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">ID: {product.productId}</p>
                    </div>

                    {/* Status Badge */}
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusStyles[product.status] || statusStyles.default}`}>
                        {product.status}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                    {product.description || 'No description provided.'}
                </p>

                {/* Metadata */}
                <div className="flex flex-col space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <CategoryIcon />
                        <span>{product.category || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon />
                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            {/* Footer & Action Button */}
            {showAdvanceButton && (
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                    <button
                        onClick={() => onStatusUpdate(product.id, nextStatus)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors"
                    >
                        <span>Advance to {nextStatus}</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;