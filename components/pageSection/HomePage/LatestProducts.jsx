"use client";
import Image from "next/image";
import rarrow from "@/public/images/rarrow.png";
import { useRef } from "react";
import Link from "next/link";
import { ImgUrl } from "@/constants/urls";

export default function LatestProducts({ products }) {
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= sliderRef.current.offsetWidth;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += sliderRef.current.offsetWidth;
    }
  };
  return (
    <section className="container mx-auto my-5">
      <div className="">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <h2 className="section-title">Latest Products</h2>
          <p className="section-text">Get the best for you!</p>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className="md:flex grid grid-cols-2 gap-3 my-5  md:overflow-x-scroll hidden_scrollbar"
          >
            {products.map((item, index) => (
              <Link
                href={`/store/product/${item?.id}`}
                key={index}
                className=""
              >
                <div className="">
                  <img
                    className="border rounded-md md:w-[200px] xl:w-[300px]"
                    src={ImgUrl + item?.images?.[0]?.image}
                    alt="earphone"
                  />
                </div>
                <div className="secondary-color py-3">
                  <h3 className="">{item?.productName}</h3>
                  <div className="flex gap-2">
                    <p>৳ {item?.salePrice}</p>
                    <p className="line-through text-gray-400">
                      ৳ {item?.regularPrice}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex md:hidden justify-center">
            <Link href="/store/products?products=" className="font-semibold underline">
              View All Products
            </Link>
          </div>
          <div className="md:absolute top-5 right-0 hidden ">
            <div className="flex flex-col justify-end">
              <button
                className="btn-primary border-2 border-black p-3 w-10 h-10"
                onClick={slideRight}
              >
                <Image src={rarrow} alt="right arrow" />
              </button>
              <button
                className="btn-primary border-b-2 border-r-2 border-l-2 border-black p-3 w-10 h-10"
                onClick={slideLeft}
              >
                <Image className="rotate-180" src={rarrow} alt="left arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
