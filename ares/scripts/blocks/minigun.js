

var shootsound = Sounds.shoot;
var shootfx = Fx.shootSmall;

const minigun = extend(ItemTurret,"minigun",{
    load() {
		this.super$load();
        this.baseRegion = Core.atlas.find("block-3");
        this.mountRegion = Core.atlas.find("ares-minigun")
        //this.gunmount = Core.atlas.find("ares-shotgunblock3");
	},
    /*icons(){
        return [
          this.baseRegion,
          Core.atlas.find("ares-machete-icon")
        ];
    },*/
    localizedName: "minigun",
    description: "turret go brrr",
    range: 160,
    unloadable: false,
    health: 1800,
    inaccuracy: 2.5,
    size: 3,
    expanded: true,
    breakable: true,
    rebuildable: true,
    research: Blocks.scatter,
    recoil: 0,
    barrelTorque: 0.02,
    maxSpin: 3.5,
    //restitution: 0.3
    //alternate: true
});

const leadshot = extend(BasicBulletType,{
    speed: 6,
    damage: 20,
    lifetime: 40,
    width: 6,
    height: 10,
    knockback: 1,
    pierce: false
});

minigun.ammo(
    Items.lead, leadshot
);

minigun.setupRequirements(Category.turret, ItemStack.with(
    Items.copper, 24,
    Items.graphite, 18,
    Items.lead, 45
));

//for vec2 only
function Vec2Len(v){
    return Math.sqrt(Math.pow(v.x,2)+Math.pow(v.y,2));
}

function toRad(angle){
    return (angle * Math.PI/180);
}

function toDeg(angle){
    return (angle * 180/Math.PI);
}

//ripped from meepoffaith/prog-mats-js
minigun.buildType = ent => {
    var spinpos = 0; // 0 to 10 arbitrary
    var spinSpeed = 0;
    var canShoot = false;
    ent = extend(ItemTurret.ItemTurretBuild, minigun,{
        updateTile(){
            this.super$updateTile();
            //print(spinpos);
            if(spinSpeed != 0){
                spinpos += spinSpeed
                if(spinpos > 10){
                    spinpos -= 10;
                    canShoot = true;
                };
            };
            if(!this.isShooting()){
                spinSpeed -= minigun.barrelTorque;
                spinSpeed = Math.max(0,spinSpeed);
            }
            print(spinSpeed);
        },
        draw(){
            let rotation = this.rotation-90
            Draw.rect(minigun.baseRegion, this.x, this.y, 0);

            //how to layer
            Draw.z(Layer.turret);
            Draw.rect(minigun.mountRegion,this.x,this.y,rotation);
        },
        shoot(type){
           this.super$shoot(type);
        },
        updateShooting(){
            spinSpeed += minigun.barrelTorque;
            spinSpeed = Math.min(spinSpeed,minigun.maxSpin);
            if(canShoot){
                var type = this.peekAmmo();
                this.shoot(type);
                canShoot = false;
            }
        },
    });
    return ent;
};
