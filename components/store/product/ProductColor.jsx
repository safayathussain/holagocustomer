import Link from "next/link";
import React from "react";

const ProductColor = ({ product, selectedColor, setSelectedColor }) => {
  return (
    <div>
      <div>
        <p className="text-sm mt-2">Select Color:</p>
        <div className="flex gap-2 ">
          {product?.color_list?.map((item) => (
            <div key={item}>
              <button
                onClick={() => setSelectedColor(item)}
                className={`border  rounded-md w-[50px] py-1.5 text-xs font-semibold ${
                  selectedColor !== item
                    ? "border-[#CCCCCC]"
                    : "bg-black text-white"
                }`}
              >
                {item}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductColor;
