import { Input } from '@/components/ui/input';
import { Edit, Search, Trash2 } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { setProducts } from '@/redux/productSlice';

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', editProduct.productName);
    formData.append('productPrice', editProduct.productPrice);
    formData.append('productDesc', editProduct.productDesc);
    formData.append('brand', editProduct.brand);
    formData.append('category', editProduct.category);

    //add existing images publicid

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append('existingImages', JSON.stringify(existingImages));

    //add new file
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append('files', file);
      });
      const API_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await axios.put(
        `${API_URL}/api/products/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success('Product Updated successfully');
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const deleteProductHandler = async (productId) => {
    if (!accessToken) {
      toast.error('Login required');
      return;
    }
    try {
      const res = await axios.delete(
        `${API_URL}/api/products/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success('Product deleted successfully');
        const filteredProducts = products.filter(
          (product) => product._id !== productId,
        );
        dispatch(setProducts(filteredProducts));
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };
  return (
    <div className="lg:pl-20 md:pl-70 py-20 flex flex-col gap-3 min-h-screen ">
      <div className="flex justify-between">
        <div className="relative bg-white rounded-g">
          <Input
            type="text"
            placeholder="Search Product... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] items-center p-5"
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        
      </div>
      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="px-4 ">
            <div className="flex item-center p-2 bg-gray-100 rounded-xl justify-between ">
              <div className="flex gap-1 items-center">
                <img
                  src={product.productImg[0].url}
                  className="w-24 h-24  p-2 rounded-2xl"
                  alt=""
                />
                <h1 className="font-semibold text-xl w-96">
                  {product.productName}
                </h1>
              </div>
              <h1 className="font-semibold pt-6 text-xl text-gray-800">
                ৳{product.productPrice}
              </h1>
              <div className="flex gap-3 pr-6 items-center">
                <Dialog open={open} onOpenChange={setOpen}>
                  <form>
                    <DialogTrigger asChild>
                      <Edit
                        onClick={() => {
                          setOpen(true);
                          setEditProduct(product);
                        }}
                        className="text-green-600 cursor-pointer h-8 w-8  pt-1"
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-156 bg-gray-50 rounded max-h-185 overflow-scroll">
                      <DialogHeader>
                        <DialogTitle>Edit product</DialogTitle>
                        <DialogDescription>
                          Make changes to your product here. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <Label className="font-semibold">Product Name</Label>
                          <Input
                            name="productName"
                            defaultValue="PONDS Dream Flower"
                            value={editProduct?.productName}
                            onChange={handleChange}
                          />
                        </Field>
                        <Field>
                          <Label className="font-semibold">Price</Label>
                          <Input
                            name="productPrice"
                            type="number"
                            defaultValue="0"
                            value={editProduct?.productPrice}
                            onChange={handleChange}
                          />
                        </Field>
                        <Field>
                          <Label className="font-semibold">Brand</Label>
                          <Input
                            name="brand"
                            type="text"
                            defaultValue="PONDS"
                            value={editProduct?.brand}
                            onChange={handleChange}
                          />
                        </Field>
                        <Field>
                          <Label className="font-semibold">Category </Label>
                          <Input
                            name="category"
                            type="text"
                            defaultValue="Beauty"
                            value={editProduct?.category}
                            onChange={handleChange}
                          />
                        </Field>
                        <Field>
                          <Label className="font-semibold">Description </Label>
                          <Textarea
                            name="productDesc"
                            placeholder="Enter brief description of product"
                            value={editProduct?.productDesc}
                            onChange={handleChange}
                          />
                        </Field>
                        <Field>
                          <Label className="font-semibold">Section </Label>
                          <Textarea
                            name="section"
                            placeholder="Enter brief description of product"
                            value={editProduct?.section}
                            onChange={handleChange}
                          />
                        </Field>
                        <ImageUpload
                          productData={editProduct}
                          setProductData={setEditProduct}
                        />
                      </FieldGroup>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSave} type="submit">
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className="text-red-500 cursor-pointer h-8 w-8" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-800">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-black">
                        This action cannot be undone. This will permanently
                        delete product from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="text-red-700"
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminProduct;
