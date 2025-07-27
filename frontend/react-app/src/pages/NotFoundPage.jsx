import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold">404 - Not Found!</h1>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
                Go Home
            </Link>
        </div>
    );
};

export default NotFoundPage;