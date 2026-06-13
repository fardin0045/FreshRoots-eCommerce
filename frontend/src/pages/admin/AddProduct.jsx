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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const AddProduct = () => {
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: '',
    productPrice: '',
    productDesc: '',
    productImg: [],
    brand: '',
    category: '',
    section: '',
    offerPercentage: 0,
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

    if (
      !productData.productName ||
      !productData.productPrice ||
      !productData.productDesc ||
      !productData.brand ||
      !productData.category ||
      !productData.section
    ) {
      return toast.error('Please fill all fields');
    }

    if (productData.productImg.length === 0) {
      return toast.error('Please upload at least one image');
    }

    const formData = new FormData();

    formData.append('productName', productData.productName);
    formData.append('productPrice', productData.productPrice);
    formData.append('productDesc', productData.productDesc);
    formData.append('brand', productData.brand);
    formData.append('category', productData.category);
    formData.append('section', productData.section);
    formData.append('offerPercentage', productData.offerPercentage);

    productData.productImg.forEach((img) => {
      formData.append('files', img);
    });

    const API_URL = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/products/add`,
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

        setProductData({
          productName: '',
          productPrice: '',
          productDesc: '',
          productImg: [],
          brand: '',
          category: '',
          section: '',
          offerPercentage: 0,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dcfce7,white,white)] pt-20 lg:pl-[120px] pb-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Create Product
            </h1>

            <p className="text-gray-500 mt-2">
              Add a new product to your ecommerce catalog.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              Admin Dashboard
            </span>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_380px] gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Product Information */}
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>

                <CardDescription>
                  Basic information about your product
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2 block">Product Name</Label>

                  <Input
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    placeholder="Organic Apple"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Brand</Label>

                    <Input
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
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      placeholder="Spices"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Homepage Section</Label>

                  <Input
                    name="section"
                    value={productData.section}
                    onChange={handleChange}
                    placeholder="Spice Up Your Cooking Game"
                    className="h-12 rounded-xl"
                  />

                  {productData.section && (
                    <div className="mt-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Homepage → {productData.section}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Product Price</Label>

                  <Input
                    type="number"
                    name="productPrice"
                    value={productData.productPrice}
                    onChange={handleChange}
                    placeholder="500"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Offer Percentage</Label>

                  <Input
                    type="number"
                    name="offerPercentage"
                    value={productData.offerPercentage}
                    onChange={handleChange}
                    placeholder="20"
                    className="h-12 rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>

              <CardContent>
                <Textarea
                  rows={8}
                  name="productDesc"
                  value={productData.productDesc}
                  onChange={handleChange}
                  placeholder="Write detailed information about your product..."
                  className="rounded-xl resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="border-0 shadow-lg rounded-3xl  top-24">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>

                <CardDescription>Upload product photos</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-3xl p-6">
                  <ImageUpload
                    productData={productData}
                    setProductData={setProductData}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-2xl border bg-white p-4">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {productData.productImg?.[0] ? (
                      <img
                        src={URL.createObjectURL(productData.productImg[0])}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mt-4">
                    {productData.productName || 'Product Name'}
                  </h3>

                  <p className="text-green-600 font-bold text-2xl mt-2">
                    ৳ {productData.productPrice || 0}
                  </p>

                  {productData.offerPercentage > 0 && (
                    <span className="inline-block mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {productData.offerPercentage}% OFF
                    </span>
                  )}

                  <p className="text-gray-500 text-sm mt-3">
                    {productData.brand || 'Brand'}
                  </p>

                  <p className="text-gray-400 text-xs mt-1">
                    {productData.category || 'Category'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li>✓ Use high-quality images</li>
                  <li>✓ Keep product names concise</li>
                  <li>✓ Add complete descriptions</li>
                  <li>✓ Select the correct category</li>
                  <li>✓ Use promotional discounts wisely</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
          <Button
            disabled={loading}
            onClick={submitHandler}
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Product...
              </span>
            ) : (
              'Publish Product'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
