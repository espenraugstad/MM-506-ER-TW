import Config from "./modules/server-com.js";
import { parsePresentation, parseSlideHtml } from "./modules/parser.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById("presentation-title");
const editor = document.getElementById("editor");
const slidesPreview = document.getElementById('slides-preview');
const save = document.getElementById('save');
const dash = document.getElementById('dash');
// Dialogs
const savedMessage = document.getElementById('savedMessage');
const saved = document.getElementById('saved');
const savedResultBtn = document.getElementById('savedResultBtn');
const unsaved = document.getElementById('unsaved');
const doSave = document.getElementById('doSave');
const doNotSave = document.getElementById('doNotSave');

// Slide templates basic
const slideBasicTitle = document.getElementById('slide-basic-title');
const slideBasicText = document.getElementById('slide-basic-text');
const slideBasicImageOverlay = document.getElementById('slide-basic-image--overlay');
const slideBasicImageLeft = document.getElementById('slide-basic-image--left');
const slideBasicImageRight = document.getElementById('slide-basic-image--right');


/*** GLOBAL VARIABLES ***/
let currentPresentation = null;
let isSaved = true;
//let presentationData = null;

/*** EVENT LISTENERS ***/
presentationTitle.addEventListener("input", ()=>{
  isSaved = false;
});

editor.addEventListener("input", ()=>{
  isSaved = false;
  updatePresentation();
});

save.addEventListener("click", async ()=>{
    updatePresentation();
    let savedStatus = await savePresentation();
    if(savedStatus === 200){
      savedMessage.textContent = "Presentation saved successfully";
      isSaved = true;
      saved.showModal();
    }  else if (savedStatus === 403){
      savedMessage.textContent = "Access to database denied!";
      saved.showModal();
    } else {
      savedMessage.textContent = "An error occured while saving the presentation";
      saved.showModal();
    }
});

dash.addEventListener("click", ()=>{
  if(isSaved){
    location.href = "presenter-dashboard.html";
  } else {
    // Show dialog to save presentation
    unsaved.showModal();
  }
});

doSave.addEventListener("click", async ()=>{
  let savedStatus = await savePresentation();
  unsaved.close();
  if(savedStatus === 200){
    location.href = "presenter-dashboard.html";
  } else {
    savedMessage.textContent = savedStatus;
    saved.showModal();
  }
  
});

doNotSave.addEventListener("click", ()=>{
  unsaved.close();
  location.href = "presenter-dashboard.html";
});

savedResultBtn.addEventListener("click", ()=>{
  saved.close();
});

/*** FUNCTIONS ***/
window.onload = async function () {
  await getPresentation();
  updatePresentation();
  console.log(presentationTitle.textContent);
}

async function savePresentation(){
  let url = new URLSearchParams(location.search);
  let pid = url.get("pid");
  let uid = localStorage.getItem("user_id");
  let idtoken = window.btoa(`${pid}:${uid}`);

  // Get the necessary info
  currentPresentation.presentation_title = presentationTitle.textContent
  currentPresentation.markdown = editor.value;
  

  let presentationSaved = await fetch(`/savePresentation/${idtoken}`, new Config("post",currentPresentation, localStorage.getItem("sillytoken")).cfg);
  return presentationSaved.status;

}

function updatePresentation(){
  let presentationData = parsePresentation(editor.value);
  previewPresentation(presentationData);
}

function previewPresentation(data){
  slidesPreview.innerHTML = "";
  const theme = data.options.theme;
  //console.log(theme);

  for(let slide of data.slides){
    let html = parseSlideHtml(slide);
    //console.log(html);

    let slideClone = slideBasicTitle.content.cloneNode(true);
    let textDiv = slideClone.children[0];
    textDiv.innerHTML = html;
    slidesPreview.appendChild(textDiv);

    /* switch (slide.type){
      case "ti":

    } */

  }

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
    editor.value = currentPresentation.markdown;
  } else {
    console.log(currentPresentation.message);
  }

}
