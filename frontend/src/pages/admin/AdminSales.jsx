import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const res = await axios.get('http://localhost:8000/api/orders/sales', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setStats({
          totalUsers: res.data.totalUsers,
          totalProducts: res.data.totalProducts,
          totalOrders: res.data.totalOrders,
          totalSales: res.data.totalSales,
          salesByDate: res.data.sales || [],
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Revenue',
      value: `৳${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-30 lg:mt-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Sales Dashboard</h1>

          <p className="text-slate-500 mt-2">
            Monitor revenue, users, products and sales
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-r ${item.gradient} p-6 text-white`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white/80 text-sm">{item.title}</p>

                        <h2 className="text-3xl font-bold mt-2">
                          {item.value}
                        </h2>
                      </div>

                      <div className="bg-white/20 p-3 rounded-2xl">
                        <Icon size={30} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-green-600" />

                <h2 className="text-xl font-bold">Revenue Analytics</h2>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.salesByDate}>
                    <defs>
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#salesGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Analytics */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4">Business Summary</h2>

              <div className="space-y-4 rounded-2xl">
                <div className="flex justify-between rounded-xl">
                  <span>Total Revenue</span>
                  <span className="font-bold text-green-600">
                    ৳{stats.totalSales.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Paid Orders</span>
                  <span className="font-bold">{stats.totalOrders}</span>
                </div>

                <div className="flex justify-between">
                  <span>Products</span>
                  <span className="font-bold">{stats.totalProducts}</span>
                </div>

                <div className="flex justify-between">
                  <span>Users</span>
                  <span className="font-bold">{stats.totalUsers}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4">Performance</h2>

              <div className="flex flex-col justify-center h-full">
                <div className="text-5xl font-bold text-green-600">
                  ৳{stats.totalSales.toLocaleString()}
                </div>

                <p className="text-slate-500 mt-3">
                  Total revenue generated from paid orders
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
