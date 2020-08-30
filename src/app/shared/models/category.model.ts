import { Answer } from './answer.model';

export interface Category {
    name: string;
    parents?: Category[];
}

export interface CategoryWithAnswers extends Category {
    answers: Answer[]
}

export interface CategoryDialogData {
    categoryName: string;
}