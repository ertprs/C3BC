import { Answer } from './answer.model';
import { DocumentReference } from '@angular/fire/firestore';

// essa categoria tem o atributo parentsID para facilitar a passagem por meio da rota, já que é estritamente proibido a passagem de tipos mais complexos (como observables)
// como parâmetro do estado de uma rota
export interface Category {
    id: string;
    name: string;
    parentIDs: string[];
}

// embora um categoria não tenha, necessáriamente, uma outra categoria pai, exigiremos o atributo, mesmo que um array vazio, pois o método update do firestore só irá atualizar
// caso o atributo exista
export interface StoredCategory {
    name: string;
    parentRefs: DocumentReference[];
}

export interface CategoryWithAnswers extends Category {
    answers: Answer[]
}

export interface CategoryDialogData {
    categoryID: string;
}