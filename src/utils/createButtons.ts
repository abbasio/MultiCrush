export const createTextButton = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  onClick: Function
) => {
  const button = scene.add
    .text(x, y, text)
    .setInteractive()
    .on('pointerover', () => {
      button.setStyle({
        color: '#0f0',
      });
    })
    .on('pointerout', () => {
      button.setStyle({
        color: '#fff',
      });
    })
    .on('pointerdown', () => {
      onClick();
    });
  return button;
};
