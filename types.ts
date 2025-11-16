export enum Role {
  USER = 'user',
  AI = 'ai',
}

export interface Source {
  title: string;
  uri: string;
}

export interface Message {
  role: Role;
  content: string;
  sources?: Source[];
}
