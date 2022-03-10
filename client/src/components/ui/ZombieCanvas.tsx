import React, { FC, useEffect, useRef } from 'react';
import ZombieBuilder from '../../utils/lib/ZombieBuilder';

interface IZombieCanvasProps {
  dna: number;
}

const ZombieCanvas: FC<IZombieCanvasProps> = ({ dna }: IZombieCanvasProps) => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        let zombieBuilder = new ZombieBuilder(dna, context);
        zombieBuilder.build();
      }
    }
  }, []);

  return (
    <canvas height={300} width={224} ref={canvasRef}></canvas>
  );
};

export default ZombieCanvas;
