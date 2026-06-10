import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="w-full lg:ml-60 md:ml-20 lg:pr-20 sm:mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
