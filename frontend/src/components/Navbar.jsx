import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, UserCircle, Bell, Search, Menu, X, Home, LayoutDashboard, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ title, userName, role, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center transition-all duration-300">
        
        {/* Left side: Logo / Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-inner border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">
              {title}
            </h1>
            {role && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {role} Portal
              </p>
            )}
          </div>
        </div>

        {/* Middle: Optional Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search complaints, IDs..." 
            className="w-full bg-gray-50 border border-gray-200 text-black text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Right side: Profile & Actions */}
        <div className="flex items-center gap-5">
          <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <Link
            to="/profile"
            className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-1.5 rounded-full shadow-sm group-hover:scale-105 transition-transform">
              <UserCircle size={20} />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
              {userName || "Profile"}
            </span>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold border border-red-100 hover:border-red-500 transition-all shadow-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Logout</span>
          </motion.button>
        </div>
      </nav>

      {/* ✅ Premium Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Sidebar Panel */}
            <motion.div 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-72 bg-white flex flex-col shadow-2xl relative z-10"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                    <LayoutDashboard className="text-white" size={18} />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Menu</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex flex-col gap-2 p-4 flex-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-3">Navigation</div>
                
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <Home size={20} />
                  <span className="font-semibold">Dashboard Home</span>
                </button>
                
                <Link 
                  to="/profile"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <UserCircle size={20} />
                  <span className="font-semibold">My Profile</span>
                </Link>
                
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <Settings size={20} />
                  <span className="font-semibold">Settings</span>
                </button>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => { setIsSidebarOpen(false); onLogout(); }}
                  className="flex justify-center items-center gap-2 w-full p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-semibold transition-colors border border-red-100"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>

            {/* Backdrop Area (Clicking this closes the sidebar) */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="flex-1 bg-gray-900/40 backdrop-blur-sm cursor-pointer"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
