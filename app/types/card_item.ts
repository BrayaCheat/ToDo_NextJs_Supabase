export interface Item {
  id: number;
  todo: string;
  isCompleted: boolean;
  created_at: Date;
}

export interface CardItem {
  item: Item;
  onActionCompleted: () => void;
}
