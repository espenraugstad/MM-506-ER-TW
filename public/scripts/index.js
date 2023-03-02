/*** HTML ELEMENTS ***/
const presenterLogin = document.getElementById('presenter-login');
const studentLogin = document.getElementById('student-login');

/*** EVENT LISTENERS ***/
presenterLogin.addEventListener("click", ()=>{
    localStorage.setItem("role", "presenter");
    location.href = "login.html";
});

studentLogin.addEventListener("click", ()=>{
    localStorage.setItem("role", "student");
    location.href = "login.html";
});

/*** FUNCTIONS ***/
(function() {
    localStorage.clear();
})();