import { Product } from '../models/productModel.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand,section, offerPercentage, } =
      req.body;
    const userId = req.id;
    if (!productName || !productPrice || !productDesc || !category || !brand || !section ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    //Handle Multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: 'mern_products', //cloudinary folder name
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    } //create a product in db
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
       section,
        offerPercentage,
      productImg, // array of objects[]
    });
    return res.status(200).json({
      success: true,
      message: 'Product added Successfully',
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (_, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'No product available ',
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//delete
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product Not found',
      });
    }
    //delete image from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }
    //delete product from mongodb
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: 'Product deleted Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
       section,
        offerPercentage,
      existingImages,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found',
      });
    }
    let updatedImages = [];
    //keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );
      //delete only removed images
      const removeImages = product.productImg.filter((img) =>
        !keepIds.includes(img.public_id),
      );
      for (let img of removeImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg; //keep all if nothing save
    }

    //upload new images if any
    if(req.files && req.files.length > 0){
        for (let file of req.files){
            const fileUri = getDataUri(file);
            const result = await cloudinary.uploader.upload(fileUri,{folder:"mern_products"});
            updatedImages.push({
                url:result.secure_url,
                public_id:result.public_id
            })
        }
    }
    //update  products
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice =
      productPrice !== undefined ? Number(productPrice) : product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.section = section?.trim() || product.section;
    product.offerPercentage =
      offerPercentage !== undefined
        ? Number(offerPercentage)
        : product.offerPercentage;
    product.productImg = updatedImages;

    await product.save();
    return res.status(200).json({
        success:true,
        message:"Product Updated successfully",
        product
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
