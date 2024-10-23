"use client";
import NavigationBar from "@/components/global/NavigationBar";
import Cart from "@/components/store/Cart";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import pathao from "@/public/images/pathao.png";
import sslCommerz from "@/public/images/sslcommerz-logo.png";
import cod from "@/public/images/cod.png";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import CheckBoxInput from "@/components/global/CheckBoxInput";
import Button from "@/components/global/Button";
import TextInputWithButton from "@/components/global/TextInputWithButton";
import { useRouter, useSearchParams } from "next/navigation";
import { FetchApi } from "@/utils/FetchApi";
import { getDeliveryCharge, getDeliveryDays, useCart } from "@/utils/functions";
import { ImgUrl } from "@/constants/urls";
import toast from "react-hot-toast";

const Page = () => {
  const [open, setopen] = useState(false);
  const [addressData, setAddressData] = useState({});
  const address = useSearchParams().get("address");
  const router = useRouter();
  const { products, refetchCart } = useCart();
  const isPaymentSuccess = useSearchParams().get("isPaymentSuccess");
  const [toastShown, setToastShown] = useState(false); // State to prevent multiple toasts

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState("digitalPayment");
  useEffect(() => {
    const loadData = async () => {
      const { data } = await FetchApi({
        url: `customer/api/get_address_by_id/${address}/`,
      });
      setAddressData(data?.payload);
    };
    loadData();
  }, []);
  const subtotalSalePrice = products?.reduce((subtotal, product) => {
    return subtotal + parseFloat(product.total_price);
  }, 0);
  const deliveryCharge = getDeliveryCharge(addressData?.city);
  const totalPrice = subtotalSalePrice + deliveryCharge;
  const handleOrder = async () => {
    const body = {
      shipping_address_id: Number(address),
      payment_method: selectedDeliveryMethod,
      shipping_cost: deliveryCharge,
      items: products.map((item) => {
        return {
          product_id: item?.product?.id,
          quantity: item?.quantity,
          size: item?.size,
          color: item?.color,
        };
      }),
    };
    const { data } = await FetchApi({
      url: `order/api/create-order/`,
      body: body,
      method: "post",
      isToast: true,
      callback: async () => {
        // router.push("/store");
        refetchCart();
      },
    });
    const orderId = data?.order_details?.order_id;
    if (orderId) {
      const { data: payment_res } = await FetchApi({
        url: `order/api/initiate-payment/${orderId}/`,
        method: "post",
      });
      router.push(payment_res?.payment_url);
    }
  };
  useEffect(() => {
    if (!toastShown) {
      if (isPaymentSuccess === "true") {
        toast.success("Payment successful");
        setToastShown(true); 
        const url = new URL(window.location);
        url.searchParams.delete("isPaymentSuccess");
        window.history.replaceState(null, "", url.toString());
      } else if (isPaymentSuccess === "false") {
        toast.error("Payment failed");
        setToastShown(true); 
        const url = new URL(window.location);
        url.searchParams.delete("isPaymentSuccess");
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [isPaymentSuccess, toastShown]);
  return (
    <div className="min-h-screen">
      <NavigationBar cartOpen={setopen} />
      <Cart setOpen={setopen} open={open} />
      <div className="pt-36 container flex flex-col lg:flex-row items-center gap-7 h-full">
        <div className="w-full lg:w-1/2">
          <IoArrowBack size={30} onClick={() => router.back()} />
          <p className="text-xl my-2 text-black font-medium">
            Shipping Services
          </p>
          <div className="border border-[#f6f6f6] rounded-xl">
            <div className="flex items-center justify-between bg-[#f6f6f6] p-3 rounded-t-xl">
              <div>
                <p className="font-semibold">Address -{addressData?.name}</p>
                <p>
                  Road: {addressData?.street}, area: {addressData?.area}, city:{" "}
                  {addressData?.city},
                </p>
                <p>Address: {addressData?.address}</p>
              </div>
              <IoIosArrowForward />
            </div>
            <div className="p-3 rounded-b-xl">
              <div className="flex items-center justify-between">
                <p>
                  Pathao Courier - {getDeliveryDays(addressData?.city)} Days
                </p>
                <p>৳ {deliveryCharge}</p>
              </div>
              <div className="flex gap-4 items-center mt-2">
                <Image src={pathao} className="size-12" alt=""></Image>
                <div>
                  <p className="font-medium">Pathao Courier</p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-5">
            <p className="text-xl font-medium">Payment Method</p>
            <div className="rounded-xl border border-[#f6f6f6]  my-3 divide-y-[2px] divide-[#f6f6f6]">
              <div className="flex justify-between p-3">
                <CheckBoxInput
                  label={"Card"}
                  checked={selectedDeliveryMethod === "digitalPayment"}
                  onChange={(e) =>
                    e.target.checked &&
                    setSelectedDeliveryMethod("digitalPayment")
                  }
                />
                <Image src={sslCommerz} alt=""></Image>
              </div>
              {addressData?.city?.toLowerCase() === "dhaka" && (
                <div className="flex justify-between p-3 items-center">
                  <CheckBoxInput
                    label={"Cash on delivery"}
                    checked={selectedDeliveryMethod === "cash_on_delivery"}
                    onChange={(e) =>
                      e.target.checked &&
                      setSelectedDeliveryMethod("cash_on_delivery")
                    }
                  />
                  <Image src={cod} alt=""></Image>
                </div>
              )}
            </div>
            <Button className={"w-full !rounded-full"} onClick={handleOrder}>
              {selectedDeliveryMethod === "cash_on_delivery"
                ? "Order now"
                : "Pay now"}
            </Button>
          </div>
        </div>
        <div className="bg-[#F6F6F6] rounded-2xl w-full lg:w-1/2 p-5 pb-20">
          <p className="text-xl font-medium">Summary</p>
          {products?.map((item, i) => (
            <div
              key={i}
              className="flex mt-5 gap-3 border items-center border-[#EEEEEE] rounded-xl bg-white"
            >
              <div className="w-2/5  ">
                <img
                  src={ImgUrl + item?.product?.images[0]?.image}
                  className="rounded-s-xl object-cover"
                  alt=""
                ></img>
              </div>
              <div className="space-y-2 mt-2  font-medium">
                <p className="">{item?.product?.productName}</p>
                <p className=" font-semibold">৳{item?.total_price}</p>
                <p>Size: {item?.size}</p>
                <p>Color: {item?.color}</p>
              </div>
            </div>
          ))}
          <hr className="my-5" />
          <div className="space-y-3">
            <div className="font-medium flex justify-between">
              <p>Subtotal</p>
              <p>৳ {subtotalSalePrice}</p>
            </div>
            <div className="font-medium flex justify-between">
              <p>Delivery</p>
              <p>৳ {deliveryCharge}</p>
            </div>
            <div className="font-medium flex justify-between">
              <p>HOLAGO Club Discount</p>
              <p>৳ 0</p>
            </div>
            <div className="font-medium flex justify-between">
              <p>VAT</p>
              <p>৳ 0</p>
            </div>
            <div className="font-semibold flex justify-between">
              <p>Total</p>
              <p>৳ {totalPrice}</p>
            </div>
          </div>
          <hr className="my-5" />

          <div className="flex items-end">
            <div className="w-full">
              <TextInputWithButton
                buttonClass="px-5 bg-black text-white"
                rounded="full"
                buttonText="Apply"
                label={"Do you have a promotional code?"}
                placeholder={"Enter code"}
                className={"rounded-r-none"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
