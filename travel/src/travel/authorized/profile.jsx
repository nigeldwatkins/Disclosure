import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchengin } from "@fortawesome/free-brands-svg-icons";
import "../../index.css";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../Endpoints/config";
import Nav from "../navigation";
import CreateSigninForm from "../signin";

function Profile() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const usernameFromLogin = state?.username;

  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [images, setImages] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isYesPopupOpen, setIsYesPopupOpen] = useState(false);
  const [isNoPopupOpen, setIsNoPopupOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBulletOpen, setIsBulletOpen] = useState(false);
  const [bulletOpenMap, setBulletOpenMap] = useState([]);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isCancelSelect, setIsCancelSelect] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [headerImage, setHeaderImage] = useState("default.jpeg"); // Default image

  const [name, setName] = useState("Nigel Watkins");
  const [username, setUsername] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPostId, setEditPostId] = useState(null);

  const [isEditMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(
    "Capture each moment."
  );

  const handleEditToggle = () => {
    setEditMode(!isEditMode);
  };

  const handleNameChange = (e) => {
    // Handle name change logic
  };

  const handleUsernameChange = (e) => {
    // Handle username change logic
  };

  const handleBioChange = (e) => {
    // Handle bio change logic
  };

  const logoutUrl = config.logoutUrl;
  const createPostUrl = config.createPostUrl;

  const desiredUsername = usernameFromLogin || "";
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.trim().startsWith(desiredUsername));
  if (cookieValue) {
    const usernameFromCookie = cookieValue.split("=")[1].trim();
  }

  const getUserPostUrl = `${config.getUserPostUrl}/?username=${loggedInUser}`;

  const handleBulletToggle = (postId) => {
    setIsBulletOpen((prevMap) => ({
      ...prevMap,
      [postId]: !prevMap[postId],
    }));
  };

  const handleCancelToggle = () => {
    setIsCancelSelect(!isCancelSelect);

    if (setIsCancelSelect) {
      setIsPostOpen(false);
    }
  };

  const handleOpenPostToggle = () => {
    setIsPostOpen(!isPostOpen);
  };

  const handleEditPost = (postId) => {
    setIsEditing(true);
    setEditPostId(postId);
  };
  const handleSaveChanges = async () => {};

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_HEIGHT = 450;

        let width = img.width;
        let height = img.height;

        if (height > MAX_HEIGHT) {
          const ratio = MAX_HEIGHT / height;
          width *= ratio;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageDataUrl = canvas.toDataURL("image/jpeg");

        setHeaderImage(resizedImageDataUrl);
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleProfileDropdownToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleOpenPopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handles logout function when yes button is clicked
  const handleYesPopupToggle = async (e) => {
    e.preventDefault();

    setIsYesPopupOpen(!isYesPopupOpen);
    if (setIsYesPopupOpen)
      try {
        const response = await fetch(logoutUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify(),
        });
        const data = await response.text();

        if (response.ok) {
          const desiredUsername = usernameFromLogin || "";
          const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.trim().startsWith(desiredUsername));
          console.log("You have successfully logged out");
          // Remove the cookie here
          document.cookie = `${cookieValue}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          setIsUserAuthorized(false);
          setIsPopupOpen(false);
          navigate("/signin");
        } else {
          console.error("Logout failed:", data.error);
        }
      } catch (error) {
        console.error("During logout an error has occured:", error);
      }
  };

  const [postData, setPostData] = useState({
    username: "",
    title: "",
    description: "",
    location: "",
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files && files.length > 0) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const fileType = files[0].type;

      if (!allowedImageTypes.includes(fileType)) {
        alert("Invalid file format. Only images are allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setImagePreview(null);
    }

    setPostData({
      ...postData,
      [name]: files ? files[0] : value, // Uses file object for existed files.
    });
  };

  const handleTitleChange = (e) => {
    setPostData({
      ...postData,
      title: e.target.value,
    });
  };

  const handleDescriptionChange = (e) => {
    setPostData({
      ...postData,
      description: e.target.value,
    });
  };
  const handleLocationChange = (e) => {
    setPostData({
      ...postData,
      location: e.target.value,
    });
  };

  const handleUpdateProfile = () => {

  }

  // Form submission with imagePreview
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", loggedInUser);
      formData.append("title", postData.title);
      formData.append("description", postData.description);
      formData.append("location", postData.location);
      formData.append("file", postData.file);

      const response = await fetch(createPostUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        try {
          console.log("Post has been created successfully:");
          setIsPostOpen(!isPostOpen);
          navigate("/");
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error while creating post:", error);
    }
  };

  const handleNoPopupToggle = () => {
    setIsNoPopupOpen(!isNoPopupOpen);

    if (setIsNoPopupOpen) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    const desiredUsername = usernameFromLogin || "";
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.trim().startsWith(desiredUsername));

    if (cookieValue) {
      const usernameFromCookie = cookieValue.split("=")[1].trim();
      setIsUserAuthorized(true);

      if (usernameFromCookie) {
        setLoggedInUser(usernameFromCookie);
        setUsername(usernameFromCookie);
        const getUserPostUrl = `${config.getUserPostUrl}/?username=${usernameFromCookie}`;

        fetch(getUserPostUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
              return response.json();
            } else {
              throw new Error("Invalid content type. Expected JSON.");
            }
          })
          .then((data) => {
            setImages(Array.isArray(data) ? data : []);
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
            if (error.response) {
              error.response.text().then((text) => {});
            }
          });
      }
    } else {
      setIsUserAuthorized(false);
    }
  }, [usernameFromLogin]);

  return (
    <div>
      {!isUserAuthorized && <CreateSigninForm />}

      {isUserAuthorized && (
        <>
          <NavbarUser />

          <section className="profile-picture">
            <div onClick={handleProfileDropdownToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="white"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.1-29.7C448 383.8 368.2 304 269.7 304H178.3Z" />
              </svg>
            </div>
          </section>

          {isProfileOpen && (
            <ul className="profile-menu-list">
              <li className="profile-tab">
                <a href="/profile" className="profile-list">
                  View Profile
                </a>
              </li>
              <li className="profile-tab">
                <a href="/" className="profile-list">
                  Edit Profile
                </a>
              </li>
              <li className="profile-tab">
                <a className="sign-out" onClick={handleOpenPopupToggle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-logo"
                    viewBox="0 0 512 512"
                  >
                    <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                  </svg>
                </a>
                <p className="text-section" onClick={handleOpenPopupToggle}>
                  Log Out
                </p>
              </li>
            </ul>
          )}

          <section className="new-post-icon">
            <div onClick={handleOpenPostToggle}>+</div>
          </section>

          <section className="search-area">
            <input type="text" placeholder="Search. . ." />
            <div href="#">
              <FontAwesomeIcon icon={faSearchengin}></FontAwesomeIcon>
            </div>
          </section>

          {isPopupOpen && (
            <div className="container">
              <div className="popup" id="popup">
                <h2>Are you sure you want to sign out?</h2>
                <button type="button" onClick={handleYesPopupToggle}>
                  Yes
                </button>
                <button type="button" onClick={handleNoPopupToggle}>
                  No
                </button>
              </div>
            </div>
          )}
          <div>
            {isPostOpen && (
              <div className="post-container">
                <section className="post">
                  <form
                    id="new-post"
                    name="new-post"
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                  >
                    <div className="top-post">
                      <button
                        onClick={handleCancelToggle}
                        className="cancel-button"
                      >
                        X
                      </button>

                      <button
                        type="submit"
                        value="submit"
                        className="post-button"
                      >
                        Post
                      </button>
                    </div>

                    <section>
                      <h1 className="new-header">Create New Post</h1>
                    </section>
                    <section className="post-title-section">
                      <input
                        type="text"
                        name="title"
                        value={postData.title}
                        onChange={handleTitleChange}
                        required
                        placeholder="Title"
                      />
                    </section>

                    <section className="post-description-section">
                      <textarea
                        name="description"
                        value={postData.description}
                        onChange={handleDescriptionChange}
                        required
                        rows={10}
                        style={{ width: "95%" }}
                        placeholder="Description"
                      />
                    </section>

                    <section className="post-location-section">
                      <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={postData.location}
                        onChange={handleLocationChange}
                        required
                      />
                    </section>

                    <section>
                      {imagePreview && (
                        <section>
                          <h2>Preview:</h2>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "25% " }}
                          />
                        </section>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={handleInputChange}
                        required
                      />
                    </section>
                  </form>
                </section>
              </div>
            )}
          </div>
          <div className="profile-container">
            <section
              className="header"
              style={{
                backgroundImage: `url(${headerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "28rem",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></section>

            <section className="profile-edit">
              <h2 className="icon-profile" onClick={handleEditToggle}>
              </h2>
            </section>

            <div className="profile-info">
              <div className="profile-name">
                <section>
                  <h2>{name}</h2>
                  <p>@{loggedInUser}</p>
                </section>
              </div>

              <section className="bio">
                <p>{bio}</p>
                <button onClick={handleEditToggle}>Edit</button>
              </section>
              <div className="seperator"></div>
              <div>
                {isEditMode && (
                  <div className="edit-profile-information">
                    <form
                      id="update-profile"
                      name="update-profile"
                      onSubmit={handleUpdateProfile}
                      encType="multipart/form-data"
                    >
                      <input
                        className="file-input"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      <div className="profile-name">
                        <input
                          className="full-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <input
                          className="user-name"
                          type="text"
                          value={loggedInUser}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <textarea
                          className="bio-input"
                          type="text"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={10}
                        />
                             <button
                        onClick={handleCancelToggle}
                        className="cancel-button"
                      >
                      Cancel
                      </button>

                      <button
                        type="submit"
                        value="submit"
                        className="post-button"
                      >
                        Save
                      </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <section className="image-gallery-profile">
                {images.map((images) => (
                  <div key={images.id} className="image-items-profile">
                    <div className="top-post-section">
                      <p className="user-profile">{images.username}</p>
                      <div
                        className="top-bullet"
                        onClick={() => handleBulletToggle(images.id)}
                      >
                        &bull; &bull; &bull;
                      </div>
                      {isBulletOpen[images.id] && (
                        <ul className="bullet-menu">
                          <li className="bullet-menu-list">
                            <div
                              className="bullet-item"
                              onClick={handleEditPost}
                            >
                              Edit Post
                            </div>
                          </li>
                          <li className="bullet-menu-list">
                            <div className="bullet-item">Delete</div>
                          </li>
                        </ul>
                      )}
                    </div>
                    <p className="post-location">{images.location}</p>
                    <img
                      className="image-file"
                      src={`data:image/jpeg;base64,${images.file}`}
                      alt={images.description}
                    />
                    <div className="image-details">
                      <h2 className="post-title">{images.title}</h2>
                      <p className="post-description">{images.description}</p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavbarUser() {
  return (
    // Navbar function: main compponent
    <div>
      <NavigationUser className="nav-list">
        <NavItemsUser home="Home" />
        <NavItemsUser portfolio="Portfolio" />
        <NavDropUser />
      </NavigationUser>
    </div>
  );
}

// Defines the structure of the navigation bar
function NavigationUser(props) {
  return (
    // Renders a navigation bar with list of child components
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

// Represents individual navigation items
function NavItemsUser(props) {
  return (
    // Renders list item with anchor tags for each navigation item
    <li className="nav-item">
      <a href="/">{props.home}</a>
      <a href="https://nigeldwatkins.github.io/PortfolioNW/">{props.portfolio}</a>
    </li>
  );
}

// Dropdown menu for navigation items
function NavDropUser() {
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
            <a href="/" className="list-name">
              Home
            </a>
          </li>
          <li className="list-tab">
            <a href="https://nigeldwatkins.github.io/PortfolioNW/" className="list-name">
              Portfolio
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Profile;