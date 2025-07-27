import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { fetchAuthenticated } from '../../api';
import { useAuth } from '../../hooks/useAuth';

// --- UI Helper Components ---

// A Skeleton Card for a better loading experience
const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
        <div className="bg-gray-300 h-48 w-full rounded-t-lg"></div>
        <div className="p-5">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="flex justify-between items-center mt-6">
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                <div className="h-10 bg-gray-300 rounded-md w-1/4"></div>
            </div>
        </div>
    </div>
);

// An engaging component for when no products are found
const EmptyState = ({ message }) => (
    <div className="text-center bg-gray-50 py-16 px-6 rounded-lg border-2 border-dashed border-gray-200">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Products Found</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
);


// --- Main ProductsSection Component ---

const ProductsSection = ({ setAlert }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const loadProducts = useCallback(async () => {
        // ... (Functionality remains identical)
        if (!user || !user.username || !user.rawPassword) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const base64Credentials = btoa(`${user.username}:${user.rawPassword}`);
            const headers = { Authorization: `Basic ${base64Credentials}` };
            const endpoint = statusFilter ? `/products/status/${statusFilter}` : '/products';
            const response = await fetchAuthenticated(endpoint, 'GET', headers);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to load products: ${errorText}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                if (text.trim() === '') {
                    setProducts([]);
                } else {
                    throw new Error("Product data was not returned in a valid format.");
                }
            } else {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setAlert({ message: error.message, type: 'danger' });
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [user, statusFilter, setAlert]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleStatusUpdate = async (productId, newStatus) => {
        // ... (Functionality remains identical)
        if (!user || !user.username || !user.rawPassword) return;
        if (!window.confirm(`Are you sure you want to advance status to ${newStatus}?`)) {
            return;
        }
        try {
            const base64Credentials = btoa(`${user.username}:${user.rawPassword}`);
            const headers = { Authorization: `Basic ${base64Credentials}` };
            const response = await fetchAuthenticated(
                `/products/${productId}/status`, 'PUT', headers, { status: newStatus }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update status: ${errorText}`);
            }
            setAlert({ message: `Product status updated to ${newStatus}`, type: 'success' });
            loadProducts();
        } catch (error) {
            console.error('Error updating product status:', error);
            setAlert({ message: error.message, type: 'danger' });
        }
    };
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const canAdvanceStatus = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_APPROVER');

    return (
        <div className="px-6 py-2">
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Status Filter */}
                    <select
                        className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All </option>
                        <option value="DESIGN">Design</option>
                        <option value="PROTOTYPE">Prototype</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PRODUCTION">Production</option>
                        <option value="MARKET">Market</option>
                        <option value="DISCONTINUED">Discontinued</option>
                    </select>
                    {/* Refresh Button */}
                    <button
                        onClick={() => loadProducts()}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                        aria-label="Refresh products"
                    >
                        <svg className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredProducts.length === 0 ? (
                <EmptyState message={statusFilter ? `No products found with status "${statusFilter}". Try another filter.` : 'There are no products to display right now.'} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onStatusUpdate={handleStatusUpdate}
                            canAdvanceStatus={canAdvanceStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsSection;