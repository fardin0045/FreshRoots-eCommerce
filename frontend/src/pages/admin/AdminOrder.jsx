
import { useEffect, useState } from 'react'
import axios from 'axios'

const AdminOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/orders/all-order', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      // normalize response to an array
      const data = response.data
      setOrders(Array.isArray(data) ? data : (data?.orders || []))
      setError(null)
    } catch (err) {
      setError('Failed to fetch orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      await axios.put(`http://localhost:8000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (err) {
      console.error('Failed to update order status:', err)
      setError('Failed to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <div className="p-6">Loading orders...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Paid: 'bg-blue-100 text-blue-800',
    Failed: 'bg-red-100 text-red-800',
    Cancelled: 'bg-gray-100 text-gray-800'
  }
  const statusOptions = ['Pending', 'Paid', 'Failed', 'Cancelled']

  return (
    <div className="p-6 lg:pl-20 md:pl-40">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
      
      {(Array.isArray(orders) && orders.length === 0) ? (
        <div className="text-gray-500">No orders found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-3 text-left">Order ID</th>
                <th className="border border-gray-300 p-3 text-left">Customer</th>
                <th className="border border-gray-300 p-3 text-left">Total Amount</th>
                <th className="border border-gray-300 p-3 text-left">Status</th>
                <th className="border border-gray-300 p-3 text-left">Date</th>
                <th className="border border-gray-300 p-3 text-left">Items</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(orders) ? orders : []).map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{order._id}</td>
                  <td className="border border-gray-300 p-3">
                    {order.user?.name || order.user?.email || 'Unknown'}
                  </td>
                  <td className="border border-gray-300 p-3">
                    ৳{order.amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className={`px-3 py-1 rounded font-semibold ${
                        statusColors[order.status] || 'bg-gray-100'
                      } cursor-pointer disabled:opacity-50`}
                    >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {order.products?.length || 0} item(s)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrder