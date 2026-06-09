import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/freshroots.png';
import {
  ShoppingCart,
  Menu,
  User,
} from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';

export const Navbar = () => {
  const {user} =useSelector(store=>store.user)
  const {cart} = useSelector(store => store.product)
  const dispatch = useDispatch();
  const navigate =useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const admin = user?.role === 'admin' ? true : false

  
  const logoutHandler = async ()=>{
    try{
      const res = await axios.post('http://localhost:8000/api/users/logout',{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        dispatch(setUser(null))
        toast.success(res.data.message)
      }

    }catch(error){
      console.log(error)
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="FreshRoots"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Products
            </Link>

            {user && 
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
              >
                <User size={18} />
                Hello ,{user.firstName}
              </Link>
            }
            {admin && 
              <Link
                to={`/dashboard`}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
              >
                <User size={18} />Dashboard
              </Link>
            }
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-green-50 transition"
            >
              <ShoppingCart
                size={24}
                className="text-gray-700"
              />

              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-green-600
                  text-white
                  text-xs
                  min-w-[18px]
                  h-[18px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >
                {cart.items.length || 0}
              </span>
            </Link>

            {/* Login / Logout */}
            {user ? (
              <Button onClick={logoutHandler} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5">
                Logout
              </Button>
            ) : (
              <Button onClick={()=>navigate('/login')} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5">
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

