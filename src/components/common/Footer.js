import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiYoutube,
  FiShield,
} from "react-icons/fi";
import company_logo from "../../assets/company_logo.png";
import { FaThreads } from "react-icons/fa6";

const Footer = () => (
  <footer
    className="text-white mt-16 relative overflow-hidden"
    style={{
      /* Background updated to match the Pet Section gradient */
      background: "linear-gradient(135deg, #e07b39 0%, #7a3a14 100%)",
    }}
  >
    {/* Subtle Decorative Paw Print Background */}
    <div className="absolute top-10 right-10 opacity-5 select-none pointer-events-none">
      <span className="text-[200px]">🐾</span>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div
            className="flex items-center gap-2 mb-6 inline-block p-2 rounded-2xl group backdrop-blur-md border border-white/20 shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <img
              src={company_logo}
              alt="AasaiPet Logo"
              className=" object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          <p className="text-orange-100/80 text-sm leading-relaxed mb-6">
            Your one-stop destination for premium pets, food, accessories, and
            care products.
          </p>
          <div className="flex items-center gap-2 text-orange-200 text-xs mb-6">
            <FiShield className="w-4 h-4 text-orange-300" />
            <span>Secure payments via Razorpay</span>
          </div>
          <div className="flex gap-3">
            {[
              { icon: <FiInstagram />, href: "https://instagram.com/aasairajkumar" },
              { icon: <FaThreads />, href: "https://www.threads.net/aasairajkumar" },
              { icon: <FiYoutube />, href: "https://youtube.com/@aasaipets1915" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/30 p-2.5 rounded-xl transition-all border border-white/10 hover:-translate-y-1"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 w-fit">Quick Links</h3>
          <ul className="space-y-3 text-orange-100/70 text-sm">
            {[
              ["/", "Home"],
              ["/products", "Shop All"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 w-fit">Account</h3>
          <ul className="space-y-3 text-orange-100/70 text-sm">
            {[
              ["/login", "Login"],
              ["/register", "Register"],
              ["/dashboard", "My Profile"],
              ["/dashboard/orders", "My Orders"],
              ["/cart", "Cart"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 w-fit">Legal</h3>
          <ul className="space-y-3 text-orange-100/70 text-sm">
            {[
              ["/privacy-policy", "Privacy Policy"],
              ["/terms", "Terms & Conditions"],
              ["/shipping-policy", "Shipping Policy"],
              ["/refund-policy", "Cancellation & Refund"],
              ["/contact", "Contact Us"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-2 w-fit">Contact Us</h3>
          <ul className="space-y-4 text-orange-100/70 text-sm">
            <li className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 mt-0.5 text-orange-300 flex-shrink-0" />
              <span className="leading-tight">
                சங்கனூர் நல்லாம்பாளையம் ரோடு கதவு எண் 3/1-3 கோயமுத்தூர் 641027
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-orange-300 flex-shrink-0" />
              <span>+91 82205 39620</span>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-orange-300 flex-shrink-0" />
              <span className="truncate">aasairajkumar1515@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-orange-100/50 text-xs gap-4">
        <p>
          © {new Date().getFullYear()} AasaiPet. All rights reserved. 
          <span className="ml-1">Developed by <strong>Least Action Company</strong></span>
        </p>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <span>|</span>
          <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;