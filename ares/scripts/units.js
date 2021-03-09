//const a = Vars.content.getByName(ContentType.unit,"ares-ares");
//print(Vars.content.getByName(ContentType.unit,"ares-ares").name);
const a = extend(UnitType, "ares", {
  
  /*drawWeapons(unit){
  }*/
});


//event kills all spawned units
/*
Events.on(UnitCreateEvent, e => {
  e.unit.health = 0;
});*/


a.constructor = () => extend(UnitEntity, {});
//Blocks.airFactory.plans = Blocks.airFactory.plans.put(UnitFactory.UnitPlan(a, 60 * 30, ItemStack.with(Items.copper, 2)));
//secondary bullet frag


const controllernew = extend(AIController, {

});

/*const turretnew = extend(Turret,{
  updateShooting(){
});*/

//event listernerns dont need loope


const sbf = extend(BasicBulletType, {
  width: 5,
  height: 7,
  lifetime: 30,
  speed: 5,
  splashDamageRadius: 20,
  splashDamage: 5,
  despawnEffect: Fx.none,
  hitEffect: Fx.none
});

//sb = secondary bullet
const sb = extend(BasicBulletType, {
  width: 7,
  height: 11,
  shrinkY: 0,
  speed: 12,
  drag: 0,
  damage: 70,
  makeFire: true,
  status: StatusEffects.burning,
  lifetime: 28,
  fragBullets: 2,
  fragCone: 30,
  //add frag
  fragBullet: sbf,
  despawnEffect: Fx.none,
  hitEffect: Fx.none
});

//main gun shot -> minshot
const slagfrag = extend(LiquidBulletType,{
  liquid: Liquids.slag,
  lifetime: 18,
  speed: 2,
  damage: 51
});

const mainshot = extend(ArtilleryBulletType, {
  frontColor: Color(255, 137, 0),
  width: 7,
  height: 40,
  shrinkY: 0,
  speed: 3.6,
  drag: 0,
  splashDamageRadius: 125,
  splashDamage: 350,
  status: StatusEffects.burning,
  lifetime: 190,
  trailEffect: Fx.artilleryTrail,
  hitEffect: Fx.massiveExplosion,
  keepVelocity: false,
  fragBullets: 13,
  fragBullet: slagfrag
});

//main gun
const w1 = extendContent(Weapon, "main-cannon",{
  load(){this.super$load();this.region = Core.atlas.find("ares-main-cannon");},
  
  rotate: true,
  rotateSpeed: 1.1,
  mirror: false,
  x: 0,
  y: 74,
  reload: 90,
  xRand: 8,
  shootY: 25,
  recoil: 4,
  inaccuracy: 4,
  shots: 3,
  shotDelay: 5,
  shootSound: Sounds.boom,
  bullet: mainshot
});
a.weapons.add(w1);

//secondaries
for(let i = 0; i < 5; i++){
  for(let j = -1; j < 2; j += 2){
    var w2 = extendContent(Weapon, "secondaries", {
    //load sprite
    load(){this.super$load();this.region = Core.atlas.find("ares-secondaries");}, 
    shootY: 10,
    reload: 9.5,
    x: 25*j,
    y: -36.5 + i * 20, //spacing 20 going up 5 times
    shadow: 1,
    rotateSpeed: 8,
    rotate: true,
    shots: 1,
    shotDelay: 0,
    inaccuracy: 3,
    velocityRnd: 0.2,
    shootSound: Sounds.shoot,
    mirror: false,
    bullet: sb
});
  /*if(w2.isShooting()){
    this.reload = 1;
  }*/
  a.weapons.add(w2);
}}
/*
a.weapons.get(9).reload = 5;

print("eeee");
print(rld2);
*/
//a.onChange()


/*for(let i = 0; i < Vars.content.units().size; i++){
  if(Vars.content.units().get(i).name == "ares-ares"){
    a = Vars.content.units().get(i);
    print(a);
  }
}*/



let arr = new Array();
for(let i = 0; i < Blocks.airFactory.plans.size; i++){
  arr[i] = Blocks.airFactory.plans.get(i);
}
arr.push(UnitFactory.UnitPlan(a, 60 * 5, ItemStack.with(Items.copper, 2)));
Blocks.airFactory.plans = Seq.with(arr);

//.put()
