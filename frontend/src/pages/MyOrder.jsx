import OrderCard from '@/components/OrderCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState(null);
  const navigate = useNavigate();

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const res = await axios.get('http://localhost:8000/api/orders/my-order', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    <OrderCard userOrder={userOrder} navigate={navigate}/>
  );
};

export default MyOrder;
