/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoCloseOutline } from "react-icons/io5";
import { MdAddTask } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import DateInput from "../Datepicker/Datepicker";
import Button from "../shared/Button/Button";
import { format } from "date-fns";

const TaskAddModal = ({ open, setOpen }) => {
  const { user } = useUser();

  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState();
  const [taskTitle, setTaskTitle] = useState();
  const [taskDescription, setTaskDescription] = useState();
  const [dueDate, setDueDate] = useState(new Date());

  // Get all categories
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/categories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      })
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  }, [user?.access_token, open]);

  // Add task
  const handleAddTask = () => {
    const formattedDate = format(
      dueDate.getFullYear() + "-" + String(Number(dueDate.getMonth() + 1)) + "-" + dueDate.getDate(),
      "yyyy-MM-dd"
    );

    axios
      .post(
        `http://127.0.0.1:8000/api/tasks`,
        {
          category_id: category,
          title: taskTitle,
          description: taskDescription,
          due_date: formattedDate,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Task added successfully");

        setOpen(false);

        setInterval(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

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
            className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 h-[450px]"
          >
            <div className="bg-gray-50 dark:bg-primary px-4 py-3 flex items-center justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <MdAddTask aria-hidden="true" className="h-6 w-6 text-gray-800 dark:text-white" />

                {/* Dialog title */}
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Add Task
                </DialogTitle>
              </div>

              <div className="cursor-pointer" onClick={() => setOpen(false)}>
                <IoCloseOutline className="text-gray-800 dark:text-white text-3xl" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 py-6 h-full">
              {/* Dialog Content */}
              <div className="p-5 space-y-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Description"
                />
                <DateInput value={dueDate} onChange={(selectedDate) => setDueDate(selectedDate)} />
                <Button text="Create Task" onClick={handleAddTask} fullWidth />
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskAddModal;
