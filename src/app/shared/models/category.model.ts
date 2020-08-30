import { Answer } from './answer.model';

export interface StoredCategory {
    name: string;
    parents?: StoredCategory[];
}

export interface storedCategoryWithAnswers extends StoredCategory {
    answers: Answer[]
}

export interface CategoryDialogData {
    categoryName: string;
}