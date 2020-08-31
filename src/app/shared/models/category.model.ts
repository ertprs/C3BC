import { Answer } from './answer.model';

export interface Category {
    id: string;
    name: string;
    parents?: Category[];
}

export interface StoredCategory {
    name: string;
    parents?: Category[];
}

export interface CategoryWithAnswers extends Category {
    answers: Answer[]
}

export interface CategoryDialogData {
    categoryID: string;
}

export interface CategoryWithParentsID {
    id: string;
    name: string;
    parentsID?: string[];
}