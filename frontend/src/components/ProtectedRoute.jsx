/* eslint-disable react/prop-types */
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  return user ? children : window.location.replace('/login');
};

export default ProtectedRoute;
