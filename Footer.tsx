import React from "react";
import {
  FiCreditCard,
  FiTruck,
  FiClock,
  FiShield,
  FiFacebook,
  FiYoutube,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import { categories } from "../data/categories";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";
import logo from "../assets/vice-queen-industries-favicon.png";

const Footer: React.FC = () => {
  return (
    <footer className="mt-16">
      <div className="border-b border-gray-800 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <FiCreditCard className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-semibold text-background">
                  Secure Payment
                </h3>
                <p className="text-sm text-gray-400">
                  100% secure transactions
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <FiTruck className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-semibold text-background">Free Shipping</h3>
                <p className="text-sm text-gray-400">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <FiClock className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-semibold text-background">24/7 Support</h3>
                <p className="text-sm text-gray-400">
                  Round the clock assistance
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <FiShield className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="font-semibold text-background">Money Back</h3>
                <p className="text-sm text-gray-400">30-day guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex justify-center mb-2">
                <LazyImage
                  src={logo}
                  alt="vice queens industries logo"
                  width="16"
                  height="16"
                />
              </div>
              <h2 className="text-lg font-bold text-white mb-4">
                About Vice Queen Industries
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Your one-stop destination for premium products. We offer the
                best selection of electronics, fashion, and accessories at
                competitive prices.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={"#"}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-4">Contact Us</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-400">
                    123 Shopping Street, Fashion Avenue, NY 10001
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <MdMailOutline className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-400">
                    support@vicequeenindustries.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-gray-400">
              © 2024 Vice Queen Industries. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
