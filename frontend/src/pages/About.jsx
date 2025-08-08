import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div className="px-5 md:px-20 py-10 border-t">
      {/* Title Section */}
      <div className="flex justify-center text-2xl sm:text-2xl mb-10 text-center">
        <Title text1="ABOUT" text2="US" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-28">
        {/* Image */}
        <img
          src={assets.about_img}
          alt="About Us"
          className="w-full md:w-1/2 max-h-[500px] object-cover rounded-xl shadow"
        />

        {/* Description */}
        <div className="w-full md:w-1/2 text-gray-700 text-base md:text-lg leading-7 space-y-5">
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>

          <div>
            <p className="font-semibold text-black">Our Mission</p>
            <p>
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  );
};

export default About;
