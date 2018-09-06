export interface ITodoListModel {
  id: number;
  status: boolean;
  title: string;
  description: string;
  criticity: Criticity;
}

export enum Criticity {
  URGENT, HIGHT, NORMAL, LOW
}
