export type Gender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export type Status = 'Alive' | 'Dead' | 'unknown';

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  type: string;
  gender: Gender;
  origin: any;
  location: any;
  image: string;
  episode: string[];
  url: string;
  created: string;
}