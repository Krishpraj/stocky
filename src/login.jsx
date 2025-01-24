import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [arrowDirection, setArrowDirection] = useState("↑"); 
  const [arrowColor, setArrowColor] = useState("green"); 
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 }); 
  const navigate = useNavigate();

  console.log("Rendering Login Component");

  const handleMouseMove = (event) => {
    const currentY = event.clientY;

    if (currentY > arrowPosition.y) {
      setArrowDirection("↓"); // Mouse is moving down
      setArrowColor("red");    // Red arrow for downward movement
    } else if (currentY < arrowPosition.y) {
      setArrowDirection("↑"); 
      setArrowColor("green"); 
    }

    setArrowPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [arrowPosition]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.success) {
        alert("Login Successful");
        onLogin(); // Mark user as logged in
        navigate("/home"); // Redirect to Home
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Invalid username/password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen font-outfit cursor-none" >
      <div className="w-1/2 h-full relative bg-black opacity-100 flex items-center justify-center">
        <div className="relative group">
          <div
            className="absolute inset-0 rounded-full bg-black opacity-50 blur-xl group-hover:opacity-75 group-hover:blur-2xl transition duration-300"
          ></div>
          <div
            className="relative bg-center bg-cover bg-no-repeat rounded-full h-56 w-56 flex items-center justify-center shadow-lg"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/736x/a0/a1/a7/a0a1a728dc9f084f26db69e8964179a7.jpg')", // Replace with your image URL
            }}
          >
            <h1 className="text-white text-4xl font-bold">Stocky</h1>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-white shadow-lg">
        <div className="p-8 w-3/4 max-w-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Login
          </h2>
          <label htmlFor="username" className="block mb-2 text-gray-600">
            Email Address:
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password" className="block mb-2 text-gray-600">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="flex items-center text-red-500 mb-4">
              <i className="fa fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pastel-pink"
          >
            Sign in
          </button>
          <p className="mt-4 text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link to="/create-login" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: arrowPosition.x + "px",
          top: arrowPosition.y + "px", 
          transform: "translate(-50%, -50%)", 
          fontSize: "3rem",
          color: arrowColor,
          pointerEvents: "none", 
        }}
      >
        {arrowDirection}
      </div>
    </div>
  );
};

export default Login;
