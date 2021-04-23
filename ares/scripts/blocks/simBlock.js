//natvie array dont work
//java arraylist dont work
var blockList = new Map();
var locName = "sim block"


const simBlock = extend(Wall, "simblock", {
    load(){
        this.super$load()
        this.region = Core.atlas.find("ares-simblock");
    },
    icons(){
        return [
          this.region
        ];
    },
    hasShadow: false,
    size: 1,
    localizedName: locName,
    description: "simulation block for a CA controller",
    destructible: true,
    health: 10,
    rebuildable: false,
    breakable: true,
    solid: true,
    buildCostMultiplier: 1,
});

simBlock.setupRequirements(Category.logic, ItemStack.with(
    Items.silicon, 2
))

simBlock.buildType = ent => {
    //variable go here
    ent = extend(Wall.WallBuild, simBlock, {
        init(tile,  team,  shouldAdd,  rotation){
            let position = tile.x+","+tile.y;
            //print(position);
            this.super$init(tile,  team,  shouldAdd,  rotation);
            blockList.set(position, this);
            //print(this.tile.x);
            //this.kill();
            return this;
        },
        //not normally used
        killed(){
            //find and remove self
            let position = this.tile.x + "," + this.tile.y;
            blockList.delete(position);
            this.super$killed();
        },
    });
    return ent;
}

Events.on(BlockBuildEndEvent, e => {
    if(e.breaking && 
        //checks if e.tile.block is equal to simBlock
        //locName.localeCompare(e.tile.block().getDisplayName(e.tile).substring(0,locName.length)) == 0
        //nvm just use cblock
        e.tile.build.cblock == simBlock
        )
    {
        let position = e.tile.x + "," + e.tile.y;
        blockList.delete(position);
    }
});

module.exports = {
    list: blockList,
    block: simBlock
};