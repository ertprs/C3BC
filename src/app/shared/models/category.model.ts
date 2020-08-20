import { DocumentReference } from '@angular/fire/firestore';

export interface StoredCategory {
    name: string;
    parent?: DocumentReference;
}