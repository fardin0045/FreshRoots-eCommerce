import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Edit, Edit2, Eye, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLogo from '../../assets/user.jpg';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()
  const getAllUsers = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(`${API_URL}/api/users/all-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Search users 
  const filteredUser = users.filter(
    (user) =>
      `
  ${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="lg:pl-27 md:pl-60 py-20 pr-20 mx-auto px-4 ">
      <h1 className="font-bold text-2xl">User Management</h1>
      <p>View and manage registered users</p>
      <div className="flex relative w-[300px] mt-6">
        <Search className="absolute left-2 top-1 text-gray-400 " />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" p-2 pl-10 text-xl border "
          placeholder="Search users"
        />
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2 mt-4 mx-auto ">
        {/* {users.map((user, index) =>  --before applying search { */}
        {filteredUser.map((user, index) => {
          return (
            <div key={index} className="bg-gray-100 p-5 rounded-xl">
              <div className="flex items-center gap-2">
                <img
                  src={user?.profilePic || UserLogo}
                  className="rounded-full w-16 aspect-square object-cover border border-green-500"
                  alt=""
                />
                <div>
                  <h1 className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <h4>{user?.email}</h4>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <Button onClick={()=>navigate(`/dashboard/users/${user?._id}`)} variant='outline' className="bg-black text-white rounded-lg cursor-pointer">
                  <Edit />
                  Edit
                </Button>
                <Button onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)} className="bg-black text-white rounded-lg cursor-pointer">
                  <Eye />
                  Show Order
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
