import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const CreateAccount = ({ onLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState("");


  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return;
    }

    if (!validateEmail(username)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== reEnterPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const userCredentials = {
      firstName,
      lastName,
      username,
      password,
    };

    try {
      const response = await axios.post("http://localhost:3001/register", userCredentials);

      if (response.data.success) {
        alert("Account created successfully!");
        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setReEnterPassword("");
        setError("");
        onLogin();
        navigate("/home");
      } else {
        setError(response.data.message || "Account creation failed.");
      }
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex h-screen font-outfit">
   
      <div className="w-1/2 h-full relative bg-black opacity-100 flex items-center justify-center">
        <div className="relative group">
          <div
            className="absolute inset-0 rounded-full bg-black opacity-50 blur-xl group-hover:opacity-75 group-hover:blur-2xl transition duration-300"
          ></div>
          <div
            className="relative bg-center bg-cover bg-no-repeat rounded-full h-56 w-56 flex items-center justify-center shadow-lg"
            style={{
              backgroundImage: "url('https://i.pinimg.com/736x/a0/a1/a7/a0a1a728dc9f084f26db69e8964179a7.jpg')",
            }}
          >
            <h1 className="text-white text-4xl font-bold">Stocky</h1>
          </div>
        </div>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center bg-white shadow-lg">
        <div className="p-8 w-3/4 max-w-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Create Account
          </h2>
          <label htmlFor="firstName" className="block mb-2 text-gray-600">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="lastName" className="block mb-2 text-gray-600">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label htmlFor="username" className="block mb-2 text-gray-600">
            Email Address:
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="Email"
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
          <label htmlFor="reEnterPassword" className="block mb-2 text-gray-600">
            Re-enter Password:
          </label>
          <input
            type="password"
            id="reEnterPassword"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-pink"
            placeholder="Re-enter Password"
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
          />
          {error && (
            <div className="flex items-center text-red-500 mb-4">
              <i className="fa fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
          <button
            onClick={handleCreateAccount}
            className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pastel-pink"
          >
            Create Account
          </button>
          <p className="mt-4 text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
