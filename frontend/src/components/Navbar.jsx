import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"}>
        <img className="w-36" src={assets.logo} alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-5">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />
        <div>
          <div className="group relative">
            <img
              onClick={() => (token ? null : navigate("/login"))}
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt=""
            />

            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5  bg-white text-gray-700 rounded-lg shadow-lg ring-1 ring-gray-200 space-y-1">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* sidebar */}
      <div
        className={
          "absolute top-0 left-0 right-0 bottom-0 overflow-hidden bg-white transition-all " +
          (visible ? "w-full" : "w-0")
        }
      >
        <div className="flex flex-col items-center justify-center h-full gap-5">
          <img
            onClick={() => setVisible(false)}
            src={assets.cross_icon}
            className="w-5 cursor-pointer absolute top-5 right-5"
            alt=""
          />
          <NavLink
            to="/"
            className="text-gray-700 text-lg font-semibold"
            onClick={() => setVisible(false)}
          >
            HOME
          </NavLink>
          <NavLink
            to="/collection"
            className="text-gray-700 text-lg font-semibold"
            onClick={() => setVisible(false)}
          >
            COLLECTION
          </NavLink>
          <NavLink
            to="/about"
            className="text-gray-700 text-lg font-semibold"
            onClick={() => setVisible(false)}
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            className="text-gray-700 text-lg font-semibold"
            onClick={() => setVisible(false)}
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
