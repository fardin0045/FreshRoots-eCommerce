import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setProducts } from '@/redux/productSlice';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Products } from '../Products';
import { Loader2 } from 'lucide-react';

const AddProduct = () => {
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: '',
    productPrice: 0,
    productDesc: '',
    productImg: [],
    brand: '',
    category: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', productData.productName);
    formData.append('productPrice', productData.productPrice);
    formData.append('productDesc', productData.productDesc);
    formData.append('brand', productData.brand);
    formData.append('category', productData.category);
    if (productData.productImg.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    productData.productImg.forEach((img) => {
      formData.append('files', img);
    });
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/products/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-green-50 lg:pl-[120px] md:pl-[120px] py-8 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Add New Product
        </h1>

        <p className="text-gray-500 mt-2">
          Create and publish a new product to your store.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Top Banner */}
          <div className="h-3 bg-gradient-to-r from-green-600 to-emerald-500" />

          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Product Information</CardTitle>

            <CardDescription>
              Fill in the details below to add a product.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid lg:grid-cols-[1fr_350px] gap-10">
              {/* LEFT */}
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Product Name</Label>

                  <Input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    placeholder="Organic Apple"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Price</Label>

                  <Input
                    type="number"
                    name="productPrice"
                    value={productData.productPrice}
                    onChange={handleChange}
                    placeholder="499"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Brand</Label>

                    <Input
                      type="text"
                      name="brand"
                      value={productData.brand}
                      onChange={handleChange}
                      placeholder="ACI"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Category</Label>

                    <Input
                      type="text"
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      placeholder="Fruits"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Product Description</Label>

                  <Textarea
                    rows={6}
                    name="productDesc"
                    value={productData.productDesc}
                    onChange={handleChange}
                    placeholder="Write product details..."
                    className="rounded-xl resize-none"
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <h3 className="font-semibold text-lg mb-4">Product Images</h3>

                  <ImageUpload
                    productData={productData}
                    setProductData={setProductData}
                  />

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-2">Quick Tips</h4>

                    <ul className="text-sm text-gray-500 space-y-2">
                      <li>• Upload high quality images</li>
                      <li>• Use a clear product name</li>
                      <li>• Add detailed descriptions</li>
                      <li>• Choose the correct category</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-gray-50 px-6 py-5">
            <Button
              disabled={loading}
              onClick={submitHandler}
              className="
              ml-auto
              h-12
              px-8
              rounded-xl
              bg-gradient-to-r
              from-green-600
              to-emerald-500
              hover:from-green-700
              hover:to-emerald-600
              text-white
              shadow-lg
            "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Product...
                </span>
              ) : (
                'Add Product'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
