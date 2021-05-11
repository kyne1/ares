const units = [
  "ares",
  "gausstank",
  "grouper",
  "warper",
  "swarm",
  "/ai/ares-ai",
];

const abilities = [
  "shootAbility",
  "customUnitSpawn",
  "commandShield",
];

const blocks = [
  "shotgunblock",
  "GOLcontroller",
  "simBlock",
];

const bullets = [
  "armorpiercing",
  "sapbomb",
];



units.forEach(i => {
  require("units/"+i);
});

abilities.forEach(i => {
  require("abilities/"+i);
});

blocks.forEach(i => {
  require("blocks/"+i);
});

bullets.forEach(i => {
  require("bullets/"+i);
});

require('libs/refresh');
require('fx/fixedtrail');
require('dir');

//require('effects.js');
//require('wcompchange');
