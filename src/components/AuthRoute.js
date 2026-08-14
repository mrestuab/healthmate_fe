import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import cookie from '../core/helpers/cookie';

const AuthRoute = ({ children }) => {
    const userData = cookie.get("user");
    const location = useLocation();
    

    if (!userData) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default AuthRoute;
