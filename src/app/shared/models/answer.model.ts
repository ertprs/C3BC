import { DocumentReference } from '@angular/fire/firestore';

export interface Answer {
    id?: string;
    name: string;
    content: string;
    category?: DocumentReference;
}

export interface StoredAnswer {
    name: string;
    content: string;
    keyWords: Array<string>
    category?: DocumentReference;
}