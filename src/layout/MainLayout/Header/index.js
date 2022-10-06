// ==============================|| MAIN NAVBAR / HEADER ||============================== //

import { Button } from '@mui/material';
import { IconLogout } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const Header = () => {
    const { logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    return (
        <>
            <div className="w-full bg-slate-800 flex items-center justify-between py-2 px-8">
                <div>
                    <h1 className="text-3xl text-white">
                        <a href="#">Gifs Drive</a>
                    </h1>
                </div>
                <div className="flex gap-4 text-white text-lg">
                    {!isLoggedIn && (
                        <>
                            <Button
                                sx={{ padding: 0 }}
                                onClick={() => {
                                    navigate('login', { replace: true });
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                sx={{ padding: 0 }}
                                onClick={() => {
                                    navigate('register', { replace: true });
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                    {isLoggedIn && (
                        <>
                            <a href="/login">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </a>
                            <Button
                                sx={{ padding: 0 }}
                                onClick={() => {
                                    logout();
                                }}
                            >
                                <IconLogout color="white" stroke={1.5} size="24px" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
