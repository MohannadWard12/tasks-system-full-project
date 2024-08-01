/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { format } from "date-fns";
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { useState } from "react";
import Button from "../shared/Button/Button";
import TaskUpdateModal from "./TaskUpdateModal";

const Task = ({ id, category, title, description, due_date, completed, handleDelete, handleComplete }) => {
  const dueDateExpired = format(new Date(due_date), "yyyy-MM-dd") < format(new Date(), "yyyy-MM-dd");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-5 items-center justify-between">
        <div className="flex gap-2">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={completed}
            onChange={() => handleComplete(id, !completed)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />

          <div className="space-y-1">
            {/* Task */}
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-300">{title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {String(description).length > 50 ? String(description).substring(0, 50) + "..." : description}
              </p>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2">
              <div
                className={`text-sm text-gray-500 dark:text-gray-400 ${
                  dueDateExpired && "text-red-500 dark:text-red-500"
                } flex items-center gap-1`}
              >
                <MdOutlineDateRange className="text-[16px] inline" />
                <p>{format(due_date, "yyyy-MM-dd")}</p>
              </div>

              <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                {category.title}
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <IoMdMore
            className="text-primary dark:text-white text-2xl cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div
              className={`absolute text-white z-10 top-[105%] right-[50%] w-[180px] rounded-md p-4 flex flex-col gap-2 backdrop-blur-md bg-black/50 task-menu`}
            >
              <Button
                text="Edit Task"
                bgColor="bg-indigo-600 hover:bg-indigo-500"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false);
                }}
                styles={{ margin: "0px" }}
              />
              <Button
                text="Delete Task"
                bgColor="bg-red-600 hover:bg-red-500"
                onClick={() => {
                  handleDelete();
                  setIsMenuOpen(false);
                }}
                styles={{ margin: "0px" }}
              />
            </div>
          )}
        </div>
      </div>

      <TaskUpdateModal
        id={id}
        category={category.id}
        title={title}
        description={description}
        due_date={due_date}
        completed={completed}
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />
    </>
  );
};

export default Task;
