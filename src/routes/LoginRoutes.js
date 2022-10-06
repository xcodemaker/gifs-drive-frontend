import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/Login3')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/Register3')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MainLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/',
            element: <AuthLogin />
        },
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        }
    ]
};

export default LoginRoutes;
