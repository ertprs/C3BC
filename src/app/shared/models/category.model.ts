import { DocumentReference } from '@angular/fire/firestore';
import { StoredAnswerWithID } from './answer.model';

export interface StoredCategory {
    name: string;
    parent?: DocumentReference;
}

export interface storedCategoryWithAnswers extends StoredCategory {
    answers: StoredAnswerWithID[]
}