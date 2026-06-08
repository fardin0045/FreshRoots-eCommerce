import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //Value newar jonne form theke
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    try { 
        setLoading(true)
        const res = await axios.post('http://localhost:8000/api/users/register',formData,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(res.data.success){
            navigate('/verify')
            toast.success(res.data.message)
        }
    }catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }finally{
        setLoading(false)
    }
  }; 

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <Card className="w-full max-w-sm rounded-xl shadow-2xl">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  // data newar jonne
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  // data newar jonne
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                // data newar jonne
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  // data newar jonne
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full hover:bg-green-600 rounded"
          >
           {loading?<><Loader2 className='h-4 w-4 animate-spin mr-2'/>Please wait</>:'Sign up'}
          </Button>
          <p className="text-gray-600">
            Already Have an Account?{' '}
            <Link
              to={'/login'}
              className="hover:underline cursor-pointer text-green-500"
            >
              Sign in
            </Link>{' '}
          </p>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> will add this letter */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
