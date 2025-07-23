import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Auth.css";

const Login = () => {
  const BASE_URL = "http://localhost";

  const [formData, setFormData] = useState({
    email: "anurag@gmail.com",
    password: "abcd",
  });

  // serverError will hold the error message from the server
  const [serverError, setServerError] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the server error as soon as the user starts typing in Email
    if (name === "email" && serverError) {
      setServerError("");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false); // reset success if any

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.error) {
        // Show error below the email field (e.g., "Email already exists")
        setServerError(data.error);
      } else {
        console.log(data);
        // Login success
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      // In case fetch fails
      console.error("Error:", error);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Login</h2>
      <form className="form" onSubmit={handleSubmit}>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            // If there's a serverError, add an extra class to highlight border
            className={`input ${serverError ? "input-error" : ""}`}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            className="input"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Absolutely-positioned error message below email field */}
        {serverError && <span className="error-msg">{serverError}</span>}

        <button
          type="submit"
          className={`submit-button ${isSuccess ? "success" : ""}`}
        >
          {isSuccess ? "Login Successful" : "Login"}
        </button>
      </form>

      {/* Link to the login page */}
      <p className="link-text">
        Don't have an account? <Link to="/register">Login</Link>
      </p>
    </div>
  );
};

export default Login;
