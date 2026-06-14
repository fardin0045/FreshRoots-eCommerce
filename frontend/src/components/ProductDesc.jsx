import axios from "axios"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { useDispatch } from "react-redux"

const API_URL = import.meta.env.VITE_API_URL;
const ProductDesc = ({product}) => {
    const accessToken = localStorage.getItem('accessToken');
    const dispatch = useDispatch()
    const addToCart = async(productId)=>{
        try{
            const res = await axios.post(`${API_URL}/api/carts/add`,{productId},{
                headers:{ 
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(res.data.success){
                toast.success('Product added to cart Successfully');
                dispatch()
            }
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div className="flex flex-col gap-4">
        <h1 className="font-bold text-2xl">{product.productName}</h1>
        <p className="text-gray-700">{product.category} | {product.brand}</p>
        <h2 className="text-pink-700 text-2xl"> <span className="text-2xl  font-semibold">৳</span>{product.productPrice}</h2>
        <p className="line-clamp-3">{product.productDesc}</p>
        <div className="flex gap-2 items-center w-[300px]">
            <p className="font-semibold">Quantity:</p>
            <Input type="number" className="w-14" defaultValue={1} />
        </div>
        <Button onClick={()=>addToCart(product._id)} className='bg-green-700 w-max text-white'>Add To Cart</Button>
    </div>
  )
}

export default ProductDesc