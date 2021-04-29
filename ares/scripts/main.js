let units = [
  "ares",
  "gausstank",
  "grouper",
  "warper"
];

for(let i = 0; i < units.length; i++){
  require("units/"+units[i]);
}

require('units/ai/ares-ai');

require('abilities/shootAbility');
require('abilities/customUnitSpawn');

require('blocks/shotgunblock');
require('blocks/GOLcontroller');
require('blocks/simBlock');

require('bullets/armorpiercing');

require('libs/refresh');
require('fx/fixedtrail');
//require('effects.js');
//require('wcompchange');
