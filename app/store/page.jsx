"use client"
import LatestProducts from "@/components/pageSection/HomePage/LatestProducts";
import MoreExplore from "@/components/pageSection/HomePage/MoreExplore";
import Refresh from "@/components/pageSection/HomePage/Refresh";
import TopBanner from "@/components/pageSection/HomePage/TopBanner";
import Trading from "@/components/pageSection/HomePage/Trending";
import Vintage from "@/components/pageSection/HomePage/Vintage";
import { FetchApi } from "@/utils/FetchApi";
import { useEffect, useState } from "react";


export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const { data } = await FetchApi({ url: "/products/api/get-allProducts" });
      setProducts(data.data);
    };
    loadData();
  }, []);
  return (
    <main className="">
      <TopBanner />
      <MoreExplore products={products}/>
      <LatestProducts products={products}/>
      <Refresh />
      <Trading products={products}/>
      <Vintage products={products}/>
    </main>
  );
}
