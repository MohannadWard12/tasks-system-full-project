/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Button from "../components/shared/Button/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();

  // User is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://127.0.0.1:8000/api/login`,
        {
          email,
          password,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        login(res.data);

        toast.success("Login Successful");

        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Task management application logo" src="/images/logo.png" className="mx-auto h-12 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
            {/* Form Inputs */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
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
              <Button type="submit" text="Login" bgColor="bg-indigo-600 hover:bg-indigo-500" fullWidth={true} />
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-white">
            Not registered?{" "}
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
