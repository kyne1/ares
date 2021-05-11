
module.exports = function make(radius,regen,max,cooldown){
    let ability = new JavaAdapter(ForceFieldAbility,{
        load(){
            this.super$load();
        },
        update(unit){
            this.super$update(unit);
            if(unit.isCommanding()){
                unit.controlling.forEach(u => {
                    this.super$update(u);
                });
            }
        },
        draw(unit){
            this.super$draw(unit);
            if(unit.isCommanding()){
                unit.controlling.forEach(u => {
                    this.super$draw(u);
                });
            }
        }
    }
    ,radius,regen,max,cooldown
    );
    return ability;
}