import { DocumentReference } from '@angular/fire/firestore';

export interface Answer {
    id?: string;
    name: string;
    content: string;
    categories?: [DocumentReference];
}

export interface StoredAnswer {
    name: string;
    content: string;
    keyWords: Array<string>
    categories?: [DocumentReference];
}

export interface StoredAnswerWithID extends StoredAnswer {
    id: string
}

export interface AnswerDialogData {
    answerID: string;
}