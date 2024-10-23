"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import {  Navigation, Autoplay } from "swiper/modules";
import { ImgUrl } from "@/constants/urls";
import Link from "next/link";

export default function MoreExplore({ products }) {
  return (
    <section className=" mx-auto container">
      <div className="py-20 ">
        <div className="flex flex-col md:flex-row gap-20 justify-between items-center  overflow-hidden">
          <div className="text-center md:text-left">
            <h2 className="section-title">More To</h2>
            <h2 className="text-6xl">Explore</h2>
            <p className="mt-5 max-w-[200px]">
              Discover curated edits and seasonal collections
            </p>
          </div>
          <div
          // className={`${renderCarousel ? 'opacity-100': 'opacity-0'}`}
          >
            <div className="w-[350px] sm:w-[450px] md:w-[410px] lg:w-[650px] xl:w-[900px] ">
              <Swiper
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                }}
                loop={true}
                autoplay={{
                  delay: 500,
                  disableOnInteraction: false,
                }}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="h-auto w-full"
              >
                {products.map((item, i) => (
                  <div  key={i}>
                    <SwiperSlide className=" ">
                      <Link href={`/store/product/${item?.id}`} className="relative">
                        <img
                          src={ImgUrl + item?.images[0]?.image}
                          alt={item?.productName}
                          className="rounded-lg h-full object-cover"
                        />
                        <div className="black_bg_gradiant_d_to_u absolute w-full bottom-0 rounded-b-lg ">
                          <h2 className="text-lg text-white text-center pt-10 pb-5">
                            {item?.productName}
                          </h2>
                        </div>
                      </Link>
                    </SwiperSlide>
                  </div>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
