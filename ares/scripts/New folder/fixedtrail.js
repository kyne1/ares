const ef = new Effect(6, e => {
  print(Draw);
  for(let i = 0; i < 2; i++){
      /*Draw.color(i == 0 ? Pal.thoriumPink : Pal.bulletYellow);
      var m = i == 0 ? 1 : 0.5;

      var rot = e.rotation + 180;
      var w = 15 * e.fout() * m - 2;
      Drawf.tri(e.x, e.y, w, (30 + Mathf.randomSeedRange(e.id, 15)) * m, rot);
      Drawf.tri(e.x, e.y, w, 10 * m, rot + 180);*/
  }
});

module.exports = ef;