import Config from "./modules/server-com.js";

/*** HTML ELEMENTS ***/
const username = document.getElementById("username");
const newPresentation = document.getElementById("new");
const edit = document.getElementById("edit");
const run = document.getElementById("run");
const logout = document.getElementById("logout");
const presentationsList = document.getElementById("presentations-list");

/*** GLOBAL VARIABLES ***/
let presentations = [];
let selectedPresentationId = -1;

/*** EVENT LISTENERS ***/
newPresentation.addEventListener("click", async () => {
  //location.href = "authoring.html";
  let result = await fetch("/createPresentation", new Config("post", {user_id: localStorage.getItem("user_id")}, localStorage.getItem("sillytoken")).cfg);
  if(result.status === 200){
    let data = await result.json();
    location.href = `authoring.html?pid=${data.new_id}`;
  } else {
    console.log("An error occurred");
  }


});

edit.addEventListener("click", ()=>{
  if(selectedPresentationId !== -1){
    location.href = `authoring.html?pid=${selectedPresentationId}`;
  }
});

logout.addEventListener("click", () => {
  localStorage.clear();
  location.href = "index.html";
});

/*** FUNCTIONS ***/
window.onload = async function () {
  username.innerHTML = localStorage.getItem("user_name");

  // Retrieve presentations
  let getPresentations = await fetch(
    "/getPresentations",
    new Config("get", "", localStorage.getItem("sillytoken")).cfg
  );

  if (getPresentations.status === 200) {
    let data = await getPresentations.json();
    presentations = data;
    listPresentations();
  } else {
    console.log(`An error occurred, status ${getPresentations.status}`);
  }
}

function listPresentations() {
  presentationsList.innerHTML = "";
  for (let p of presentations) {
    let presentationDiv = document.createElement("div");
    presentationDiv.classList.add("flex", "justify-between", "w-full", "h-12", "items-center", "p-4", "cursor-pointer", "border-t");

    // Title div
    let titleDiv = document.createElement("div");
    titleDiv.innerHTML = p.presentation_title;
    titleDiv.classList.add("w-full");

    // Delete div
    let deleteDiv = document.createElement("div");
    deleteDiv.innerHTML = "X Delete";
    deleteDiv.classList.add("w-36");

    presentationDiv.appendChild(titleDiv);
    presentationDiv.appendChild(deleteDiv);

    // Event listeners
    titleDiv.addEventListener("click", () => {
      //console.log(`Selecting presentation ${p.presentation_title} with id ${p.presentation_id}`);
      if (selectedPresentationId !== p.presentation_id) {
        selectedPresentationId = p.presentation_id;
        // Remove selected-presentation class from any other divs that may have them
        let activeDivs = document.querySelectorAll(".selected-presentation");
        for (let active of activeDivs) {
          active.classList.remove("selected-presentation", "bg-slate-300");
        }
        presentationDiv.classList.add("selected-presentation", "bg-slate-300");

        // Make the edit and run buttons more visible
        edit.classList.remove("text-gray-400");
        run.classList.remove("text-gray-400");
        edit.classList.add("text-black");
        run.classList.add("text-black");
      } else {
        selectedPresentationId = -1;
        presentationDiv.classList.remove("selected-presentation", "bg-slate-300");
        // Make the edit and run buttons less visible
        edit.classList.add("text-gray-400");
        run.classList.add("text-gray-400");
        edit.classList.remove("text-black");
        run.classList.remove("text-black");
      }
    });

    deleteDiv.addEventListener("click", async () => {
      console.log(
        `Deleting presentation ${p.presentation_title} with id ${p.presentation_id}`
      );

      let deleted = await fetch("/deletePresentation", new Config("post", {presentation_id: p.presentation_id}, localStorage.getItem("sillytoken")).cfg);
      if(deleted.status === 200){ 
        setTimeout(()=>{
          location.reload();
        }, 1000);
        
      } else {
        console.log(deleted.status);
      }
    });

    presentationsList.appendChild(presentationDiv);
  }
}
