class Cloud extends MovableObject {
  y = 30;
  width = 500;
  height = 300;

  constructor() {
    super().loadImage(
      "assets/img_pollo_locco/img/5_background/layers/4_clouds/1.png",
      "assets/img_pollo_locco/img/5_background/layers/4_clouds/2.png"
    );
    this.spawnCloudsRandom();
    this.animationCloud();
  }

  spawnCloudsRandom() {
    this.x = Math.random() * 2500;
  }

  animationCloud() {
    this.moveLeft();
  }
}
