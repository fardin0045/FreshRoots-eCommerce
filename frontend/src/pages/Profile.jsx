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
    <div className="py-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto item-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="Orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-7 text-2xl text-gray-800">
                Update Profile
              </h1>
              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                {/* profile picture */}
                <div className="flex flex-col items-center ">
                  <img
                    src={updateUser.profilePic || profile}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-3 border-green-400"
                  />
                  <Label className="mt-4 cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Change Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                {/* Profile form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
                  action=""
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="Fardin"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Onik"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2 mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      disabled
                      value={updateUser.email}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      type="text"
                      name="phoneNumber"
                      value={updateUser.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your Contact number"
                      className="w-full border rounded-xl px-3 py-2 mt-1 bg-gray-100 "
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Address</Label>
                    <Input
                      type="text"
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      placeholder="Enter your Address"
                      className="w-full border rounded-xl px-3 py-2 mt-1 bg-gray-100 "
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium">City</Label>
                      <Input
                        type="text"
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        placeholder="Enter your City"
                        className="w-full border rounded-xl px-3 py-2 mt-1 bg-gray-100 "
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        placeholder="Enter your City"
                        className="w-full border rounded-xl px-3 py-2 mt-1 bg-gray-100 "
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="text-white w-full mt-4 bg-green-400 hover:bg-green-600 rounded p-2"
                  >Save Change</Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Track performance and user engagement metrics. Monitor trends
                and identify growth opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Page views are up 25% compared to last month.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
