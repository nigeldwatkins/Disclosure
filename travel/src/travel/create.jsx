import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "./Endpoints/config";
import Nav from './navigation';

const CreateUserForm = () => {
  const createUserUrl = config.createUserUrl;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(createUserUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        try {
          console.log("User created successfully:");
          navigate("/signin");
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <Nav />
    <div className="user-form">
      <h1>Create User</h1>
      <form id="create" name="create" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <label>Name:</label>
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <label>Email:</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <label>Username:</label>
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <label>Password:</label>
        </div>
        <button type="submit" className="create-btn">
          Create User
        </button>

        <div className="yes-account">
          <p>
            Have an account?
            <a href="/Disclosure/signin" className="account-link">
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CreateUserForm;