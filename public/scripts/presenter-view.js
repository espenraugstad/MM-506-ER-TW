import Config from "./modules/server-com.js";
import { parsePresentation, parseSlideHtml } from "./modules/parser.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById('presentation-title');
const slidePreview = document.getElementById('slide-preview');
const exit = document.getElementById('exit');
const exitDialog = document.getElementById('exitDialog');
const cancelBtn = document.getElementById('cancelBtn');
const exitBtn = document.getElementById('exitBtn');

/*** GLOBAL VARIABLES ***/
let currentPresentation = null;
let parsedPresentation = null;
let currentSlideIndex = 0;

/*** EVENT LISTENERS ***/
exit.addEventListener("click", ()=>{
    exitDialog.showModal();
});

cancelBtn.addEventListener("click", ()=>{
    exitDialog.close();
});

exitBtn.addEventListener("click", ()=>{
    exitDialog.close();
    location.href = "presenter-dashboard.html";
});

/*** FUNCTIONS ***/
window.onload = async function(){
    await getPresentation();
    parsedPresentation = parsePresentation(currentPresentation.markdown);
    console.log(parsedPresentation);
    previewSlides();
}

function previewSlides(){
    // Preview current slide in the primary current window.
    let currentSlide = parseSlideHtml(parsedPresentation.slides[currentSlideIndex]);
    console.log(currentSlide);
}

async function getPresentation() {
    let url = new URLSearchParams(location.search);
    let pid = url.get("pid");
    let uid = localStorage.getItem("user_id");
    let idtoken = window.btoa(`${pid}:${uid}`);
  
    let presentation = await fetch(
      `/getPresentation/${idtoken}`,
      new Config("get", "", localStorage.getItem("sillytoken")).cfg
    );
  
    currentPresentation = await presentation.json();
  
    if (presentation.status === 200) {
      presentationTitle.innerText = currentPresentation.presentation_title;
    } else {
      console.log(currentPresentation.message);
    }
  }