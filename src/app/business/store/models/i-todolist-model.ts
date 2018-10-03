import {EntityState} from '@ngrx/entity';

export interface ITodoListModel {
  id: number;
  status: boolean;
  title: string;
  description: string;
  criticity: Criticity;
}

export interface TodoListStateEntity extends EntityState<ITodoListModel> {
  loading: boolean;
  loaded: boolean;
  logs: {
    type: string;
    messageLabel: string;
  };
}

export enum Criticity {
  LOW, NORMAL, HIGH, URGENT
}
