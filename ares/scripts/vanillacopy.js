const z = extend(UnitType, "zenith2", {
});
z.constructor = () => extend(UnitEntity, {});
const zshield = new JavaAdapter(ShieldRegenFieldAbility, {}, 30,2500,60,10);
/*const zshield = extend(ShieldRegenFieldAbility, {
  load(){this.super$load();},
  amount: 500,
  max: 500,
  reload: 150,
  range: 10
});*/
z.abilities.add(zshield);
