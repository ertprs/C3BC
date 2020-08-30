import { StoredCategory } from './category.model';

export function removeKeyWordsProperties(storedAnswersWithKeyWords: (Answer & { keyWords: Array<string> })[]): Answer[] {
    return storedAnswersWithKeyWords.map(answer => {
        delete answer.keyWords;

        return answer
    })
}

export interface Answer {
    id: string;
    name: string;
    content: string;
    categories?: StoredCategory[];
}

export interface StoredAnswer {
    name: string;
    content: string;
    keyWords: Array<string>
    categories?: StoredCategory[];
}

export interface AnswerDialogData {
    answerID: string;
}

export interface AnswerWithCategoriesName {
    id: string;
    name: string;
    content: string;
    categoriesName: string[];
}