/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { MdSettings } from "react-icons/md";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

const NavbarModal = ({ open, setOpen }) => {
  const navigate = useNavigate();

  // User is already logged in
  const { user, refreshUser } = useUser();

  if (!user) {
    navigate("/");
  }

  const [activeTab, setActiveTab] = useState("0");
  const [selected, setSelected] = useState(localStorage.getItem("tasks_theme") || "light");

  // Update password
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState();

  const handlePasswordUpdate = () => {
    axios
      .post(
        `http://127.0.0.1:8000/api/user/update/password`,
        {
          password: password,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);

        setOpen(false);

        setPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  // Update profile
  const [name, setName] = useState(user?.user.name);
  const [email, setEmail] = useState(user?.user.email);

  const handleProfileUpdate = () => {
    axios
      .post(
        `http://127.0.0.1:8000/api/user/update/profile`,
        { name, email },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);

        const newUser = JSON.parse(localStorage.getItem("tasks_user"));

        newUser.user.name = name;
        newUser.user.email = email;

        localStorage.setItem("tasks_user", JSON.stringify({ access_token: newUser?.access_token, user: newUser.user }));
        refreshUser();

        setOpen(false);

        setName(name);
        setEmail(email);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  useEffect(() => {
    setName(user?.user.name);
    setEmail(user?.user.email);
  }, [user]);

  // category Operations
  // Add category
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();

  // Get categories
  const [categories, setCategories] = useState([]);

  // Edit category
  const [editCategory, setEditCategory] = useState();
  const [editCategoryTitle, setEditCategoryTitle] = useState();
  const [editCategoryDescription, setEditCategoryDescription] = useState();

  // Pagination
  const [categoryNext, setCategoryNext] = useState();
  const [categoryPrev, setCategoryPrev] = useState();
  const [categoryPaginationTotal, setCategoryPaginationTotal] = useState();
  const [categoryPaginationFrom, setCategoryPaginationFrom] = useState();
  const [categoryPaginationTo, setCategoryPaginationTo] = useState();

  // Get categories
  useEffect(() => {
    if (user) {
      getCategories();
    }
  }, []);

  const getCategories = (url = "http://127.0.0.1:8000/api/categories") => {
    axios
      .get(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      })
      .then((res) => {
        setCategories(res.data.data);

        setCategoryNext(res.data.links.next);
        setCategoryPrev(res.data.links.prev);

        setCategoryPaginationTotal(res.data.meta.total);
        setCategoryPaginationFrom(res.data.meta.from);
        setCategoryPaginationTo(res.data.meta.to);
      });
  };

  const handleAddCategory = () => {
    axios
      .post(
        `http://127.0.0.1:8000/api/categories`,
        { title: category, description },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Category added successfully");
        setCategory("");
        setDescription("");

        setOpen(false);

        getCategories();

        navigate(0);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  // Edit category
  const handleEditCategory = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/categories/${editCategory}`,
        {
          title: editCategoryTitle,
          description: editCategoryDescription,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);

        setOpen(false);

        setEditCategory("");
        setEditCategoryTitle("");
        setEditCategoryDescription("");

        getCategories();
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  // Delete category
  const handleDeleteCategory = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/categories/${id}/force-delete`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);

        setOpen(false);
        getCategories();

        navigate(0);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  // Update theme
  const handleThemeUpdate = () => {
    localStorage.setItem("tasks_theme", selected);

    if (selected === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    setOpen(false);
  };

  useEffect(() => {
    if (selected === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [selected]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center text-center sm:items-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 min-h-[300px]"
          >
            <div className="bg-gray-50 dark:bg-primary px-4 py-3 flex items-center justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <MdSettings aria-hidden="true" className="h-6 w-6 text-gray-800 dark:text-white" />

                {/* Dialog title */}
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Settings
                </DialogTitle>
              </div>

              <div className="cursor-pointer" onClick={() => setOpen(false)}>
                <IoCloseOutline className="text-gray-800 dark:text-white text-3xl" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 min-h-[300px]">
              {/* Dialog Content */}
              <div className="flex h-full">
                {/* Tabs */}
                <div className="bg-gray-50 dark:bg-primary px-6 py-4 flex flex-col gap-3 min-h-[300px]">
                  <p
                    id="0"
                    onClick={(e) => setActiveTab(e.target.id)}
                    className={`text-lg text-gray-500 cursor-pointer hover:text-white px-2 py-1 rounded-md duration-200 ${
                      activeTab === "0" ? "bg-primary dark:bg-gray-500 text-white" : "hover:bg-primary/70"
                    }`}
                  >
                    Appearance
                  </p>
                  <p
                    id="1"
                    onClick={(e) => setActiveTab(e.target.id)}
                    className={`text-lg text-gray-500 cursor-pointer hover:text-white px-2 py-1 rounded-md duration-200 ${
                      activeTab === "1" ? "bg-primary dark:bg-gray-500 text-white" : "hover:bg-primary/70"
                    }`}
                  >
                    Profile
                  </p>
                  <p
                    id="2"
                    onClick={(e) => setActiveTab(e.target.id)}
                    className={`text-lg text-gray-500 cursor-pointer hover:text-white px-2 py-1 rounded-md duration-200 ${
                      activeTab === "2" ? "bg-primary dark:bg-gray-500 text-white" : "hover:bg-primary/70"
                    }`}
                  >
                    Categories
                  </p>
                  <p
                    id="3"
                    onClick={(e) => setActiveTab(e.target.id)}
                    className={`text-lg text-gray-500 cursor-pointer hover:text-white px-2 py-1 rounded-md duration-200 ${
                      activeTab === "3" ? "bg-primary dark:bg-gray-500 text-white" : "hover:bg-primary/70"
                    }`}
                  >
                    Add Category
                  </p>
                  <p
                    id="4"
                    onClick={(e) => setActiveTab(e.target.id)}
                    className={`text-lg text-gray-500 cursor-pointer hover:text-white px-2 py-1 rounded-md duration-200 ${
                      activeTab === "4" ? "bg-primary dark:bg-gray-500 text-white" : "hover:bg-primary/70"
                    }`}
                  >
                    Update Category
                  </p>
                </div>

                {/* Tabs Content */}
                <div className="flex-1 p-6">
                  {activeTab === "0" && (
                    <>
                      <Listbox value={selected} onChange={setSelected}>
                        <Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                          Theme{" "}
                        </Label>
                        <div className="relative mt-2">
                          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                              {/* Icon */}
                              {selected === "dark" ? <CiDark className="text-xl" /> : <CiLight className="text-xl" />}
                              <span className="ml-3 block truncate">{selected}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                            </span>
                          </ListboxButton>

                          <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                          >
                            <ListboxOption
                              value={"light"}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                            >
                              <div className="flex items-center">
                                {/* Icon */}
                                <CiLight className="text-xl" />
                                <span
                                  className={`ml-3 block truncate font-normal ${
                                    selected === "light" && "font-semibold"
                                  }`}
                                >
                                  light
                                </span>
                              </div>
                              {selected === "light" && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                </span>
                              )}
                            </ListboxOption>

                            <ListboxOption
                              value={"dark"}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                            >
                              <div className="flex items-center">
                                {/* Icon */}
                                <CiDark className="text-xl" />
                                <span
                                  className={`ml-3 block truncate font-normal ${
                                    selected === "dark" && "font-semibold"
                                  }`}
                                >
                                  dark
                                </span>
                              </div>
                              {selected === "dark" && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                </span>
                              )}
                            </ListboxOption>
                          </ListboxOptions>
                        </div>
                      </Listbox>

                      <Button text="Update theme" onClick={handleThemeUpdate} />
                    </>
                  )}

                  {activeTab === "1" && (
                    <div className="space-y-6">
                      {/* Update Password */}
                      <div className="dark:text-white">
                        <p className="text-xl font-semibold">Update Password</p>

                        <div className="my-4 space-y-3">
                          <div>
                            <label
                              htmlFor="old_password"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              Old Password
                            </label>
                            <div className="mt-2">
                              <input
                                id="old_password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="new_password"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              New Password
                            </label>
                            <div className="mt-2">
                              <input
                                id="new_password"
                                name="new_password"
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="new_password_confirmation"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              New Password Confirmation
                            </label>
                            <div className="mt-2">
                              <input
                                id="new_password_confirmation"
                                name="new_password_confirmation"
                                type="password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={newPasswordConfirmation}
                                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                              />
                            </div>
                          </div>

                          <Button text="Update Password" onClick={handlePasswordUpdate} />
                        </div>
                      </div>

                      {/* Update Profile */}
                      <div className="dark:text-white">
                        <p className="text-xl font-semibold">Update Profile</p>

                        <div className="my-4 space-y-3">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              Name
                            </label>
                            <div className="mt-2">
                              <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              Email address
                            </label>
                            <div className="mt-2">
                              <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </div>

                          <Button text="Update Profile" onClick={handleProfileUpdate} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "2" && (
                    <div className="space-y-3">
                      <h1 className="text-gray-900 dark:text-white text-xl font-bold">Categories</h1>

                      <div className="space-y-2">
                        {categories.length !== 0 ? (
                          categories.map((category) => (
                            <div
                              key={category.id}
                              className="text-gray-800 dark:text-white text-md font-semibold bg-primary p-3 rounded-md flex items-center justify-between"
                            >
                              <div>
                                <p className="text-white dark:opacity-80">{category.title}</p>
                                <p className="text-white dark:opacity-60 text-sm">{category.description}</p>
                              </div>
                              <MdDelete
                                className="text-xl cursor-pointer text-white"
                                onClick={() => handleDeleteCategory(category.id)}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-800 dark:text-white text-md font-semibold text-center opacity-70">
                            No Categories Found
                          </p>
                        )}
                      </div>

                      {(categoryNext || categoryPrev) && (
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800 dark:text-white text-md font-semibold">
                            Showing {categoryPaginationFrom} to {categoryPaginationTo} of {categoryPaginationTotal}{" "}
                            results
                          </p>
                          <div className="flex items-center space-x-2">
                            {categoryPrev && <Button text="Previous" onClick={() => getCategories(categoryPrev)} />}
                            {categoryNext && <Button text="Next" onClick={() => getCategories(categoryNext)} />}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "3" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Description"
                      />
                      <Button text="Add Catrgory" onClick={handleAddCategory} />
                    </div>
                  )}

                  {activeTab === "4" && (
                    <div className="space-y-3">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected>Choose a category</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={editCategoryTitle}
                        onChange={(e) => setEditCategoryTitle(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={editCategoryDescription}
                        onChange={(e) => setEditCategoryDescription(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Description"
                      />
                      <Button text="Update Catrgory" onClick={handleEditCategory} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default NavbarModal;
