import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./navigation";
import config from "./Endpoints/config";

const CreateSigninForm = () => {
    const loginUrl = config.loginUrl;

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
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
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });


            if (response.ok) { 
                try {
                    const cookieValue = document.cookie.split("; ").find((row) => row.startsWith(formData.username));
                    console.log(cookieValue);
                    console.log("Signed in successfully:");
            
                    navigate("/");
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            } else {
                console.error("Failed to log in");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div>
            <Nav />
            <div className="signin-form">
            <h1>Log In</h1>
            <form id="login" name="login" onSubmit={handleSubmit}>
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
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    /><label>Password:</label>
                </div>
        
                <div className="checkbox">
                    <label><input type="checkbox" />
                    Remember me</label>
                    <a href="/">Forget Password?</a>
                </div>

                <button type="submit" className="signin-btn">Log In</button>

                <div className="no-account">
                    <p>Don't have an account?
                        <a href="/Disclosure/create" className="no-account-link">Create Account</a>
                    </p>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CreateSigninForm; 