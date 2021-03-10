//const a = Vars.content.getByName(ContentType.unit,"ares-ares");
//print(Vars.content.getByName(ContentType.unit,"ares-ares").name);
const a = extend(UnitType, "ares", {
  /*drawWeapons(unit){
  }*/
});
a.constructor = () => extend(UnitEntity, {});

const z = extend(UnitType, "zenith2", {
});
z.constructor = () => extend(UnitEntity, {});
const zshield = new JavaAdapter(ShieldRegenFieldAbility, {}, 30,2500,60,10);
const ashield = new JavaAdapter(ShieldRegenFieldAbility, {}, 1500,3000,1000,100);
/*const zshield = extend(ShieldRegenFieldAbility, {
  load(){this.super$load();},
  amount: 500,
  max: 500,
  reload: 150,
  range: 10
});*/
z.abilities.add(zshield);
a.abilities.add(ashield);
//scripted unitcreateevent
/*const ucreateE = extendContent(EventType,{
  UnitCreateEvent(unit, maker){
    this.unit = unit;
    this.maker = maker;
  }
});*/

//temporary patch to get units spawned by ares
/*
Events.on(UnitUnloadEvent, e => {
  if(e.unit == UnitTypes.zenith){

  }
  else if(e.unit == UnitTypes.flare){

  }
  print(e.unit);
});
*/


//Blocks.airFactory.plans = Blocks.airFactory.plans.put(UnitFactory.UnitPlan(a, 60 * 30, ItemStack.with(Items.copper, 2)));


const controllernew = extend(AIController, {

});

//messed up the game's global.js line 41
/*const t = extend(Turret, {
  shoot(type){
    effects();
  }
});*/

//event listernerns dont need loope
const sbf = extend(BasicBulletType, {
  width: 5,
  height: 7,
  lifetime: 30,
  speed: 5,
  damage: 10,
  pierce: true,
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

var spawnZenith = extend(UnitSpawnAbility,{
  load(){this.super$load();},

  //add 'this.' if var undefined
  unit: z,
  spawnX: 0,
  spawnY: 5,
  spawnTime: 1200
});

var spawnFlare = extend(UnitSpawnAbility,{
  load(){this.super$load();},
  /*update(unit){
    this.timer += Time.delta;
    if(this.timer >= this.spawnTime && Units.canCreate(unit.team, this.unit)){
        let x = unit.x + Angles.trnsx(unit.rotation, this.spawnY, this.spawnX), y = unit.y + Angles.trnsy(unit.rotation, this.spawnY, this.spawnX);
        this.spawnEffect.at(x, y);
        let u = this.unit.create(unit.team);
        //Events.fire(new UnitUnloadEvent(u));
        u.set(x, y);
        //u.speed = 10;
        u.rotation = unit.rotation;
        if(!Vars.net.client()){
            u.add();
        }
        this.timer = 0;
    }
  },*/
  unit: UnitTypes.flare,
  spawnX: 0,
  spawnY: -35,
  spawnTime: 120
});

/*var shield = extend(ShieldRegenFieldAbility, {
  load(){this.super$load();},
  amount: 2500,
  max: 2500,
  reload: 3000,
  range: 560
});*/

for(let i = 0; i < 3; i++){
a.abilities.add(spawnZenith);
}

//a.abilities.add(shield);
a.abilities.add(spawnFlare);



/*a.isShooting().onchange = function(){
  a.weapons.get(0).reload = 0.1;
}*/
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
