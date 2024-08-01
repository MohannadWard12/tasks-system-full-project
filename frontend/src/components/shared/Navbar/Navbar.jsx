/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import NavbarModal from "./NavbarModal";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, refreshUser, logout } = useUser();

  const handleUserMenuClick = () => {
    const userMenu = document.querySelector(".user-menu");
    userMenu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="bg-gray-300 text-white shadow-md dark:bg-primary duration-300">
        <div className="container py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <img src="/images/logo.png" alt="" className="w-[40px]" />
          </Link>

          {/* Links */}
          {!user && (
            <div className="hidden md:flex space-x-6">
              <NavLink to="/register" className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400 duration-200">
                Register
              </NavLink>
              <NavLink to="/login" className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400 duration-200">
                Login
              </NavLink>
            </div>
          )}

          {/* Icons */}
          {user && (
            <div className="flex items-center space-x-4 relative">
              <div onClick={handleUserMenuClick} className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-900 hover:opacity-60 duration-300 cursor-pointer">
                <FaUserAlt className="text-2xl" />
              </div>

              {/* User Menu */}
              <div className="absolute top-[105%] right-[50%] w-[180px] rounded-md p-4 flex flex-col gap-2 backdrop-blur-md bg-black/50 hidden user-menu">
                {/* Settings */}
                <div className="flex items-center gap-2 hover:ml-2 cursor-pointer duration-300" onClick={() => setIsModalOpen(true)}>
                  <IoIosSettings className="text-2xl" />
                  <span>Settings</span>
                </div>

                <hr className="opacity-50" />

                {/* Log out */}
                <div className="flex items-center gap-2 hover:ml-2 cursor-pointer duration-300" onClick={handleLogout}>
                  <BiLogOut className="text-2xl" />
                  <span>Log out</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {!user && (
            <button
              className="md:hidden flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {menuOpen && !user && (
          <div className="md:hidden flex flex-col text-center space-y-1">
            <NavLink to="/register" className="hover:text-gray-400">
              Sign up
            </NavLink>
            <NavLink to="/login" className="hover:text-gray-400">
              Login
            </NavLink>
          </div>
        )}
      </nav>

      <NavbarModal open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};

export default Navbar;
