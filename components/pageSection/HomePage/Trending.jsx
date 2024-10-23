import { ImgUrl } from "@/constants/urls";
import Link from "next/link";

export default function Trading({ products }) {
  return (
    <section className="bg-[#F4F4F4]">
      <div className="container mx-auto py-20">
        <div className="flex justify-between items-center flex-col md:flex-row">
          <h2 className="section-title">Trending Outfits</h2>
          <p className="section-text">Shared by customers, just like you!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 justify-between items-center mx-auto gap-3 relative w-full my-5">
          {products?.map((item, i) => (
            <Link key={i} href={`/store/product/${item?.id}`} className="">
              <div className="overflow-hidden rounded-md hover:shadow-lg transition duration-700">
                <img
                  className="border rounded-md hover:shadow-lg hover:scale-105 transition duration-700 w-full"
                  src={ImgUrl + item?.images?.[0]?.image}
                  alt="earphone"
                />
              </div>
            </Link>
          ))}
        </div>{" "}
      </div>
    </section>
  );
}
