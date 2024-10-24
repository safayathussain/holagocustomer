import { setAuth } from "@/redux/slices/AuthSlice";
import { useSelector } from "react-redux";
import { FetchApi } from "./FetchApi";
import { store } from "@/redux/store";
import countryData from "@/public/data/phoneCountry.json";
import { setCart } from "@/redux/slices/CartSlice";
import { useState, useEffect } from 'react';
export const refetchAuthState = async (auth) => {
  try {
    const { data } = await FetchApi({
      url: `/customer/api/get_customer/${auth?.customer?.id}`,
      callback: () => {},
    });
    if (data.code === 200) {
      const newObj = {
        ...auth,
        customer: data.data,
      };
      store.dispatch(setAuth(newObj));
    }
  } catch (error) {
    store.dispatch(setAuth({}));
    window.location = "/auth/login";
  }
};
export const refetchCartState = async (auth) => {
  try {
    if(!auth?.customer?.id) return 
    const { data } = await FetchApi({
      url: `/cart/api/get_all_carts/${auth?.customer?.id}/`,
    });
    if (data.code === 200) {
      store.dispatch(setCart(data?.data));
    }
  } catch (error) {
    store.dispatch(setCart([]));
  }
};

export const useAuth = () => {
  const auth = useSelector((state) => state?.auth?.user);
  return {
    auth: auth,
    refetchAuth: () => refetchAuthState(auth),
    token: auth?.token,
    setAuth: (user) => {
      console.log(user);
      store.dispatch(setAuth(user));
    },
  };
};
export const useCart = () => {
  const auth = useSelector((state) => state?.auth?.user);
  const cart = useSelector((state) => state?.cart);
  return {
    products: cart.products,
    refetchCart: () => refetchCartState(auth),
  };
};
export const loginUser = async (email, password) => {
  try {
    const res = await FetchApi({
      url: "/admin/signInAllUsers",
      method: "post",
      data: { email, password },
    });
    if (res?.status === 200) {
      if (res?.data?.user?.role === "MP") {
        store.dispatch(setAuth(res?.data));
        // window.location = "/dashboard";
      } else {
        toast.error("Invalid email or password.");
      }
    }

    return res;
  } catch (error) {
    toast.error(error.response.data.message || error.message);
    console.error(error);
  }
};
export const logoutUser = () => {
  store.dispatch(setAuth({}));
  window.location = "/store";
};

export function getCountryCode(phoneNumber) {
  if(!phoneNumber) return null
  if (!phoneNumber?.startsWith("+")) {
    return "";
  }
  for (const country of countryData) {
    if (phoneNumber?.startsWith(country.phone_code)) {
      return country.phone_code;
    }
  }
  return "Country code not found";
}

export const getDeliveryCharge = (city) => {
  if (city?.toLowerCase() === "dhaka") {
    return 50;
  } else {
    return 100;
  }
};
export const getDeliveryDays = (city) => {
  if (city?.toLowerCase() === "dhaka") {
    return '1-3';
  } else {
    return '3-5';
  }
};
export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenWidth;
};

export const getOrderStatusStyle = (status) => {
  return {
    backgroundColor:
      status === "pending"
        ? "#FFD580"  // Muted orange for Pending
        : status === "processing"
        ? "#87CEEB"  // Light sky blue for Processing
        : status === "shipped"
        ? "#ADD8E6"  // Soft blue for Shipped
        : status === "delivered"
        ? "#90EE90"  // Light green for Delivered
        : status === "canceled"
        ? "#FFA07A"  // Soft red/orange for Canceled
        : "#C0C0C0", // Light grey for unknown status
  };
};

export function formatTo12Hour(timestamp) {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; 
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes} ${ampm}, ${date.toLocaleDateString()}`;
}