import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const BASE_URL = "http://localhost";

  const [formData, setFormData] = useState({
    name: "Anurag Singh",
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
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        // Show error below the email field (e.g., "Email already exists")
        setServerError(data.error);
      } else {
        // Registration success
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
    <></>
  );
};

export default Register;
