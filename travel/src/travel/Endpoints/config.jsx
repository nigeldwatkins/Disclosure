const config = {
    createUserUrl:
      process.env.REACT_APP_CREATE_USER_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/userroutes/create.php",
    deleteUserUrl:
      process.env.REACT_APP_DELETE_USER_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/userroutes/delete.php",
    loginUrl:
      process.env.REACT_APP_LOGIN_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/userroutes/login.php",
    logoutUrl:
      process.env.REACT_APP_LOGOUT_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/userroutes/logout.php",
    updateUrl:
      process.env.REACT_APP_UPDATE_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/userroutes/update.php",
    createPostUrl:
      process.env.REACT_APP_CREATE_POST_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/postroutes/createpost.php",
    deletePostUrl:
      process.env.REACT_APP_DELETE_POST_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/postroutes/deletepost.php",
    getPostUrl:
      process.env.REACT_APP_GET_POST_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/postroutes/getpost.php",
    updatePostUrl:
      process.env.REACT_APP_UPDATE_POST_URL ||
      "https://physical-world-4923194a6d91.herokuapp.com/postroutes/updatepost.php",
    getUserPostUrl:
      process.env.REACT_APP_GET_POST_BY_USERNAME_URL ||
      "https://physical-world-4923194a6d91.herokuapp.compostroutes/getpost.php",
  };
  
  export default config;