import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setcategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [sortType, setSortType] = useState([]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setcategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setcategory((prev) => [...prev, e.target.value]);
    }
  };
  const toggleSubCategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setSubcategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubcategory((prev) => [...prev, e.target.value]);
    }
  };

  // Combined filter and sort effect
  useEffect(() => {
    let filtered = [...products];
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subcategory.length > 0) {
      filtered = filtered.filter((item) =>
        subcategory.includes(item.subCategory)
      );
    }

    switch (sortType) {
      case "low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break; // 'relavent' = no sort
    }

    setFilterProducts(filtered);
  }, [products, category, subcategory, sortType, search, showSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 gap-2 text-xl flex items-center cursor-pointer"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* category FILTERS */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="text-sm font-medium mb-3">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input type="checkbox" value={"Men"} onChange={toggleCategory} />
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" value={"Kids"} onChange={toggleCategory} />
              Kids
            </p>
          </div>
        </div>
        {/* subcategory FILTERS  */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="text-sm font-medium mb-3">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              Winterwear
            </p>
          </div>
        </div>
      </div>
      {/* sort options */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by : Relavent</option>
            <option value="low-high">Sort by : Low to High</option>
            <option value="high-low">Sort by : High to Low</option>
          </select>
        </div>

        {/* map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              images={item.images}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
