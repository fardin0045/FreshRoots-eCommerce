import { Skeleton } from '@/components/ui/skeleton';
import { setCart } from '@/redux/productSlice';
import axios from 'axios';
import { ShoppingCart, Heart, Clock } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName, offerPercentage } = product || {};
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const hasDiscount = offerPercentage > 0;
  const discountedPrice = hasDiscount
    ? Math.round(productPrice - (productPrice * offerPercentage) / 100)
    : productPrice;
const API_URL = import.meta.env.VITE_API_URL;
  const addToCart = async (productId) => {
    setAddingToCart(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/carts/add`,
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        toast.success('Added to cart!');
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1.5px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <Skeleton style={{ width: '100%', aspectRatio: '1/1' }} />
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skeleton style={{ height: 12, width: '60%', borderRadius: 8 }} />
          <Skeleton style={{ height: 16, width: '90%', borderRadius: 8 }} />
          <Skeleton style={{ height: 16, width: '50%', borderRadius: 8 }} />
          <Skeleton style={{ height: 44, width: '100%', borderRadius: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes badgePop {
          0% { transform: scale(0.7) rotate(-8deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(220,38,38,0.3); }
          50% { box-shadow: 0 6px 28px rgba(220,38,38,0.55); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }

        .pc-card {
          position: relative;
          background: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #e8e8e8;
          overflow: hidden;
          
          flex-direction: column;
          width: 100%;
          height: 100%;
          transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
          cursor: default;
          display: flex;
        }
        .pc-card:hover {
          box-shadow: 0 16px 48px rgba(0,0,0,0.13);
          transform: translateY(-4px);
          border-color: #d4d4d4;
        }

        /* Image zone */
        .pc-img-zone {
          position: relative;
          background-color:white;
          
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          cursor: pointer;
        }
        .pc-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          
          transition: transform 0.55s cubic-bezier(0.34,1.2,0.64,1);
          display: block;
        }
        .pc-card:hover .pc-img {
          transform: scale(1.07);
        }

        /* Discount badge — corner ribbon style */
        .pc-discount-badge {
          position: absolute;
          top: 0;
          left: 0;
          background: #dc2626;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.2;
          padding: 7px 10px 7px 10px;
          border-bottom-right-radius: 12px;
          text-align: center;
          letter-spacing: 0.01em;
          animation: badgePop 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
          z-index: 10;
          min-width: 42px;
        }
        .pc-discount-badge span {
          display: block;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        /* Wishlist */
        .pc-wishlist {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s;
          z-index: 10;
        }
        .pc-card:hover .pc-wishlist {
          opacity: 1;
          transform: scale(1);
        }
        .pc-wishlist:hover {
          background: #fff !important;
          transform: scale(1.1) !important;
        }
        .pc-wishlist.active {
          animation: heartPop 0.35s ease;
        }

        /* Body */
        .pc-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          animation: slideUp 0.3s ease both;
        }

        .pc-delivery {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #888;
          font-style: italic;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .pc-name {
          font-size: 14.5px;
          font-weight: 700;
          color: #111;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 40px;
          cursor: pointer;
          transition: color 0.2s;
          margin-bottom: 10px;
        }
        .pc-name:hover { color: #dc2626; }

        .pc-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .pc-original {
          font-size: 10px;
          color: #aaa;
          text-decoration: line-through;
          font-weight: 400;
        }
        .pc-discounted {
          font-size: 20px;
          font-weight: 900;
          color: #16a34a;
          letter-spacing: -0.03em;
        }
        .pc-discounted .curr {
          font-size: 13px;
          font-weight: 700;
        }
        .pc-per {
          font-size: 12px;
          color: #999;
          font-weight: 500;
        }

        /* Add to bag button */
        .pc-btn {
          width: 100%;
          height: 46px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
          color: #fff;
          background: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.02em;
          margin-top: auto;
          transition: background 0.25s ease, transform 0.2s ease;
          animation: btnPulse 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        .pc-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          background-size: 250% 100%;
          background-position: 200% 0;
          transition: background-position 0.5s ease;
        }
        .pc-btn:hover::after {
          background-position: -50% 0;
        }
        .pc-btn:hover {
          background: #b91c1c;
          transform: scale(1.02);
          animation: none;
          box-shadow: 0 6px 22px rgba(220,38,38,0.45);
        }
        .pc-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          animation: none;
          transform: none;
        }
        .pc-btn-icon {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .pc-btn:hover .pc-btn-icon {
          transform: translateX(2px) rotate(-8deg);
        }
      `}</style>

      <div className="pc-card ">
        {/* Image zone */}
        <div
          className="pc-img-zone bg-white"
          onClick={() => navigate(`/products/${product._id}`)}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img src={productImg?.[0]?.url} alt={productName} className=" pc-img " />

          {/* Discount badge — only if discount exists */}
          {hasDiscount && (
            <div className="pc-discount-badge">
              <span>৳{productPrice - discountedPrice}</span>
              OFF
            </div>
          )}

          {/* Wishlist */}
          <button
            className={`pc-wishlist${wishlisted ? ' active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setWishlisted(w => !w); }}
            aria-label="Wishlist"
          >
            <Heart
              size={15}
              fill={wishlisted ? '#ef4444' : 'none'}
              stroke={wishlisted ? '#ef4444' : '#555'}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Card body */}
        <div className="pc-body">
          <div className="pc-delivery">
            <Clock size={11} />
            Delivery 1–2 hours
          </div>

          <h2
            className="pc-name"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {productName}
          </h2>

          <div className="pc-price-row">
            {hasDiscount && (
              <span className="pc-original">{productPrice?.toLocaleString('en-BD')}</span>
            )}
            <span className="pc-discounted">
              <span className="text-xl -">৳ </span>
              {discountedPrice?.toLocaleString('en-BD')}
            </span>
            <span className="pc-per">Per Piece</span>
          </div>

          <button
            className="pc-btn"
            onClick={() => addToCart(product._id)}
            disabled={addingToCart}
          >
            <ShoppingCart size={17} className="pc-btn-icon" />
            {addingToCart ? 'Adding…' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;