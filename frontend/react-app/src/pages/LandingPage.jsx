import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/common/AppNavbar';
import Modal from '../components/common/Modal';
import LoginForm from '../components/auth/LoginForm';
import { motion } from 'framer-motion';

// --- Icon Components (No Changes) ---
const LogoIcon = () => (<svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>);
const WorkflowIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3.75h16.5M3.75 12h16.5m-16.5 4.5h16.5" /></svg>);
const AnalyticsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" /></svg>);
const CollaborationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.964A3 3 0 0012 12v-1.5a3 3 0 00-3-3H9M12 12l-3 3m0 0l-3-3m3 3v-1.5" /></svg>);


const LandingPage = () => {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        setLoginModalOpen(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-white text-gray-800">
            <AppNavbar onLoginClick={() => setLoginModalOpen(true)} />

            <main className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pb-40">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto lg:py-32">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                            <div className="mb-6 inline-flex items-center rounded-full border border-green-300 bg-green-50 p-1 text-sm text-green-800">
                                <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-semibold">
                                    Preview Mode
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Bring Your Products from Concept to Market, Faster.
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                RetailFlow PLM is the all-in-one platform that streamlines your entire product lifecycle. Manage designs, track approvals, and gain critical insights—all in one place.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6">
                                <button onClick={() => setLoginModalOpen(true)} className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Get Started
                                </button>
                                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="relative mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow"
                    >
                        <div className="relative mx-auto w-[24rem] h-[24rem] sm:w-[32rem] sm:h-[32rem] lg:w-[36rem] lg:h-[36rem]">
                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } } }} className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-100 rounded-full blur-2xl"></motion.div>
                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.7, duration: 0.5 } } }} className="absolute -bottom-12 -right-12 w-64 h-64 bg-pink-100 rounded-full blur-2xl"></motion.div>

                            {/* Card 1: Product Card (Matches your project) */}
                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 50, rotate: 10 }, visible: { opacity: 1, y: 0, rotate: -6, transition: { type: "spring", stiffness: 100, delay: 0.2 } } }}
                                className="absolute top-10 left-0 w-64 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Classic Denim Jacket</h4>
                                        <p className="text-xs text-gray-500 font-mono">SKU-48291</p>
                                    </div>
                                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Approved</span>
                                </div>
                                <div className="mt-3 h-2 w-3/4 bg-gray-200 rounded-full"></div>
                                <div className="mt-2 h-2 w-1/2 bg-gray-200 rounded-full"></div>
                            </motion.div>

                            {/* --- Card 2 UPDATED: Product Timeline --- */}
                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 50, rotate: -15 }, visible: { opacity: 1, y: 0, rotate: 8, transition: { type: "spring", stiffness: 100, delay: 0.4 } } }}
                                className="absolute bottom-8 right-0 w-72 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100"
                            >
                                <h4 className="font-semibold text-gray-800 text-sm mb-4">Approval Timeline</h4>
                                <div className="space-y-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                                        <span className="text-gray-600">DESIGN</span>
                                        <div className="flex-grow h-px bg-gray-200"></div>
                                        <span className="text-gray-400">July 15</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                                        <span className="text-gray-600">PROTOTYPE</span>
                                        <div className="flex-grow h-px bg-gray-200"></div>
                                        <span className="text-gray-400">July 22</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 rounded-full bg-indigo-500 ring-2 ring-indigo-200"></div>
                                        <span className="font-bold text-indigo-600">APPROVED</span>
                                        <div className="flex-grow h-px bg-gray-200"></div>
                                        <span className="font-bold text-indigo-600">Current</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* --- Card 3 UPDATED: Relatable Roles --- */}
                            <motion.div
                                variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, delay: 0.6 } } }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-md rounded-2xl shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg></div>
                                        <span className="text-xs font-semibold text-gray-700">Designer</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                        <span className="text-xs font-semibold text-gray-700">Approver</span>
                                    </div>
                                    <div className="flex flex-col items-center space-y-1">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l.473-.236A2.25 2.25 0 0114.25 4.5v1.875c0 .309.223.585.526.658l.5.125a2.25 2.25 0 011.664 2.15l-.042 1.05a2.25 2.25 0 01-2.25 2.25H9.75a2.25 2.25 0 01-2.25-2.25l-.042-1.05a2.25 2.25 0 011.664-2.15l.5-.125a.75.75 0 00.526-.658V4.5c0-.412.223-.786.558-1.007l.473-.236a1.125 1.125 0 011.11 1.227z" /></svg></div>
                                        <span className="text-xs font-semibold text-gray-700">Admin</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
            {/* --- FEATURES SECTION --- */}
            <section className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">

                        {/* Left Column: Text & Features */}
                        <div className="lg:pr-8 lg:pt-4">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything You Need</h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">A Better Workflow for Your Retail Business</p>
                                <p className="mt-6 text-lg leading-8 text-gray-600">Stop juggling spreadsheets and disconnected tools. RetailFlow provides a single source of truth for your entire product development process.</p>
                                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-gray-900">
                                            <div className="absolute left-1 top-1 h-5 w-5 text-indigo-600"><WorkflowIcon /></div>
                                            Streamlined Workflows
                                        </dt>
                                        <dd className="inline">: Guide products from design, to prototype, to market with a clear, visual, and role-based approval process.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-gray-900">
                                            <div className="absolute left-1 top-1 h-5 w-5 text-indigo-600"><AnalyticsIcon /></div>
                                            Powerful Analytics
                                        </dt>
                                        <dd className="inline">: Make data-driven decisions with real-time dashboards that track product status, category performance, and more.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-gray-900">
                                            <div className="absolute left-1 top-1 h-5 w-5 text-indigo-600"><CollaborationIcon /></div>
                                            Team Collaboration
                                        </dt>
                                        <dd className="inline">: Enable designers, approvers, and admins to work together seamlessly with specific roles and permissions.</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Right Column: App Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-xl rounded-xl shadow-2xl ring-1 ring-gray-400/10"
                        >
                            <div className="bg-white rounded-t-xl p-2">
                                {/* Browser Toolbar */}
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="relative p-6 bg-gray-100 rounded-b-xl">
                                {/* Stylized UI Content */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 space-y-4">
                                        <div className="p-4 bg-white rounded-lg shadow-sm">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                            <div className="mt-2 h-3 w-1/2 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg shadow-sm">
                                            <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                                            <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <div className="h-10 w-10 bg-indigo-200 rounded-full mx-auto"></div>
                                        <div className="mt-2 h-3 w-full bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                                    <div className="flex items-end gap-2 h-20">
                                        <div className="w-1/4 h-1/2 bg-indigo-300 rounded-md"></div>
                                        <div className="w-1/4 h-full bg-indigo-500 rounded-md"></div>
                                        <div className="w-1/4 h-3/4 bg-indigo-300 rounded-md"></div>
                                        <div className="w-1/4 h-1/3 bg-indigo-300 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>
            {/* --- FOOTER --- */}
            <footer className="bg-white" aria-labelledby="footer-heading">
                <h2 id="footer-heading" className="sr-only">Footer</h2>
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8">
                            <div className="flex items-center gap-2">
                                <LogoIcon />
                                <span className="text-2xl font-bold tracking-tight text-gray-900">RetailFlow</span>
                            </div>
                            <p className="text-sm leading-6 text-gray-600">The modern platform for bringing retail products from concept to market.</p>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">X</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H4.54l4.741 6.343L13.44 2.25zM14.045 19.31L13.01 17.85l-6.333-9.048H5.04l7.85 11.16h1.48L19.01 4.2h1.43l-7.85 11.16h-1.48L14.045 19.31z" /></svg></a>
                                <a href="#" className="text-gray-400 hover:text-gray-500"><span className="sr-only">LinkedIn</span><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></a>
                            </div>
                        </div>
                        <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900">Solutions</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Workflows</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Analytics</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Collaboration</a></li>
                                    </ul>
                                </div>
                                <div className="mt-10 md:mt-0">
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900">Support</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Pricing</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Documentation</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Contact Us</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900">Company</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">About</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Blog</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Careers</a></li>
                                    </ul>
                                </div>
                                <div className="mt-10 md:mt-0">
                                    <h3 className="text-sm font-semibold leading-6 text-gray-900">Legal</h3>
                                    <ul role="list" className="mt-6 space-y-4">
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Privacy</a></li>
                                        <li><a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600">Terms</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
                        <p className="text-xs leading-5 text-gray-500">&copy; {new Date().getFullYear()} RetailFlow, Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <Modal onClose={() => setLoginModalOpen(false)}>
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                </Modal>
            )}
        </div>
    );
};

export default LandingPage;