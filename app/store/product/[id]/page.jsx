"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import catPic from "@/public/images/cuban-cat.png";
import ProductDetails from "@/components/store/product/ProductDetails";
import ProductSize from "@/components/store/product/ProductSize";
import AddToCartSection from "@/components/store/product/AddToCartSection";
import ProductMoreDetails from "@/components/store/product/ProductMoreDetails";
import Reviews from "@/components/store/product/Reviews";
import MoreProducts from "@/components/store/product/MoreProducts";
import { FetchApi } from "@/utils/FetchApi";
import { useParams } from "next/navigation";
import { ImgUrl } from "@/constants/urls";
import ProductColor from "@/components/store/product/ProductColor";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useCart } from "@/utils/functions";
import toast from "react-hot-toast";
const Page = () => {
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span className="' + className + ' !w-[15%] !rounded-xl"></span>';
    },
  };
  const [product, setproduct] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setqty] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { refetchCart, products } = useCart();
  const { products: cartItems = [] } = useSelector((state) => state?.cart);
  const { auth } = useAuth();
  useEffect(() => {
    const loadData = async () => {
      const { data } = await FetchApi({
        url: `products/api/get-products/${id}`,
      });

      setproduct(data.data);
      setSelectedSize(data.data.inventory[0]);
      setSelectedColor(data.data.color_list?.[0]);
    };
    loadData();
  }, []);
  const handleAddToCart = async () => {
    if(!auth?.customer?.id) return toast.error("You need to login for add to cart.")
    const productToAdd = {
      product_id: product?.id,
      quantity: qty,
      size: selectedSize?.size,
      color: selectedColor,
      image: product?.images[0]?.image,
      productName: product?.productName,
      salePrice: product?.salePrice,
    };

    // Check if the product already exists in the cart
    const existingProductIndex = cartItems?.findIndex(
      (item) =>
        item.product?.id === productToAdd.product_id &&
        item.size === productToAdd.size &&
        item.color === productToAdd.color
    );

    if (existingProductIndex !== -1) {
      // Product exists, create a new object for the existing product and update its quantity
      const updatedCartItems = [...cartItems];
      const updatedProduct = {
        ...updatedCartItems[existingProductIndex],
        quantity:
          updatedCartItems[existingProductIndex].quantity +
          productToAdd.quantity,
      };
      updatedCartItems[existingProductIndex] = updatedProduct;
      // Dispatch the updated cart
      const data = {
        product_id: product.id,
        quantity: qty,
        size: selectedSize.size,
        color: selectedColor,
      };
      await FetchApi({
        url: `cart/api/cart_manage/${auth?.customer?.id}/update/${product?.id}/`,
        method: "post",
        body: data,
      });
      refetchCart();
    } else {
      // Product doesn't exist, add it to the cart
      const data = {
        product_id: product.id,
        quantity: qty,
        size: selectedSize.size,
        color: selectedColor,
      };
      await FetchApi({
        url: `cart/api/cart_manage/${auth?.customer?.id}/`,
        method: "post",
        body: data,
      });
      refetchCart();
    }
  };
  const handleAddWishlist = async (ids) => {
    try {
      const { data } = await FetchApi({
        url: `/wishlist/api/create_wishlist/`,
        method: "post",
        body: {
          products: ids,
        },
      });
      setWishlist([...wishlist, ...data.data]);
      setPage("");
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };
  return (
    <div className=" container py-16 relative">
      {!product?.id ? (
        <p className="text-4xl text-center h-[50vh]">No product found!</p>
      ) : (
        <>
          <div className="flex w-full gap-10 flex-col lg:flex-row">
            <Swiper
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={pagination}
              // navigation={true}
              modules={[Autoplay, Navigation, Pagination]}
              className="h-auto max-w-[550px] w-full lg:w-2/5 product-image-swiper"
            >
              {product?.images?.map((item) => (
                <SwiperSlide key={item.id}>
                  <img
                    src={ImgUrl + item.image}
                    className="object-contain w-full"
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="w-full lg:w-3/5 py-5">
              <ProductDetails product={product} />
              <ProductColor
                product={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
              <ProductSize
                product={product}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />

              <AddToCartSection
                handleAddWishlist={handleAddWishlist}
                product={product}
                qty={qty}
                setqty={setqty}
                handleAddToCart={handleAddToCart}
              />
              <ProductMoreDetails
                product={product}
                selectedSize={selectedSize}
              />
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold text-center mt-5">
              Feature Image
            </p>
            <img
              className="max-w-[800px] mt-3 mx-auto w-full"
              src={ImgUrl + product.featureImage}
            />
          </div>
          <div>
            <p className="text-xl font-semibold text-center mt-5">Size Chart</p>
            <img
              className="max-w-[800px] mt-3 mx-auto w-full"
              src={ImgUrl + product.sizeCharts}
            />
          </div>
          <div>{/* <Reviews /> */}</div>
          <div className="pt-16">
            <MoreProducts />
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
