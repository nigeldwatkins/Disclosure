import React, { useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";

// Navbar function: Main navigation bar component
function Navbar() {
  return (
    // Renders Navigation components with child components
    <Navigation classname="nav-list">
      <NavItems home="Home" />
      <NavItems signin="Sign In" />
      <NavItems create="Create Account" />
      <NavItems portfolio="Portfolio" />
      <NavDrop />
    </Navigation>
  );
}

// Navigation function: Defines  the structure of the navigation bar
function Navigation(props) {
  return (
    // Renders a navigation bar with a list of child components
    <nav className="navbar">
      <ul className="navbar-nav"> {props.children}</ul>
    </nav>
  );
}

// Represents individual navigation items
function NavItems(props) {
  return (
    // Renders list items with anchor tags for each navigation item
    <li className="nav-item">
      <Link to="/">
        {props.home}
      </Link>
      <Link to="/signin">
        {props.signin}
      </Link>
      <Link to="/create">
        {props.create}
      </Link>
      <a href="https://nigeldwatkins.github.io/PortfolioReact/">
        {props.portfolio}
      </a>
    </li>
  );
}

// Dropdown menu for navigation items
function NavDrop() {
  // Manages dropdown state using useState hook
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle dropdown state
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    // Renders a header with name and a button to toggle dropdown
    <div>
      <header className="page-header">
        <ul>
          <li className="dropdown-menu-bar" onClick={handleDropdownToggle}>
            <div className="bar top-bar" />
            <div className="bar middle-bar" />
            <div className="bar bottom-bar" />
          </li>
        </ul>
      </header>
      {isDropdownOpen && (
        <ul className="dropdown-menu-list">
          <li className="list-tab">
            <Link to="/" className="list-name">
                Home
            </Link>
          </li>
          <li className="list-tab">
            <Link to="/signin" className="list-name">
                Sign In
            </Link>
          </li>
          <li className="list-tab">
            <Link to="/create" className="list-name">
                Create Account 
            </Link>
          </li>
          <li className="list-tab">
            <a href="https://nigeldwatkins.github.io/PortfolioReact/" className="list-name">
                Portfolio
            </a>
            </li>
        </ul>
      )}
    </div>
  );
}

export default Navbar;