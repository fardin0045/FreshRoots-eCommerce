import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setUser } from '@/redux/userSlice';
import profile from '../../assets/user.jpg';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((store) => store.user);
  const [file, setFile] = useState(null);
  const params = useParams();
  const userId = params.id;
  const [updateUser, setUpdateUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
    profilePic: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUpdateUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile);
    setUpdateUser({...updateUser, profilePic: URL.createObjectURL(selectedFile)})
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
        formData.append('file', file);
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
        if (authUser?._id === userId) {
          dispatch(setUser(res.data.user));
        }
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/users/get-user/${userId}`,
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div className="pt-5 lg:pl-10 md:pl-50 sm:pl-0 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col justify-center items-center min-h-screen gap-6">
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold text-2xl">Update Profile</h1>
          </div>
          <div className="flex w-full flex-col gap-5 lg:flex-row">
            {/* left part */}
            <div className="w-full rounded-3xl bg-white border border-gray-100 p-6 shadow-xl lg:w-1/3">
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
            <div className="w-full rounded-3xl bg-white border border-gray-100 p-8 shadow-xl lg:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label className="font-semibold">First Name</Label>
                    <Input
                      name="firstName"
                      value={updateUser.firstName}
                      onChange={handleChange}
                      className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Last Name</Label>
                    <Input
                      name="lastName"
                      value={updateUser.lastName}
                      onChange={handleChange}
                      className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-semibold">Email Address</Label>
                  <Input
                    disabled
                    value={updateUser.email}
                    className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                  />
                </div>

                <div>
                  <Label className="font-semibold">Profile Photo</Label>
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-xl border bg-gray-50 px-3 py-2 mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label className="font-semibold">Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      value={updateUser.phoneNumber}
                      onChange={handleChange}
                      className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Address</Label>
                    <Input
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label className="font-semibold">City</Label>
                    <Input
                      name="city"
                      value={updateUser.city}
                      onChange={handleChange}
                      className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold">Zip Code</Label>
                    <Input
                      name="zipCode"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      className="h-10 w-full mt-2 rounded-xl border px-3 bg-gray-50"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <Label className="block text-sm font-medium ">Role</Label>
                  <RadioGroup
                    value={updateUser.role}
                    onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex item-center space-x-2">
                      <RadioGroupItem value="user" id="user"/>
                      <Label htmlFor="user">User</Label>
                    </div>
                    <div className="flex item-center space-x-2">
                      <RadioGroupItem value="admin" id="admin"/>
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                  </RadioGroup>
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
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
