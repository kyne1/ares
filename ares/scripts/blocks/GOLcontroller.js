var sim = require('blocks/simBlock');
var blockList = sim.list;
var simBlock = sim.block;

//global variable for simulation
var updateSpeed = 0;
var paused = true;
var timer = 0;


const controller = extend(Wall, "controller", {
    size: 1,
    update: true,
    localizedName: "GOL controller",
    description: "controls the GOL blocks' timing.",
    destructible: true,
    configurable: true,
});

controller.setupRequirements(Category.logic, ItemStack.with(
    Items.silicon, 125,
    Items.titanium, 180,
    Items.copper, 210,
    Items.lead, 175
))

controller.buildType = ent => {
    //variable go here
    var pauseIcon = Icon.pause;
    ent = extend(Wall.WallBuild, controller, {
        buildConfiguration(table){
            if(paused){
                this.pauseIcon = Icon.play;
            }
            else this.pauseIcon = Icon.pause;
            table.button(this.pauseIcon, Styles.clearTransi, () => {
                paused = !paused;
                //force an update
                table.clearChildren();
                this.buildConfiguration(table);
            }).size(40);

            table.button(Icon.refresh, Styles.clearTransi, ()=>{
                paused = true;
                simUpdate();
                table.clearChildren();
                this.buildConfiguration(table);
            }).size(40);

            //clear button
            table.button(Icon.cancel, Styles.clearTransi, () => {
                for(let i = 0; i < blockList.length; i++){
                    blockList[i].tile.remove();
                }
                blockList.splice(0,blockList.length);
            }).size(40);

            //copy and translate from sharustry
            let slide = new Slider(0, 1, 0.01, false);
            slide.setValue(updateSpeed);
            slide.moved(i => updateSpeed = i);
            table.add(slide).width(controller.size * 3 - 20).padTop(4);
        },
        update(){
            this.super$update();
            //print(blockList.length);
            if(!paused){
                timer += updateSpeed*Time.delta;
                if(timer > 5){
                    timer = 0;
                    simUpdate();
                }
            }
        },
    });
    return ent;
}

function simUpdate(){
    // blocklist index
    let killList = Array();
    //cache checked points as well as storing whether has a block or not at that point
    //<key, bool> pairing
    let cacheMap = new Map();
    for(let i = 0; i < blockList.length; i++){
        let c = 0; //counting
        let block = blockList[i];
        for(let j = 0; j < 8; j++){
            let x = rot8x(j);
            let y = rot8y(j);
            x += World.toTile(block.x);
            y += World.toTile(block.y);
            let a = x+","+y;
            if(cacheMap.has(a)){
                //print("debug");
                if(cacheMap.get(a)) c++;
            }
            else{
                let bool = Vars.world.tile(x,y).block() == simBlock;
                cacheMap.set(a,bool);
                //if(bool)print(cacheMap.has(a));
                if(bool)c++;
                //print(bool);
            }
            //print(Vars.world.tile(x, y).block());
        }
        if(c < 2 || c > 3){
            killList.push(i);
        }
    }
    //find empty space, falses
    cacheMap.forEach(function(value, key, map){
        let s = key.split(',');
        let x = parseInt(s[0]);
        let y = parseInt(s[1]);
        //print(Vars.world.tile(x,y).block()==Blocks.air);
        if(value == false && Vars.world.tile(x,y).block()==Blocks.air){
            let c = 0;
            //281 231
            for(let i = 0; i < 8; i++){
                let x1 = x+rot8x(i);
                let y1 = y+rot8y(i);
                //print(x + "," + y);
                //print(map.get(key));
                let a = x1+","+y1;
                if(map.get(a)==true) c++;
                //print(map.has(a));
            }
            //print(c);
            if(c == 3) Vars.world.tile(x, y).setBlock(simBlock, Team.sharded);
        }
    });
    //remove blocks top-down
    for(let i = killList.length - 1; i >= 0; i--){
        blockList[killList[i]].tile.remove();
        blockList.splice(killList[i],1);
    }
}

//@param 0 to 7, start at top with 0 and go cw which ends with 7
//@return array [x,y]
function rot8x(i){
    let x;
    if(i%4 == 0)x = 0;
    else if(i < 4)x = 1;  
    else x = -1;
    return x;
}

function rot8y(i){
    let y;
    if((i+2)%4 == 0) y = 0;
    else if(i > 2 && i < 6) y = -1;
    else y = 1;
    return y;
}