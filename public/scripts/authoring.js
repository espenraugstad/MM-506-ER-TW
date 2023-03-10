import Config from "./modules/server-com.js";
import { parsePresentation, parseSlideHtml } from "./modules/parser.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById("presentation-title");
const editor = document.getElementById("editor");
const slidesPreview = document.getElementById('slides-preview');
const save = document.getElementById('save');

// Slide templates basic
const slideBasicTitle = document.getElementById('slide-basic-title');
const slideBasicText = document.getElementById('slide-basic-text');
const slideBasicImageOverlay = document.getElementById('slide-basic-image--overlay');
const slideBasicImageLeft = document.getElementById('slide-basic-image--left');
const slideBasicImageRight = document.getElementById('slide-basic-image--right');


/*** GLOBAL VARIABLES ***/
let currentPresentation = null;
//let presentationData = null;

/*** EVENT LISTENERS ***/
save.addEventListener("click", ()=>{
    let presentationData = parsePresentation(editor.value); 
    previewPresentation(presentationData);
});

/*** FUNCTIONS ***/
(async function () {
  await getPresentation();
  let presentationData = parsePresentation(editor.value);
  previewPresentation(presentationData);
})();

function previewPresentation(data){
  slidesPreview.innerHTML = "";
  const theme = data.options.theme;
  console.log(theme);

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
