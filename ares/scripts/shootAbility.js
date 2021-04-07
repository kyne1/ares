//weapon variables
var reload = 10;
var timer = {};
var spread = 12;
var range = 230;
var rows = 4;//at least 2
var rspeed = 3;
var firecone = 5;

//general positionings
var yspan = 80;
var ystart = 55;

//properties for each turret
var yoffset = 15; //bullet offset from barrel
var xradaroffset = 5;

//deafen it
var shootSound = Sounds.shoot;

//for each pair, on one side (right), then mirror it.
//back , front
var anglelimit = [
    [110,-75], //back
    [75,-75], //middle
    [75,-75], //middle
    [75,-120], //front
];



//function variables pre-initialized -- dont touch
var rto = {}; //target rotation
var mrotation = {}; //mount rotation
var m;


for(let i = 0; i < 2*rows; i++){
    timer[i] = 0;
    rto[i] = 0;
    mrotation[i] = -90;
}

const bullet = extend(BasicBulletType, {
    width: 7,
    height: 15,
    lifetime: 55,
    speed: 12,
    damage: 65,
    splashDamageRadius: 2,
    splashDamage: 7,
    drag: 0,
    //pierce: true,
    despawnEffect: Fx.plasticExplosion,
    hitEffect: Fx.plasticExplosion
});

function angleDifference(from, to){
    let difference = to - from;
    while (difference < -180) difference += 360;
    while (difference > 180) difference -= 360;
    return difference;
}

//flipping an angle down a line perpendicular to the wraparound
/*
    90deg
     |_   0deg
     |
   -90deg
*/
function flip90(angle){
    if(angle >= 0){
        return 180-angle;
    }
    else if(angle < 0){
        return -180-angle;
    }
}

/*turret setup:
0  3
1  4
2  5

*/
//print("bullet "+ bullet);
//ta for turret ability
const ta = extend(Ability, {
    update(unit){

        for(let j = 0; j < 2; j++){
            for(let i = 0; i < rows; i++){
                var iter = i+rows*j;//iterate timer list
                
                //ripped from aicontroller.java in anuke/mindustry
                let rotation = unit.rotation - 90;
                let mount = new Vec2(
                    unit.x + Angles.trnsx(rotation, 50*j - 25, yspan/(rows-1)*i - ystart),
                    unit.y + Angles.trnsy(rotation, 50*j - 25, yspan/(rows-1)*i - ystart)
                    );

                timer[iter] += Time.delta;
                let target = Units.closestTarget(unit.team, mount.x - xradaroffset + 2*xradaroffset*j, mount.y, range);
                //print(target);//detects target correclty and loops
                

                //turret control pt 2
                if(j==1){
                    //right guns
                    if(angleDifference(mrotation[iter],rotation) > anglelimit[i][0]){
                        mrotation[iter] = -anglelimit[i][0]+rotation;
                    }
                    else if(angleDifference(mrotation[iter],rotation) < anglelimit[i][1]){
                        mrotation[iter] = -anglelimit[i][1]+rotation;
                    }
    
                }
                else{
                    //left guns, need flip
                    //positive
                    if(angleDifference(mrotation[iter],rotation) < flip90(anglelimit[i][0])
                     && angleDifference(mrotation[iter],rotation) > 0){

                        mrotation[iter] = -flip90(anglelimit[i][0])+rotation;
                        //print("<" + flip90(anglelimit[i][0]) + " currently:" + angleDifference(mrotation[iter],rotation));
                    }
                    else if(angleDifference(mrotation[iter],rotation) > flip90(anglelimit[i][1])
                    && angleDifference(mrotation[iter],rotation) <= 0 ){

                        mrotation[iter] = -flip90(anglelimit[i][1])+rotation;
                        //print(flip90(anglelimit[i][1]) + " !currently:" + angleDifference(mrotation[iter],rotation));
                    } 
                    //print("sets when it >" + flip90(anglelimit[i][1]) + " currently:" + angleDifference(mrotation[iter],rotation));
                }
                

                
                if(!Units.invalidateTarget(target, unit.team, mount.x, mount.y)){
                    let to = Predict.intercept(mount, target, bullet.speed);
                    rto[iter] = 180*Math.atan2(to.y-mount.y,to.x-mount.x)/Math.PI;

                    //turret controls
                    if(Math.abs(angleDifference(rto[iter],mrotation[iter])) <= Time.delta*rspeed){
                        mrotation[iter] = rto[iter];
                    }
                    else if(angleDifference(mrotation[iter],rto[iter]) > 0){
                        mrotation[iter] += Time.delta*rspeed;
                    }
                    else{
                        mrotation[iter] -= Time.delta*rspeed
                    }

                    if(timer[iter] >= reload && Math.abs(mrotation[iter] - rto[iter])<=firecone){
                        timer[iter] = 0;
                        bullet.create(unit,
                            unit.team, 
                            mount.x + Math.cos(Math.PI*mrotation[iter]/180)*yoffset, 
                            mount.y + Math.sin(Math.PI*mrotation[iter]/180)*yoffset, 
                            mrotation[iter] - spread/2 + spread*Math.random());
                        //print("proc");
                        shootSound.at(mount);
                    }
                }
            }
        }
    },
    draw(unit){
        var turret = Core.atlas.find("ares-secondaries");
        //unit rotation instead of mount
        var r = unit.rotation-90; 
        for(let j = 0; j < 2; j++){
            for(let i = 0; i < rows; i++){
                var iter = i+rows*j;
                Draw.rect(
                    turret,
                    unit.x + Angles.trnsx(r, 50*j - 25, yspan/(rows-1)*i - ystart),
		        	unit.y + Angles.trnsy(r, 50*j - 25, yspan/(rows-1)*i - ystart),
                    mrotation[iter] - 90
                )
            }
        }
    }
});
//UnitTypes.gamma.abilities.add(ta); //test
const a = require('ares');
a.abilities.add(ta);



module.exports = ta;

