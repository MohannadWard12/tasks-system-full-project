/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userFromLocalStorage = localStorage.getItem('tasks_user');
    return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
  });

  const refreshUser = () => {
    const userFromLocalStorage = localStorage.getItem('tasks_user');
    setUser(userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null);
  };

  const login = (userData) => {
    localStorage.setItem('tasks_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('tasks_user');
    setUser(null);
    window.location.replace('/login');
  };

  useEffect(() => {
    // Optionally sync user state with local storage
    localStorage.setItem('tasks_user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
