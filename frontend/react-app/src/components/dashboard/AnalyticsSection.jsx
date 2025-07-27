import React, { useState, useEffect, useCallback } from 'react';
import { fetchAuthenticated } from '../../api';
import { useAuth } from '../../hooks/useAuth';

// --- UI Helper Components ---

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

// --- NEW: Donut Chart Component ---
const DonutChart = ({ title, data }) => {
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = -90; // Start at the top

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Chart */}
                <div className="relative w-48 h-48 mx-auto">
                    <svg viewBox="0 0 200 200">
                        {data.map((item, index) => {
                            const percentage = (item.value / totalValue) * 100;
                            const strokeDashoffset = circumference * (1 - percentage / 100);
                            const rotation = accumulatedAngle;
                            accumulatedAngle += (percentage / 100) * 360;

                            return (
                                <circle
                                    key={index}
                                    r={radius}
                                    cx="100"
                                    cy="100"
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="25"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform={`rotate(${rotation} 100 100)`}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{totalValue}</span>
                        <span className="text-sm text-gray-500">Total</span>
                    </div>
                </div>
                {/* Legend */}
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center text-sm">
                            <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="font-medium text-gray-600 flex-1">{item.label}</span>
                            <span className="font-semibold text-gray-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- NEW: Updated Skeleton Loader ---
const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 rounded-xl h-24"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl p-6 h-80">
                    <div className="h-6 w-3/4 bg-gray-300 rounded mb-6"></div>
                    <div className="flex items-center gap-4">
                        <div className="w-40 h-40 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-4">
                            <div className="h-5 bg-gray-300 rounded"></div>
                            <div className="h-5 bg-gray-300 rounded"></div>
                            <div className="h-5 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Define color palettes
const statusColors = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#6b7280'];
const categoryColors = ['#db2777', '#0891b2', '#16a34a'];


const AnalyticsSection = ({ setAlert }) => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = useCallback(async () => {
        // ... (Functionality remains identical)
        if (!user || !user.username || !user.rawPassword) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const base64Credentials = btoa(`${user.username}:${user.rawPassword}`);
            const headers = { Authorization: `Basic ${base64Credentials}` };
            const response = await fetchAuthenticated('/products', 'GET', headers);
            if (!response.ok) throw new Error(await response.text());
            
            const products = await response.json();
            const statusCounts = products.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] || 0) + 1 }), {});
            const categoryCounts = products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {});
            
            const findTopItem = (counts) => Object.keys(counts).length > 0 ? Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'N/A';

            setAnalytics({
                totalProducts: products.length,
                statusData: Object.entries(statusCounts).map(([label, value], i) => ({ label, value, color: statusColors[i % statusColors.length] })),
                categoryData: Object.entries(categoryCounts).map(([label, value], i) => ({ label, value, color: categoryColors[i % categoryColors.length] })),
                topStatus: findTopItem(statusCounts),
                topCategory: findTopItem(categoryCounts),
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
            setAlert({ message: error.message || 'Failed to load analytics data', type: 'danger' });
        } finally {
            setLoading(false);
        }
    }, [user, setAlert]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    return (
        <div className="bg-white p-6 ">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Product Analytics</h2>
                    <p className="mt-1 text-gray-500">A visual overview of the product pipeline.</p>
                </div>
                <button onClick={loadAnalytics} className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} aria-label="Refresh analytics">
                    <svg className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" /></svg>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <SkeletonLoader />
            ) : !analytics ? (
                <div className="text-center bg-red-50 text-red-700 py-10 px-6 rounded-lg border border-red-200">
                    <h3 className="text-lg font-medium">Could Not Load Data</h3>
                    <p className="mt-1 text-sm">There was an error fetching the analytics data. Please try again.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} title="Total Products" value={analytics.totalProducts} />
                        <StatCard icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Top Status" value={analytics.topStatus} />
                        <StatCard icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h2.5S10 3 10 5" /></svg>} title="Top Category" value={analytics.topCategory} />
                    </div>

                    {/* Donut Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DonutChart title="Products by Status" data={analytics.statusData} />
                        <DonutChart title="Products by Category" data={analytics.categoryData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsSection;