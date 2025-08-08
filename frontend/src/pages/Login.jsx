import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentState, setCurrentState] = useState("Login");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        // Sign Up request
        const response = await axios.post(
          backendUrl + "/api/v1/user/register",
          { name, email, password },
          { withCredentials: true }
        );
        console.log(response.data.message.token);

        if (response.data.success) {
          setToken(response.data.message.token);
          localStorage.setItem("token", response.data.message.token);
          toast.success(response.data.data || "User registered successfully!");
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      } else {
        // Login request
        const response = await axios.post(
          backendUrl + "/api/v1/user/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.data.success) {
          setToken(response.data.message.token);
          localStorage.setItem("token", response.data.message.token);
          toast.success(response.data.data || "Login successful!");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("Network error");
      }
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Login" ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
