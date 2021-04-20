//natvie array dont work
//java arraylist dont work
var blockList = Array();
var locName = "sim block"


const simBlock = extend(Wall, "simblock", {
    size: 1,
    localizedName: locName,
    description: "simulation block for a CA controller",
    destructible: true,
    health: 10,

});

simBlock.setupRequirements(Category.logic, ItemStack.with(
    Items.copper, 1
))

simBlock.buildType = ent => {
    //variable go here
    ent = extend(Wall.WallBuild, simBlock, {
        init(tile,  team,  shouldAdd,  rotation){
            blockList.push(this.super$init(tile,  team,  shouldAdd,  rotation));
            //this.kill();
        },
        //not normally used
        killed(){
            //find and remove self
            blockList.splice(blockList.indexOf(block => block == this),1);
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
        blockList.splice(blockList.indexOf(block => block == this),1);
    }
});

module.exports = {
    list: blockList,
    block: simBlock
};