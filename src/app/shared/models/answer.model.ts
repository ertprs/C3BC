import { DocumentReference } from '@angular/fire/firestore';

export function storedAnswerWithIDTypeToAnswerType( storedAnswers: (StoredAnswer & {id: string})[] ): Answer[] {
    return storedAnswers.map( storedAnswer => {
      const categoryIDs = storedAnswer.categoriesRef.map( categoryRef => categoryRef.id);

      const answer: Answer = {id: storedAnswer.id, name: storedAnswer.name, content: storedAnswer.content, categoryIDs: categoryIDs};
      return answer;
    });
}

export interface Answer {
    id: string;
    name: string;
    content: string;
    categoryIDs: string[];
}

export interface StoredAnswer {
    name: string;
    content: string;
    categoriesRef: DocumentReference[];
    keyWords: Array<string>
}

export interface AnswerDialogData {
    answerID: string;
}