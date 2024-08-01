/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/shared/Navbar/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserProvider } from "./context/UserContext";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Toaster />

      <UserProvider>
        <Navbar />
        
        <Routes>
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
