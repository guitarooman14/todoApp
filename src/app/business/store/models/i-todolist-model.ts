export interface ITodoListModel {
  id: number;
  status: boolean;
  title: string;
  description: string;
  criticity: Criticity;
}

export interface ITodoListState {
  data: ITodoListModel[];
  loading: boolean;
  loaded: boolean;
}

export enum Criticity {
  LOW, NORMAL, HIGH, URGENT
}
