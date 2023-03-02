import Config from "./modules/server-com.js";

/*** HTML Elements ***/
const loginHeader = document.getElementById("login-header");
const user = document.getElementById("user");
const pwd = document.getElementById("pwd");
const login = document.getElementById("login");

/*** GLOBAL VARIABLES ***/
const role = localStorage.getItem("role");

/*** EVENT LISTENERS ***/
login.addEventListener("click", async () => {
  let userName = user.value === "" ? user.placeholder : user.value;
  let password = pwd.value === "" ? pwd.placeholder : pwd.value;

  // POST request to servers
  let loginResult = await fetch(
    "/login",
    new Config(
      "post",
      { username: userName, password: password, role: role },
      ""
    ).cfg
  );

  switch (loginResult.status) {
    case 200:
      let data = await loginResult.json();
      localStorage.setItem("user_name", userName);
      localStorage.setItem("user_id", data.id);

      // Create a "sillytoken"
      let sillytoken = window.btoa(`${userName}:${password}:${role}`);
      localStorage.setItem("sillytoken", sillytoken);
      
      location.href = `${role}-dashboard.html`;
      break;
    case 403:
      alert("Incorrect username or password");
      break;
    case 500:
      alert("Possible duplicate detected");
      break;
    default:
      alert(`Something went wrong, status ${loginResult.status}`);
      break;
  }

  console.log(loginResult);
});

/*** FUNCTIONS ***/
(function () {
  loginHeader.innerHTML = role[0].toUpperCase() + role.slice(1);
  user.value = "";
  pwd.value = "";
})();
