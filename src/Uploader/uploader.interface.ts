export interface State {
    files: File[];
    count: number;
    error: string;
}

export type Action =
  | { type: 'SET_SELECTED_FILE'; payload: File[] }
  | { type: 'SET_COUNT'; payload: number }
  | { type: 'SET_ERROR'; payload: string }

export enum ActionType {
    SET_SELECTED_FILE = 'SET_SELECTED_FILE',
    SET_COUNT = 'SET_COUNT',
    SET_ERROR = 'SET_ERROR',
}