import { store } from "@/redux/store";
import { FetchApi } from "./FetchApi";
import { refetchCartState } from "./functions";

const { setCart } = require("@/redux/slices/CartSlice");

export const increaseQtyInCart = async (item, qty) => {
  const auth = store.getState((state) => state).auth.user;
  const cartItems = store.getState((state) => state).cart?.products;
  if (!auth?.customer?.id) {
    const existingProductIndex = cartItems?.findIndex(
      (eitem) =>
        eitem.product?.id === item?.product?.id &&
        eitem.size === item.size &&
        eitem.color === item.color
    );
    if (existingProductIndex !== -1) {
      const updatedCartItems = [...cartItems]; // Create a shallow copy of cartItems array
      updatedCartItems[existingProductIndex] = {
        ...cartItems[existingProductIndex], // Create a copy of the existing product
        quantity: cartItems[existingProductIndex].quantity + qty, // Update the qty property
      };
      store.dispatch(setCart(updatedCartItems));
    } else {
      const productForSet = {
        product: product,
        color: selectedColor,
        size: selectedSize?.size,
        quantity: qty,
        total_price: Number(product?.salePrice) * Number(qty),
      };
      store.dispatch(setCart([...cartItems, productForSet]));
    }
  } else {
    const body = {
      product_id: item?.product?.id,
      quantity: item?.quantity + qty,
      color: item?.color,
      size: item?.size,
    };
    await FetchApi({
      url: `cart/api/cart_manage/${auth?.customer?.id}/update/${item?.id}/`,
      body,
      method: "put",
    });
    refetchCartState(auth);
  }
};
export const decreaseQtyInCart = async (item, qty) => {
  const auth = store.getState((state) => state).auth.user;
  const cartItems = store.getState((state) => state).cart?.products;
  if (!auth?.customer?.id) {
    const existingProductIndex = cartItems?.findIndex(
      (eitem) =>
        eitem.product?.id === item?.product?.id &&
        eitem.size === item.size &&
        eitem.color === item.color
    );
    if (existingProductIndex !== -1) {
      let updatedCartItems = [...cartItems]; // Create a shallow copy of cartItems array
      if (updatedCartItems[existingProductIndex]?.quantity - qty === 0) {
        updatedCartItems = [...cartItems].filter(
          (i) => i?.product?.id !== item?.product?.id
        );
      } else {
        updatedCartItems[existingProductIndex] = {
          ...cartItems[existingProductIndex], // Create a copy of the existing product
          quantity: cartItems[existingProductIndex].quantity - qty, // Update the qty property
        };
      }
      store.dispatch(setCart(updatedCartItems));
    } else {
      const productForSet = {
        product: product,
        color: selectedColor,
        size: selectedSize?.size,
        quantity: qty,
        total_price: Number(product?.salePrice) * Number(qty),
      };
      store.dispatch(setCart([...cartItems, productForSet]));
    }
  } else {
    const body = {
      product_id: item?.product?.id,
      quantity: item?.quantity - qty,
      color: item?.color,
      size: item?.size,
    };
    if (body.quantity <= 0) {
      await FetchApi({
        url: `cart/api/cart_manage/${auth?.customer?.id}/delete/${item?.id}/`,
        body,
        method: "delete",
      });
    } else {
      await FetchApi({
        url: `cart/api/cart_manage/${auth?.customer?.id}/update/${item?.id}/`,
        body,
        method: "put",
      });
    }
    refetchCartState(auth);
  }
};
export const removeItemFromCart = async (item, index, dispatch) => {
  const auth = store.getState((state) => state).auth.user;
  const cartItems = store.getState((state) => state).cart?.products;

  if (!auth?.customer?.id) {
    let updatedCartItems = [...cartItems]; // Create a shallow copy of cartItems array
    updatedCartItems = [...cartItems].filter(
      (i) => i?.product?.id !== item?.product?.id
    );
    store.dispatch(setCart(updatedCartItems));
  } else {
    await FetchApi({
      url: `cart/api/cart_manage/${auth?.customer?.id}/delete/${item?.id}/`,
      method: "delete",
    });

    refetchCartState(auth);
  }

  return;
};
