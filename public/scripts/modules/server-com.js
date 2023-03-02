export default class Config {
    constructor(method, body, token) {
      this.method = method;
      this.body = body;
      this.token = token;
    }
  
    get cfg() {
      let returnObj = {
          method: this.method
      };
     
      let headers = {
          "content-type": "application/json"
      }
  
      if(this.token){
          headers.authorization = "Bearer " + this.token;
      }
  
      returnObj.headers = headers;
  
      if(this.body){
          returnObj.body = JSON.stringify(this.body);
  
      }
      return returnObj;
    }
  }
  