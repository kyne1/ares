//weaponscomp
const wcomp = new JavaAdapter(WeaponsComp, {
  aim(x,y){
    for(mount in this.mounts){
       mount.aimX = 1;
       mount.aimY = 1;
    }
  }
});
