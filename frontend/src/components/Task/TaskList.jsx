/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Task from "./Task";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import Loading from "../shared/Loading/Loading";
import toast from "react-hot-toast";
import TaskAddModal from "./TaskAddModal";
import Button from "../shared/Button/Button";

const TaskList = () => {
  const { user } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

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
      });
  }, [user?.access_token]);

  // Get all tasks
  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/api/tasks`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.data);
        setLoading(false);
      });
  }, [user?.access_token]);

  // Delete task
  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/tasks/${id}/force-delete`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);

        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  // Complete task
  const handleComplete = (id, completed) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/tasks/${id}/complete`,
        {
          completed,
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

        const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed } : task));
        setTasks(updatedTasks);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  return (
    <>
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Tasks</h1>
        {categories.length === 0 ? (
          <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            Add a category from settings in profile menu
          </span>
        ) : (
          // <Button text="Add a Category from settings" bgColor="bg-indigo-600 hover:bg-indigo-500" />
          <Button text="Add Task" bgColor="bg-indigo-600 hover:bg-indigo-500" onClick={() => setIsModalOpen(true)} />
        )}
      </div>

      <div className="p-5 rounded-md shadow-md bg-gray-300 dark:bg-primary mt-4 space-y-3">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        )}

        {/* Tasks */}
        {tasks.map((task, index) => {
          if (index !== tasks.length - 1) {
            return (
              <>
                <Task
                  id={task.id}
                  category={task.category}
                  title={task.title}
                  description={task.description}
                  due_date={task.due_date}
                  completed={task.completed}
                  handleDelete={() => handleDelete(task.id)}
                  handleComplete={handleComplete}
                />
                <hr className="opacity-50" />
              </>
            );
          } else {
            return (
              <>
                <Task
                  id={task.id}
                  category={task.category}
                  title={task.title}
                  description={task.description}
                  due_date={task.due_date}
                  completed={task.completed}
                  handleDelete={() => handleDelete(task.id)}
                  handleComplete={handleComplete}
                />
              </>
            );
          }
        })}

        {!loading && tasks.length === 0 && (
          <div className="flex justify-center items-center">
            <p className="text-gray-500 dark:text-white">No tasks yet</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <TaskAddModal open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};

export default TaskList;
