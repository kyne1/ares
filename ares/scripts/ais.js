//based off meep's code
//ad = artificial dumb
let a = require("ares");
const ad = prov(() => {
  var ai = extend(AIController, {
    //deletes auto control
    updateMovement(){

    }
  });
  return ai;
});

a.defaultController = ad;
