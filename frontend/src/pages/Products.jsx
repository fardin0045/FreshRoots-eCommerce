// Products.jsx
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/pages/ProductCard';
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';   // ← NEW
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/redux/productSlice';

export const Products = () => {
  const products  = useSelector((store) => store.product?.products ?? []);
  const dispatch  = useDispatch();

  const [searchParams] = useSearchParams();                // ← read URL params
  const queryFromUrl   = searchParams.get('search') ?? ''; // ← e.g. "tomato"

  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [search,      setSearch]      = useState(queryFromUrl); // ← seed from URL
  const [category,    setCategory]    = useState('All');
  const [brand,       setBrand]       = useState('All');
  const [priceRange,  setPriceRange]  = useState([0, 99999]);
  const [sortOrder,   setSortOrder]   = useState('');

  // Sync search input when user arrives from navbar with a different query
  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);
const API_URL = import.meta.env.VITE_API_URL;
  // Fetch all products once
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products/getAllProducts`);
      if (data?.success) {
        setAllProducts(data.products ?? []);
        dispatch(setProducts(data.products ?? []));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Unable to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Filter + sort whenever any filter state or allProducts changes
  useEffect(() => {
    if (!allProducts.length) return;

    let filtered = [...allProducts];

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'All') filtered = filtered.filter((p) => p.category === category);
    if (brand    !== 'All') filtered = filtered.filter((p) => p.brand    === brand);

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );

    if (sortOrder === 'lowToHigh') filtered.sort((a, b) => a.productPrice - b.productPrice);
    if (sortOrder === 'highToLow') filtered.sort((a, b) => b.productPrice - a.productPrice);

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* Sidebar */}
        <FilterSidebar
          allProducts={allProducts}
          search={search}       setSearch={setSearch}
          brand={brand}         setBrand={setBrand}
          category={category}   setCategory={setCategory}
          priceRange={priceRange} setPriceRange={setPriceRange}
        />

        {/* Main */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
              <p className="text-lg font-medium">No products found</p>
              {search && (
                <p className="text-sm">
                  No results for <strong className="text-gray-600">"{search}"</strong> —
                  try a different term.
                </p>
              )}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {products.map((product, index) => (
              <ProductCard
                key={product?._id ?? product?.id ?? `product-${index}`}
                product={product}
                loading={loading}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};