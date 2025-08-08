import React from "react";
import { assets } from "../assets/assets";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange Policy",
    description: "We offer hassle free exchange policy",
  },
  {
    icon: assets.quality_icon,
    title: "7 Days Return Policy",
    description: "We provide 7 days free return policy",
  },
  {
    icon: assets.support_img,
    title: "Best Customer Support",
    description: "We provide 24/7 customer support",
  },
];

const Policy = () => {
  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
        {policies.map((policy, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={policy.icon}
              alt={policy.title}
              className="w-12 h-12 mb-4"
            />
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
              {policy.title}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {policy.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;
