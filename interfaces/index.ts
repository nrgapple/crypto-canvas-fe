export interface Pixel {
  x: number;
  y: number;
  hexColor: string;
  id?: string;
  owner?: string;
  creatorId?: number;
}

export interface Bid {
  from: string;
  amount: number;
}
