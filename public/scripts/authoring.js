import Config from "./modules/server-com.js";
import { parsePresentation } from "./modules/parser.js";

/*** HTML ELEMENTS ***/
const presentationTitle = document.getElementById("presentation-title");
const editor = document.getElementById("editor");
const slidesPreview = document.getElementById('slides-preview');

/*** GLOBAL VARIABLES ***/
let currentPresentation = null;

/*** EVENT LISTENERS ***/

/*** FUNCTIONS ***/
(async function () {
  await getPresentation();
  let presentationData = parsePresentation(editor.value);
})();

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
