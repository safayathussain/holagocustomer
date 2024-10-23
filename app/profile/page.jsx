"use client";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/global/Loader";
import { FetchApi } from "@/utils/FetchApi";
import toast from "react-hot-toast";

// Lazy load the components
const Profile = lazy(() =>
  import("@/components/pageSection/ProfilePage/Profile")
);
const WishList = lazy(() =>
  import("@/components/pageSection/ProfilePage/WishList")
);
const MyOrders = lazy(() =>
  import("@/components/pageSection/ProfilePage/MyOrders")
);
const SavedAddress = lazy(() =>
  import("@/components/pageSection/ProfilePage/SavedAddress")
);

const Page = () => {
  const searchParams = useSearchParams();
  const screen = searchParams.get("screen");
  const isPaymentSuccess = searchParams.get("isPaymentSuccess");

  const [orders, setOrders] = useState([]);
  const [toastShown, setToastShown] = useState(false); // State to prevent multiple toasts

  // Fetch orders
  useEffect(() => {
    const loadData = async () => {
      const { data: ordersData } = await FetchApi({
        url: "order/api/get_all_orders/",
      });
      const sortedData = ordersData?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sortedData);
    };
    loadData();
  }, []);

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
    <div>
      {screen === "0" && (
        <Suspense fallback={<Loader />}>
          <Profile />
        </Suspense>
      )}
      {screen === "1" && (
        <Suspense fallback={<Loader />}>
          <WishList />
        </Suspense>
      )}
      {screen === "2" && (
        <Suspense fallback={<Loader />}>
          <MyOrders orders={orders} />
        </Suspense>
      )}
      {screen === "3" && (
        <Suspense fallback={<Loader />}>
          <SavedAddress />
        </Suspense>
      )}
    </div>
  );
};

export default Page;
