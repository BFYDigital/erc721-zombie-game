interface IZombiePart {
  gene: number;
  bodyPart: string;
  sx: number;
  sy: number;
}

interface IPartsImageMapper {
  zombiePart: IZombiePart;
  image: HTMLImageElement;
}

export default class ZombieBuilder {

  private context: CanvasRenderingContext2D;
  private dna: number;
  private zombieParts: Array<IZombiePart>;
  private partsImageMapper: Array<IPartsImageMapper>;
  private partsCount: number;

  constructor(dna: number, context: CanvasRenderingContext2D) {
    this.dna = dna;
    this.context = context;
    this.zombieParts = [];
    this.partsImageMapper = [];
    this.partsCount = 0;
  }

  public build() {
    let genes: Array<number> = this.numberToArray(this.dna);

    this.loadZombieParts(genes);

    this.loadImages();
  }

  private async loadImages() {
    for (let i = 0; i < this.zombieParts.length; i++) {
      let zombiePart: IZombiePart = this.zombieParts[i];
      let image = new Image();
      this.partsImageMapper.push({
        zombiePart: zombiePart,
        image: image
      });

      let self = this;
      image.onload = () => {
        self.partsCount--;
        if (!self.partsCount) {
          for (let i = 0; i < self.partsImageMapper.length; i++) {
            let map: IPartsImageMapper = self.partsImageMapper[i]
            let adjustedWidth = map.image.width * 0.2;
            let adjustedHeight = map.image.height * 0.2;

            self.context.drawImage(
              map.image,
              ((self.context.canvas.width - adjustedWidth) / 2) * map.zombiePart.sx,
              (self.context.canvas.height - adjustedHeight) * map.zombiePart.sy,
              adjustedWidth,
              adjustedHeight);
          }
        }
      };

      let bodyPart = zombiePart.bodyPart;
      let num = zombiePart.gene;

      image.src = (await import(/* @vite-ignore */ `../../assets/images/zombies/${bodyPart}_${num}.png`)).default
    }
  }

  private loadZombieParts(genes: Array<number>) {

    // GENE 5 - RIGHT SHOULDER, ARM, HAND START
    this.zombieParts.push({
      gene: genes[5] % 3,
      bodyPart: 'right_arm',
      sx: 1.37,
      sy: 0.55
    });

    this.zombieParts.push({
      gene: genes[5] % 3,
      bodyPart: 'right_hand',
      sx: 1.45,
      sy: 0.65
    });

    this.zombieParts.push({
      gene: genes[5] % 3,
      bodyPart: 'right_shoulder',
      sx: 1.3,
      sy: 0.44
    });
    // GENE 5 - RIGHT SHOULDER, ARM, HAND END

    // GENE 3 - HIPS AND LEGS START
    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'right_lower_leg',
      sx: 1.22,
      sy: 0.85
    });

    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'right_leg',
      sx: 1.2,
      sy: 0.7
    });

    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'right_foot',
      sx: 1.37,
      sy: 0.92
    });

    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'hip',
      sx: 1,
      sy: 0.6
    });

    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'left_lower_leg',
      sx: 0.83,
      sy: 0.85
    });

    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'left_leg',
      sx: 0.81,
      sy: 0.70
    });

    this.zombieParts.push({
      gene: genes[3] % 3,
      bodyPart: 'left_foot',
      sx: 0.93,
      sy: 0.92
    });
    // GENE 3 - HIPS AND LEGS END

    // GENE 0 - BODY START
    this.zombieParts.push({
      gene: genes[0] % 3,
      bodyPart: 'body',
      sx: 1,
      sy: 0.45
    });
    // GENE 0 - BODY END

    // GENE 4 - LEFT SHOULDER ARM, HAND START
    this.zombieParts.push({
      gene: genes[4] % 3,
      bodyPart: 'left_arm',
      sx: 0.63,
      sy: 0.57
    });

    this.zombieParts.push({
      gene: genes[4] % 3,
      bodyPart: 'left_shoulder',
      sx: 0.67,
      sy: 0.44
    });

    this.zombieParts.push({
      gene: genes[4] % 3,
      bodyPart: 'left_hand',
      sx: 0.63,
      sy: 0.65
    });
    // GENE 4 - LEFT SHOULDER ARM, HAND END

    // GENE 1 - NECK START
    this.zombieParts.push({
      gene: genes[1] % 3,
      bodyPart: 'neck',
      sx: 1,
      sy: 0.35
    });
    // GENE 1 - NECK END

    // GENE 2 - HEAD START
    this.zombieParts.push({
      gene: genes[2],
      bodyPart: 'head',
      sx: 1,
      sy: 0.1
    });
    // GENE 2 - HEAD START

    this.partsCount = this.zombieParts.length;
  }

  private numberToArray(num: number) {
    const result = [];
    while (num) {
      const last = num % 10;
      result.unshift(last);
      num = Math.floor(num / 10);
    };
    return result;
  };
}
