var reload = 10;
var timer = {};
var spread = 12;
var range = 225;
var rows = 3;//at least 2

for(let i = 0; i < 2*rows; i++){
    timer[i] = 0;
}

const bullet = extend(BasicBulletType, {
    width: 7,
    height: 15,
    lifetime: 70,
    speed: 12,
    damage: 65,
    drag: 0,
    //pierce: true,
    despawnEffect: Fx.plasticExplosion,
    hitEffect: Fx.plasticExplosion
});

//print("bullet "+ bullet);
//ta for turret ability
const ta = extend(Ability, {
    update(unit){
        for(let j = 0; j < 2; j++){
            for(let i = 0; i < rows; i++){
                let iter = i+rows*j;//iterate timer list
                //ripped from aicontroller.java in anuke/mindustry
                let rotation = unit.rotation - 90;
                let mountx = unit.x + Angles.trnsx(rotation, 50*j - 25, 100/(rows-1)*i - 36.5);
                let mounty = unit.y + Angles.trnsy(rotation, 50*j - 25, 100/(rows-1)*i - 36.5);

                timer[iter] += Time.delta;
                let target = Units.closestTarget(unit.team, mountx, mounty, range);
                print(target);//detects target correclty and loops

                if(timer[iter] >= reload && !Units.invalidateTarget(target, unit.team, mountx, mounty)){
                    timer[iter] = 0;
                    bullet.create(unit,
                        unit.team, 
                        mountx, 
                        mounty, 
                        180*Math.atan2(target.y-mounty,target.x-mountx)/Math.PI - spread/2 + spread*Math.random());
                    //print("proc");
                }
            }
        }
    }
});
//UnitTypes.gamma.abilities.add(ta); //test
const a = require('ares');
a.abilities.add(ta);



module.exports = ta;

