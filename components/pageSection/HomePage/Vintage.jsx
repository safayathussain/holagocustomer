import { ImgUrl } from "@/constants/urls";
export default function Vintage({ products }) {
  return (
    <section className="container mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-10 py-20">
        <div className="grid grid-cols-3 gap-1 justify-between items-center overflow-hidden">
          {products?.map((item, i) => (
            <img
            key={i}
              className="hover:scale-105 hover:bg-opacity-90 duration-500 hover:rounded-lg"
              src={ImgUrl + item?.images?.[0]?.image}
              alt="earphone"
            />
          ))}
        </div>
        <div className="order-first md:order-last">
          <h2 className="section-title">Vintage Style</h2>
          <p className="section-text max-w-[450px] mt-2">
            Discover the power of timeless style with our mens fashion brand. We
            blend classic elegance with modern sensibility to create clothes
            that make you feel confident and unforgettable, no matter the
            moment.
          </p>
        </div>
      </div>
    </section>
  );
}
