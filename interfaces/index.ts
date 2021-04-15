export interface DartRawResp {
  name: string;
  dartId: string;
  owner: string;
  rgbaArray: string[];
  dimensions: DimensionsResp;
}

export interface DimensionsResp {
  width: string;
  height: string;
}

export interface DartRaw {
  name: string;
  dartId: number;
  owner: number;
  rgbaArray: number[];
  dimensions: Dimensions;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Dart {
  name: string;
  dartId: number;
  owner: string;
}

export interface ImageParts {
  buffer: Buffer;
  name?: string;
  dimensions: Dimensions;
}

export interface User {
  createdAt: Date;
  email?: string;
  id: number;
  name?: string;
  nonce: number;
  updatedAt: Date;
  wallet: string;
  profile?: Profile;
}

export interface Profile {
  about?: string;
  username?: string;
}
