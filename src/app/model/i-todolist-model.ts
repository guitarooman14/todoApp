export interface ITodoListModel {
  id: number;
  status: boolean;
  title: string;
  description: string;
  criticity: Criticity;
}

export enum Criticity {
  LOW, NORMAL, HIGH, URGENT
}

export namespace Criticity {

  export function parse(criticity: string): Criticity {
    return Criticity[criticity];
  }
}
