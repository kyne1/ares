module.exports = function getBullet(){
    const bullet = extend(BasicBulletType, {
        width: 7,
        height: 11,
        shrinkY: 0,
        speed: 12,
        drag: 0,
        damage: 70,
        makeFire: true,
        status: StatusEffects.burning,
        lifetime: 28,
        despawnEffect: Fx.none,
        hitEffect: Fx.none
        });
    return bullet;
}
