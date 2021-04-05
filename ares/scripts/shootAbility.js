var reload = 60;
var timer = 0;
const bullet = extend(BasicBulletType, {
    width: 5,
    height: 7,
    lifetime: 20,
    speed: 15,
    damage: 10,
    drag: 0.03,
    pierce: true,
    despawnEffect: Fx.none,
    hitEffect: Fx.none
});
//print("bullet "+ bullet);
//ta for turret ability
const ta = extend(Ability, {
    update(unit){
        timer += Time.delta;
        if(timer >= reload){
            timer = 0;
            for(let i = 0; i < 10; i++){
                bullet.create(unit, unit.team, unit.x, unit.y, Math.random()*360);
                //print("proc");
            }
        }
    }
});
//UnitTypes.gamma.abilities.add(ta); //test
const a = require('ares');
a.abilities.add(ta);



module.exports = ta;

