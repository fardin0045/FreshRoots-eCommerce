import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import profile from '../assets/onik.png';
import { Label } from '@/components/ui/label';
import { Input } from '@base-ui/react';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setUser } from '@/redux/userSlice';
import { Camera, MapPin, Phone, Mail, User, } from 'lucide-react';
const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role,
  });
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    }); //priview only
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    try {
      //use formData for text +file
      const formData = new FormData();
      formData.append('firstName', updateUser.firstName);
      formData.append('lastName', updateUser.lastName);
      formData.append('email', updateUser.email);
      formData.append('phoneNumber', updateUser.phoneNumber);
      formData.append('address', updateUser.address);
      formData.append('city', updateUser.city);
      formData.append('zipCode', updateUser.zipCode);
      formData.append('role', updateUser.role);
      if (file) {
        formData.append('file', file); //image file for backend multer
      }
      const res = await axios.put(
        `http://localhost:8000/api/users/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="profile">
          {/* Top Center Tabs */}
          <div className="flex justify-center mb-10">
            <TabsList className="h-14 bg-white/90 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl p-1">
              <TabsTrigger
                value="profile"
                className="px-8 rounded-xl font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Profile
              </TabsTrigger>

              <TabsTrigger
                value="orders"
                className="px-8 rounded-xl font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Orders
              </TabsTrigger>
            </TabsList>
          </div>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <div className="grid lg:grid-cols-[320px_1fr] gap-8">
              {/* Left Card */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <div className="flex flex-col items-center">
                  <img
                    src={updateUser.profilePic || profile}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
                  />

                  <h2 className="mt-4 text-xl font-bold">
                    {updateUser.firstName} {updateUser.lastName}
                  </h2>

                  <p className="text-gray-500 text-sm">{updateUser.email}</p>

                  <div className="w-full mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-green-600" />
                      <span>{updateUser.phoneNumber || 'Not Added'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-green-600" />
                      <span>{updateUser.city || 'Unknown City'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <User size={18} className="text-green-600" />
                      <span>{updateUser.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Personal Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        name="firstName"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        className="h-12 mt-2 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label>Last Name</Label>
                      <Input
                        name="lastName"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        className="h-12 mt-2 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email Address</Label>
                    <Input
                      disabled
                      value={updateUser.email}
                      className="h-12 mt-2 rounded-xl bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      value={updateUser.phoneNumber}
                      onChange={handleChange}
                      className="h-12 mt-2 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      className="h-12 mt-2 rounded-xl"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label>City</Label>
                      <Input
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        className="h-12 mt-2 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label>Zip Code</Label>
                      <Input
                        name="zipCode"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        className="h-12 mt-2 rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold"
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">Order History</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4">Order ID</th>
                      <th className="text-left py-4">Date</th>
                      <th className="text-left py-4">Status</th>
                      <th className="text-left py-4">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-10 text-gray-500"
                      >
                        No Orders Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
