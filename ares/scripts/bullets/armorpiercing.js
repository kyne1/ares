const trail = require("fx/fixedtrail");


//@params penmod, armormod are functions, see below.
module.exports = function getBullet(armormod, penmod){
    const bull = extend(BasicBulletType, {

        //only registers units hit
        //entity hitboxc -> can be treated as unit
        hitEntity( b,  entity,  initialHealth){
            if(entity instanceof Healthc){
                let a = armormod(entity.armor)
                entity.damage(a*b.damage);
                //print(a);
                if(a > 2){
                    penEf.at(b.x,b.y,b.rotation());
                    Fx.blastsmoke.at(b.x,b.y,b.rotation());
                }
            }
    
            if(entity instanceof Unit){
                entity.impulse(Tmp.v3.set(entity).sub(b.x, b.y).nor().scl(this.knockback * 80));
                entity.apply(this.status, this.statusDuration);
            }
            b.time += penmod(entity.armor);
        },
        draw(b){
            this.super$draw(b);
            //print(b.x+" "+b.y+" "+b.rotation());
            ef.at(b.x, b.y, b.rotation());
        },
        /*bcreate(  owner,  team,  x,  y,  angle,  damage,  velocityScl,  lifetimeScl,  data , b){
            let bullet = Bullet.create();
            bullet.type = this;
            bullet.owner = owner;
            bullet.team = team;
            bullet.time = 0;
            bullet.vel.trns(angle, this.speed * velocityScl);
            if(this.backMove){
                bullet.set(x - bullet.vel.x * Time.delta, y - bullet.vel.y * Time.delta);
            }else{
                bullet.set(x, y);
            }
            //bullet.lifetime = this.lifetime * lifetimeScl; //modified
            bullet.lifetime = this.lifetime * lifetimeScl;
            bullet.data = data;
            bullet.drag = this.drag;
            bullet.hitSize = this.hitSize;
            bullet.damage = (damage < 0 ? this.damage : damage) * bullet.damageMultiplier();
            bullet.add();

            if(this.keepVelocity && owner instanceof Velc) bullet.vel.add(owner.vel.x, owner.vel.y);
            return bullet;
        },*/
        width: 5,
        height: 16,
        shrinkY: 0,
        speed: 16.6,
        drag: 0,
        damage: 60, //treated as baseDamage
        //makeFire: true,
        //status: StatusEffects.burning,
        lifetime: 26,
        pierce: true,
        pierceBuilding: true
        });
    return bull;
}

//sample for armormod and penmod:
//@params a -> armor
//@params t -> unit

//returns a modifier that multiplies the damage
//example: very efficient when dealing with low armor but whiffs high armor
function aMod(a){
    if(a < 3){
        return 20;
    }
    else return 0.5;
}

//how much life time subtracted
function pMod(a){
    return 1;
}

//effect
const ef = new Effect(6, e => {
    for(let i = 0; i < 2; i++){
        Draw.color(i == 0 ? Pal.thoriumPink : Pal.bulletYellow);
        var m = i == 0 ? 1 : 0.5;
  
        var rot = e.rotation + 180;
        var w = 15 * e.fout() * m - 2;
        Drawf.tri(e.x, e.y, w, (30 + Mathf.randomSeedRange(e.id, 15)) * m, rot);
        Drawf.tri(e.x, e.y, w, 10 * m, rot + 180);
    }
});

const penEf = new Effect(5, 130, e => {
    for(let i = 0; i < 2; i++){
        Draw.color(i == 0 ? Pal.thoriumPink : Pal.bulletYellow);
        
        let m = i == 0 ? 1 : 0.5;

        for(let j = 0; j < 5; j++){
            let rot = e.rotation + Mathf.randomSeedRange(e.id + j, 50);
            let w = 14 * e.fout() * m;
            Drawf.tri(e.x, e.y, w, (40 + Mathf.randomSeedRange(e.id + j, 30)) * m, rot);
            Drawf.tri(e.x, e.y, w, 20 * m, rot + 180);
        }
    }
});
