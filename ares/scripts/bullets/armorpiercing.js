
//@params penmod, armormod are functions, see below.
module.exports = function getBullet(armormod, penmod){
    const bull = extend(BasicBulletType, {

        //only registers units hit
        //entity hitboxc -> can be treated as unit
        hitEntity( b,  entity,  initialHealth){
            if(entity instanceof Healthc){
                entity.damage(armormod(entity.armor)*b.damage);
            }
    
            if(entity instanceof Unit){
                entity.impulse(Tmp.v3.set(entity).sub(b.x, b.y).nor().scl(this.knockback * 80));
                entity.apply(this.status, this.statusDuration);
            }
            b.time += penmod(entity.armor);
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
        width: 7,
        height: 11,
        shrinkY: 0,
        speed: 12,
        drag: 0,
        damage: 50, //treated as baseDamage
        //makeFire: true,
        //status: StatusEffects.burning,
        lifetime: 28,
        pierce: true
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
