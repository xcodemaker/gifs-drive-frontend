import { Outlet } from 'react-router-dom';
import Header from './Header';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => (
    <div className="w-full h-screen bg-gray-100">
        <Header />
        <Outlet />
    </div>
);

export default MainLayout;
