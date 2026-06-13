import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying ...');
  const navigate = useNavigate();

  const verifyEmail = async () => {
    if (!token) {
      setStatus('Invalid verification link.');
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await axios.post(
        `${API_URL}/api/users/Verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStatus('Email verified successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setStatus('Verification failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Verification failed. Please try again.');
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);
  return (
    <div className="relative w-full h-[760px] bg-green-100 overflow-hidden">
      <div  className='min-h-screen flex items-center justify-center'>
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
        <h2 className="text-xl  font-semibold text-gray-700">{status}</h2>
      </div>
      </div>
    </div>
  );
};
