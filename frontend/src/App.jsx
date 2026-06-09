import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { Verify } from "./pages/Verify"
import { VerifyEmail } from "./pages/VerifyEmail"
import Profile from "./pages/Profile"
import { Footer } from "./components/Footer"
import { Products } from "./pages/Products"
import { Cart } from "./pages/Cart"
import Dashboard from "./pages/Dashboard"
import AdminSales from "./pages/admin/AdminSales"
import AddProduct from "./pages/admin/AddProduct"
import AdminProduct from "./pages/admin/AdminProduct"
import AdminOrder from "./pages/admin/AdminOrder"
import ShowUserOrder from "./pages/admin/ShowUserOrder"
import AdminUsers from "./pages/admin/AdminUsers"
import UserInfo from "./pages/admin/UserInfo"
import ProtectedRoute from "./components/ProtectedRoute"
import SingleProduct from "./pages/SingleProduct"

const router = createBrowserRouter([
  {
    path:'/',
    element:<> <Navbar/> <Home/> </>
  },
  {
    path:'/signup',
    element:<> <Signup/> </>
  },
  {
    path:'/login',
    element:<> <Login/> </>
  },
  {
    path:'/verify',
    element:<> <Verify/> </>
  },
  {
    path:'/verify/:token',
    element:<> <VerifyEmail/> </>
  },
  {
    path:'/profile/:userId',
    element:<ProtectedRoute ><Navbar/><Profile/> <Footer/> </ProtectedRoute>
  }
  ,
  {
    path:'/products',
    element:<><Navbar/> <Products/>  </>
  },
  {
    path:'/products/:id',
    element:<><Navbar/> <SingleProduct/>  </>
  }
  ,
  {
    path:'/cart',
    element:<ProtectedRoute><Navbar/> <Cart/> </ProtectedRoute>
  }
  ,
  {
    path:'/dashboard',
    element:<ProtectedRoute adminOnly={true}> <Dashboard/> </ProtectedRoute>,
    children:[
      {
        path:"sales",
        element:<AdminSales/>
      },
      {
        path:"add-product",
        element:<AddProduct/>
      },
      {
        path:"products",
        element:<AdminProduct />
      },
      {
        path:"orders",
        element:<AdminOrder />
      },
      {
        path:"users/orders/:userId",
        element:<ShowUserOrder/>
      },
      {
        path:"users",
        element:<AdminUsers/>
      },
      {
        path:"users/:id",
        element:<UserInfo/>
      },
      
    ]
  }
])
function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}
 
export default App