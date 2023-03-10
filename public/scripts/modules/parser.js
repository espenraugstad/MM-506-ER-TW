export function parsePresentation(markdown) {
  let parsedContent = marked.parse(markdown).split("<hr>");
  let globalOptions = getGlobalOptions(parsedContent);
  let parsedSlides = parseSlides(parsedContent, globalOptions);
  return {
    options: globalOptions,
    slides: parsedSlides
  }
}

export function parseSlideHtml(slide){
  const type = slide.type;

  switch(type){
    case "ti":
      //console.log(slide.content.body);
      // Style
      // Get all h1
      let h1s = slide.content.body.querySelectorAll("h1");
      for(let h1 of h1s){
        h1.className = "text-4xl text-bold"
      }
      console.log(h1s);
      break;
    default:
      break;

  }


  // For now, just re-serialize the dom
  const ser = new XMLSerializer();
  let content = ser.serializeToString(slide.content);
  return content;
}

function parseSlides(content, options) {
  let parsedSlides = [];
  let slides = content.slice(1);
  for (let slide of slides) {
    let type = getSlideType(slide);
    let content = parseSlideContent(slide, type);
    parsedSlides.push({
      type: type,
      content: content
    });
  }

  return parsedSlides;
}

function parseSlideContent(slide, type) {
  // DOM-parser to create
  const dp = new DOMParser();
  let domSlide = dp.parseFromString(slide, "text/html");

  // Get the body and children
  let body = domSlide.querySelector("body");
  let children = body.children;

  // Remove all options
  for(let child of children){
    if(child.innerText.includes("[")){
      child.remove();
    }
  }
  // Return the dom without options
  return domSlide;
}

function getSlideType(slide) {
  // Extract content between [].
  if (slide.includes("[")) {
    //console.log(slide.slice(slide.indexOf("[")+1,slide.indexOf("]")));
    let slideType = slide.slice(slide.indexOf("[") + 1, slide.indexOf("]"));
    return slideType;
  } else return "tx";
}

function getGlobalOptions(content) {
  /* 
        First slide must be on the form:
        [Option 1: Value, option 2: value, etc.]
     */

  let globalOptions = {
    theme: "default",
    ducks: "quack",
  };

  let rawOptions = content[0].toLowerCase();
  // 1. Extract text between []
  let options = rawOptions.slice(
    rawOptions.indexOf("[") + 1,
    rawOptions.indexOf("]")
  );

  // 2. Split on , to array
  let listOfOptions = options.split(",");

  // 3. Loop  through options and split on :
  for (let option of listOfOptions) {
    let [key, value] = option.split(":");
    key = key.trim();
    value = value.trim();

    // 4. Check if an option is valid and add it to globalOptions if valid
    let globalOptionsKeys = Object.keys(globalOptions);

    if (globalOptionsKeys.some((el) => el === key)) {
      globalOptions[key] = value;
    }
  }

  return globalOptions;
}
