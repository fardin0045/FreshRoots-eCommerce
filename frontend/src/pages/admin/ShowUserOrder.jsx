import OrderCard from '@/components/OrderCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShowUserOrder = () => {
  const [userOrder, setUserOrder] = useState(null);
  const params = useParams();

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const res = await axios.get(
      `http://localhost:8000/api/orders/user-order/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };
  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <>
      <div className='lg:pl-20 lg:mt-10 md:mt-15 sm:mt-10'>
        <OrderCard userOrder={userOrder} />
      </div>
    </>
  );
};

export default ShowUserOrder;
