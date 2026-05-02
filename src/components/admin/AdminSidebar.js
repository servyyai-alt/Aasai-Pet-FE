import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GiTropicalFish } from "react-icons/gi";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import company_logo from "../../assets/company_logo.png";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { path: "/admin/products", label: "Products", icon: FiBox },
  { path: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { path: "/admin/users", label: "Users", icon: FiUsers },
  { path: "/admin/categories", label: "Categories", icon: FiTag },
  { path: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-ocean-900 text-white z-30 transition-all duration-300 flex flex-col
        ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group justify-center mb-4 p-1 rounded-xl"
          >
            <div className="rounded-xl text-white bg-white group-hover:scale-110 transition-transform mt-3">
              <img src={logo} alt="AasaiPet Logo" className={`${collapsed ? "w-6 h-6" : "w-12 h-11"}`} />
            </div>
            {/* <span className="font-display font-bold text-xl text-ocean-900">Aasai<span className="text-aqua-500">Pet</span></span> */}
            {/* <img
                                     src={company_logo}
                                     alt="AasaiPet Logo"
                                     className="w-30 h-8 hidden sm:block"
                                   /> */}
          </Link>
          {!collapsed && (
            <span className="font-display font-bold text-lg">
              AasaiPet
              <span className="text-aqua-300 text-xs ml-1 font-normal">
                Admin
              </span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon, exact }) => {
            const active = exact
              ? location.pathname === path
              : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${active ? "bg-aqua-500/20 text-aqua-300 border border-aqua-500/30" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title={collapsed ? label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium text-sm">{label}</span>
                )}
                {!collapsed && active && (
                  <FiChevronRight className="ml-auto w-4 h-4" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-aqua-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-white truncate">
                  {user?.name}
                </p>
                <p className="text-white/40 text-xs">Administrator</p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
