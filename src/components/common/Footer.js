import React from 'react';
import { Link } from 'react-router-dom';
import { GiTropicalFish } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import company_logo from '../../assets/company_logo.png';

const Footer = () => (
  <footer className="bg-ocean-gradient text-white mt-16 relative wave-decoration"
     style={{ background:'linear-gradient(135deg,#1a0533 0%,#2d1b69 30%,#0d3b5e 65%,#0b4535 100%)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4 inline-block p-1 rounded-xl group"
          style={{ background:'linear-gradient(135deg,#f9a8d4,#c4b5fd)' }}
          >
            <div className="rounded-xl text-white group-hover:scale-110 transition-transform">
                          <img src={logo} alt="AasaiPet Logo" className="w-13 h-11" />
                        </div>
                        {/* <span className="font-display font-bold text-xl text-ocean-900">Aasai<span className="text-aqua-500">Pet</span></span> */}
                        <img src={company_logo} alt="AasaiPet Logo" className="w-30 h-8 hidden sm:block" />
          </div>
          <p className="text-ocean-200 text-sm leading-relaxed mb-4">
            Your one-stop destination for premium fish, aquatic accessories, fish food, and aquarium equipment.
          </p>
          <div className="flex gap-3">
            {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
              <a key={i} href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-ocean-200 text-sm">
            {[['/', 'Home'], ['/products', 'Shop All'], ['/products?category=fish', 'Live Fish'], ['/products?category=food', 'Fish Food'], ['/products?category=accessories', 'Accessories']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Account</h3>
          <ul className="space-y-2 text-ocean-200 text-sm">
            {[['/login', 'Login'], ['/register', 'Register'], ['/dashboard', 'My Profile'], ['/dashboard/orders', 'My Orders'], ['/cart', 'Cart']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3 text-ocean-200 text-sm">
            <li className="flex items-start gap-2"><FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>123 AasaiPet Street, Chennai, Tamil Nadu 600001</span></li>
            <li className="flex items-center gap-2"><FiPhone className="w-4 h-4" /><span>+91 98765 43210</span></li>
            <li className="flex items-center gap-2"><FiMail className="w-4 h-4" /><span>hello@aasaipet.in</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-ocean-200 text-sm">
        <p>© {new Date().getFullYear()} AasaiPet. All rights reserved. Developed by Least Action Company</p>
        <p className="mt-2 sm:mt-0">Built with 💙 for Pets enthusiasts</p>
      </div>
    </div>
  </footer>
);

export default Footer;
