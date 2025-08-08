import axios from "axios";
import React, { useEffect } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = React.useState([]);
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/v1/product/list");
      if (response.data.success) {
        console.log(
          "Product list fetched successfully:",
          response.data.data.products
        );

        setList(response.data.data.products);
      }
    } catch (error) {
      console.error("Error fetching product list:", error.message);
      toast.error("Failed to fetch product list");
    }
  };
  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/v1/product/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh the list after deletion
      }
    } catch (error) {
      console.error("Error removing product:", error.message);
      toast.error("Failed to remove product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <p className="mb-2">Product List</p>
      <div className="flex flex-col gap-2">
        {/* list of tables */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-100 text-sm ">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* product list */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid  grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img className="w-12" src={item.images[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
