export function parsePresentation(markdown) {
  let parsedContent = marked.parse(markdown).split("<hr>");
  let globalOptions = getGlobalOptions(parsedContent);
  let slides = parseSlides(parsedContent.slice(1), globalOptions);
}

function parseSlides(content, options){
    console.log(content, options);
}

function getGlobalOptions(content) {
  /* 
        First slide must be on the form:
        [Option 1: Value, option 2: value, etc.]
     */

  let globalOptions = {
    theme: "default",
    ducks: "quack"
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
    
    if(globalOptionsKeys.some(el => el === key)){
        globalOptions[key] = value;
    }
  }

  return globalOptions;

}
