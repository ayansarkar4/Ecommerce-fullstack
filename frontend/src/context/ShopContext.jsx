import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = "https://ecommerce-fullstack-zprq.onrender.com"
   
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  //  Add To Cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        const res = await axios.post(
          backendUrl + "/api/v1/cart/add",
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success && res.data.data?.cartData) {
          setCartItems(res.data.data.cartData);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update cart on server");
      }
    }
  };

  // Get Cart Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch {}
      }
    }
    return totalCount;
  };

  //  Update Quantity
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        const res = await axios.post(
          backendUrl + "/api/v1/cart/update",
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success && res.data.data?.cartData) {
          setCartItems(res.data.data.cartData);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update cart on server");
      }
    }
  };

  // ✅ Get Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch {}
      }
    }
    return totalAmount;
  };

  // ✅ Get All Products
  const getAllProducts = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/v1/product/list");
      if (response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Get User Cart
  const getUserCart = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/v1/cart/get", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data?.cartData) {
        setCartItems(response.data.data.cartData);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // ✅ Initial Load
  useEffect(() => {
    getAllProducts();
  }, []);

  // ✅ Token Load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // ✅ Sync Cart With Backend
  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
