export interface IZombie {
  id: number;
  cooldownTime: number;
  dna: number;
  name: string;
  level: number;
  lossCount: number;
  winCount: number;
  isReady: boolean;
  hungerLevel: number;
}

export interface IToastStatus { 
  message: string; 
  type: string; 
  show: boolean; 
}
