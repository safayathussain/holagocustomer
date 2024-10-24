"use client";
import Button from "@/components/global/Button";
import NavigationBar from "@/components/global/NavigationBar";
import TextInput from "@/components/global/TextInput";
import Cart from "@/components/store/Cart";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import img from "@/public/images/rtk.png";
import eliteImg from "@/public/images/ELITE_1.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import TextInputWithButton from "@/components/global/TextInputWithButton";
import { useAuth, useCart } from "@/utils/functions";
import PhoneInput from "@/components/global/PhoneInput";
import SelectInput from "@/components/global/SelectInput";
import { FetchApi } from "@/utils/FetchApi";
import { ImgUrl } from "@/constants/urls";
import { useRouter } from "next/navigation";

const Page = () => {
  const [open, setopen] = useState(false);
  const { auth } = useAuth();
  const [options, setoptions] = useState([]);
  const [addresses, setaddresses] = useState([]);
  const { products } = useCart();
  const router = useRouter();
  const [selectedAddress, setselectedAddress] = useState(null);
  const [selectedArea, setselectedArea] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      const { data } = await FetchApi({
        url: `customer/api/get_all_address/${auth?.customer?.id}`,
      });
      const options = data?.payload.map((item) => {
        return {
          name: item.name,
          value: item.id,
        };
      });
      setoptions(options);
      setaddresses(data?.payload);
      const defaultAddress = localStorage.getItem("default_address");
      if (defaultAddress !== null) {
        setselectedAddress(defaultAddress);
      } else {
        setselectedAddress(options[0]?.value); // Ensure it's set after options are available
      }
    };
    loadData();
  }, []);
  useEffect(() => {
    if (addresses.length > 0) {
      const addressId = selectedAddress
        ? parseInt(selectedAddress)
        : parseInt(localStorage.getItem("default_address")) || addresses[0]?.id;
      const foundArea = addresses.find((item) => item.id === addressId)?.area;
      if (foundArea !== selectedArea) {
        setselectedArea(foundArea);
      }
    }
  }, [addresses, selectedAddress]);

  const subtotalSalePrice = products?.reduce((subtotal, product) => {
    return subtotal + parseFloat(product.total_price);
  }, 0);
  return (
    <div className="min-h-screen">
      <NavigationBar cartOpen={setopen} />
      <Cart setOpen={setopen} open={open} />
      {products.length < 1 ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl ">Cart is empty</p>
        </div>
      ) : (
        <>
          <div className="pt-36 container flex items-center gap-7 h-full flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 ">
              <IoArrowBack size={30} onClick={() => router.back()} />
              <p className="text-xl my-2 text-black font-medium">
                Contact Info
              </p>
              <TextInput
                defaultValue={auth?.customer?.email}
                label={"Email"}
                rounded="full"
              />
              <p className="text-xl mt-8  text-black font-medium">
                Shipping Address
              </p>
              <div className="space-y-2 mt-3 mb-5">
                <TextInput
                  label={"Your Name"}
                  rounded="full"
                  defaultValue={auth?.customer?.name || ""}
                />
                <PhoneInput
                  disabled={true}
                  label={"Phone number"}
                  rounded="full"
                  value={auth?.customer?.phone_number}
                />
                <SelectInput
                  onChange={(e) => setselectedAddress(e.target.value)}
                  value={selectedAddress}
                  options={options}
                  label={"Address"}
                  rounded="full"
                />
                <TextInput label={"Area"} rounded="full" value={selectedArea} />
              </div>
              <Button
                className={"w-full !rounded-full "}
                onClick={() =>
                  router.push(`/payment?address=${selectedAddress}`)
                }
              >
                Proceed to payment
              </Button>
            </div>
            <div className="bg-[#F6F6F6] rounded-2xl w-full lg:w-1/2  p-5 pb-20">
              <p className="text-xl font-medium">Summary</p>
              {products?.map((item, i) => (
                <div
                  key={i}
                  className="flex mt-5 gap-3 border items-center border-[#EEEEEE] rounded-xl bg-white"
                >
                  <div className="w-2/5 h-full">
                    <img
                      src={ImgUrl + item?.product?.images[0]?.image}
                      className="rounded-s-xl  h-full object-cover"
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
              <div className="flex justify-between font-medium">
                <p>Subtotal</p>
                <p className="font-semibold">৳ {subtotalSalePrice}</p>
              </div>
              {/* <hr className="my-5" />
              <TextInput label={'Do you have a promotional code?'} placeholder={'Enter code'} className={'rounded-r-none'} />
              <TextInputWithButton
                buttonText="Apply"
                rounded="full"
                buttonClass="bg-black text-white px-5"
                label={"Do you have a promotional code?"}
                placeholder={"Enter code"}
                className={"rounded-r-none"}
              /> */}
              {/* <hr className="my-5" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Image className="size-16" src={eliteImg} alt=""></Image>
                  <p>You have 50,000 club points worth ৳5,000!</p>
                </div>

                <TextInputWithButton
                  buttonText="Redeem"
                  rounded="full"
                  buttonClass="bg-black text-white px-5"
                  placeholder={"Enter points amount"}
                  className={"rounded-r-none"}
                />
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
