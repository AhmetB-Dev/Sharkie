class Character extends MovableObject {

    constructor() {
    super().loadImage("assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png");
    }

  jump() {
    console.log("Character jumping");
  }
}
