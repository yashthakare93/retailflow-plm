import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { fetchAuthenticated } from '../../api';

// --- Helper Components & Icons ---

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white mr-3" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const StepIndicator = ({ currentStep }) => {
    const steps = ['Product Info', 'Details & Image', 'Review'];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        {stepIdx < currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-indigo-600"></div>
                                </div>
                                <span className="relative flex h-8 w-8 items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-900">
                                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </>
                        ) : stepIdx === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200"></div>
                                </div>
                                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-indigo-600 rounded-full" aria-current="step">
                                    <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" aria-hidden="true"></span>
                                </span>
                                <span className="absolute -bottom-6 text-xs font-semibold text-indigo-600">{step}</span>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200"></div>
                                </div>
                                <span className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
                                    <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" aria-hidden="true"></span>
                                </span>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};


// --- Main CreateProductSection Component ---

const CreateProductSection = ({ setAlert, onProductCreated }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        description: '',
        category: 'Apparel',
        season: '', // <-- ADDED: New state for the season input
        image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (Core submission logic is unchanged)
        if (!user || !user.username || !user.rawPassword) {
            setAlert({ message: 'Authentication error. Please log in again.', type: 'danger' });
            return;
        }
        setIsSubmitting(true);
        try {
            const base64Credentials = btoa(`${user.username}:${user.rawPassword}`);
            const headers = { Authorization: `Basic ${base64Credentials}` };
            const { image, ...dataToSend } = formData;
            const response = await fetchAuthenticated('/products', 'POST', headers, dataToSend);

            if (!response.ok) {
                throw new Error(await response.text() || 'Failed to create product');
            }
            setAlert({ message: 'Product submitted for approval!', type: 'success' });
            onProductCreated();
        } catch (error) {
            setAlert({ message: error.message, type: 'danger' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 0: // Product Info
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} placeholder="e.g., Men's Classic T-Shirt"  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID / SKU</label>
                            <input type="text" name="productId" id="productId" required value={formData.productId} onChange={handleChange} placeholder="e.g., SKU-12345"  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={nextStep} disabled={!formData.name || !formData.productId} className="btn-primary">
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                );
            case 1: // Details & Image
                return (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full  bg-white">
                                    <option>Apparel</option>
                                    <option>Footwear</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
    
                             <div>
                                <label htmlFor="season" className="block text-sm font-medium text-gray-700">Season / Collection</label>
                                <input type="text" name="season" id="season" value={formData.season} onChange={handleChange} placeholder="e.g., Fall/Winter 2025"  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                         </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange}  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Provide a brief description of the product..."></textarea>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700">Product Image (Optional / Non - functional)</label>
                             <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                 <div className="text-center">
                                     <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
                                     <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                         <label htmlFor="image" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                             <span>Upload a file</span>
                                             <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                                         </label>
                                         <p className="pl-1">or drag and drop</p>
                                     </div>
                                     <p className="text-xs leading-5 text-gray-600">{formData.image ? `Selected: ${formData.image.name}` : 'PNG, JPG, GIF up to 10MB'}</p>
                                 </div>
                             </div>
                         </div>
                        <div className="flex justify-between pt-4">
                            <button type="button" onClick={prevStep} className="btn-secondary">
                                &larr; Back
                            </button>
                            <button type="button" onClick={nextStep} className="btn-primary">
                                Review &rarr;
                            </button>
                        </div>
                    </div>
                );
            case 2: // Review
                return (
                    <div className="space-y-6">
                        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Review Details</h3>
                            <p><strong>Product Name:</strong> {formData.name}</p>
                            <p><strong>Product ID:</strong> {formData.productId}</p>
                            <p><strong>Category:</strong> {formData.category}</p>
                            {/* --- NEW FIELD DISPLAYED HERE --- */}
                            <p><strong>Season:</strong> {formData.season || 'N/A'}</p>
                            <p><strong>Description:</strong> {formData.description || 'N/A'}</p>
                             {formData.image && <p><strong>Image:</strong> {formData.image.name}</p>}
                        </div>
                        <div className="flex justify-between pt-4">
                            <button type="button" onClick={prevStep} className="btn-secondary">
                                &larr; Edit
                            </button>
                            <button type="submit" className="btn-success w-48" disabled={isSubmitting}>
                                {isSubmitting && <SpinnerIcon />}
                                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-3xl mx-auto border border-gray-200">
            <div className="mb-10">
                <StepIndicator currentStep={step} />
            </div>
            <form onSubmit={handleSubmit}>
                {renderStepContent()}
            </form>
        </div>
    );
};

export default CreateProductSection;