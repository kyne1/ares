var reload = 10;
var timer = {};
var spread = 12;
var range = 270;
var rows = 3;//at least 2

for(let i = 0; i < 2*rows; i++){
    timer[i] = 0;
}

const bullet = extend(BasicBulletType, {
    width: 7,
    height: 15,
    lifetime: 55,
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
                let mount = new Vec2(
                    unit.x + Angles.trnsx(rotation, 50*j - 25, 100/(rows-1)*i - 36.5),
                    unit.y + Angles.trnsy(rotation, 50*j - 25, 100/(rows-1)*i - 36.5)
                    );
                timer[iter] += Time.delta;
                let target = Units.closestTarget(unit.team, mount.x, mount.y, range);
                //print(target);//detects target correclty and loops
                if(timer[iter] >= reload && !Units.invalidateTarget(target, unit.team, mount.x, mount.y)){
                    timer[iter] = 0;
                    let to = Predict.intercept(mount, target, bullet.speed);
                    let r = 180*Math.atan2(to.y-mount.y,to.x-mount.x)/Math.PI - spread/2 + spread*Math.random();
                    bullet.create(unit,
                        unit.team, 
                        mount.x, 
                        mount.y, 
                        r);
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

