import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  <div>Login</div>
  );
};

export default Login;
