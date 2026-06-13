
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
import { MapPin, Phone, User } from 'lucide-react';
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
      setLoading(true);
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
        formData.append('profilePic', file);
      }
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.put(
        `${API_URL}/api/users/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        setUpdateUser((prev) => ({
          ...prev,
          ...res.data.user,
          profilePic: res.data.user.profilePic || prev.profilePic,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
            Account settings
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600 sm:text-lg">
            Keep your contact information current and update your profile details.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <img
                  src={updateUser.profilePic || profile}
                  alt="profile"
                  className="h-32 w-32 rounded-full border-4 border-emerald-200 object-cover"
                />
                <h2 className="mt-5 text-xl font-semibold text-gray-900">
                  {updateUser.firstName} {updateUser.lastName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{updateUser.email}</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4">
                  <Phone size={20} className="text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-base font-medium text-gray-900">
                      {updateUser.phoneNumber || 'Not added'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4">
                  <MapPin size={20} className="text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-base font-medium text-gray-900">
                      {updateUser.city || 'Unknown city'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4">
                  <User size={20} className="text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-base font-medium text-gray-900">
                      {updateUser.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Account details</h2>
                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Update your profile, email, and address information.
                </p>
              </div>
              <div className="hidden sm:block">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                 {updateUser.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <Label className="font-semibold mb-2">First Name</Label>
                  <Input
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                  />
                </div>
                <div>
                  <Label className=" mb-2 font-semibold">Last Name</Label>
                  <Input
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <Label className="font-semibold mb-2">Email Address</Label>
                <Input
                  disabled
                  value={updateUser.email}
                  className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                />
              </div>

              <div>
                <Label className="font-semibold mb-2">Profile Photo</Label>
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border bg-gray-50 px-4 py-3 mt-2"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <Label className="font-semibold mb-2">Phone Number</Label>
                  <Input
                    name="phoneNumber"
                    value={updateUser.phoneNumber}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="font-semibold mb-2">Address</Label>
                  <Input
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <Label className="font-semibold mb-2">City</Label>
                  <Input
                    name="city"
                    value={updateUser.city}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="font-semibold mb-2">Zip Code</Label>
                  <Input
                    name="zipCode"
                    value={updateUser.zipCode}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border px-4 bg-gray-50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-base font-semibold"
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
