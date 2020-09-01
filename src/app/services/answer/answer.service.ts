import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Answer, StoredAnswer, storedAnswerWithIDTypeToAnswerType } from "../../shared/models/answer.model";
import { Category } from "../../shared/models/category.model";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  answersCollection: AngularFirestoreCollection<StoredAnswer>
  categoriesCollection: AngularFirestoreCollection<Category>

  constructor(
    private angularFirestore: AngularFirestore
  ) {
    this.answersCollection = angularFirestore.collection<StoredAnswer>("answers")
    this.categoriesCollection = angularFirestore.collection<Category>("categories")
  }

  // palavras-chaves serão úteis para propósito de pesquisa
  private generateAnswerKeyWords(string: string): Set<string> {
    // usamos conjuntos para não termos elementos repetidos
    let keyWords = new Set<string>()
    // captura o restante da string que segue o primeiro espaço
    const substring = string.match(/(?<=\ ).*/)

    // irá gerar substrings que correspondem a string digitada de forma incompleta
    for (let index = 1; index <= string.length; index++) {
        keyWords.add( string.substr(0, index).toLowerCase() );
    }

    if(substring) {
        // se houver uma substring conforme a regex definida, passaremos a função nessa substring, assim conseguiremos gerar mais possibilidades.
        // geramos um novo conjunto para unir com outro conjunto
        keyWords = new Set<string>([...keyWords, ...this.generateAnswerKeyWords(substring[0])])
    }

    return keyWords
  }

  private adjustToCategoryRef(categoriesID: string[]): DocumentReference[] {
    return categoriesID.map( categoryID => this.categoriesCollection.doc(categoryID).ref );
  }

  // Aqui iremos ajustar as propriedades name e content para serem salvas sem espaços duplicados e desnecessários no início ou fim.
  // Também adicionaremos palavras-chave
  private adjustAnswerToFirestore(answer: Answer | Omit<Answer, "id">): StoredAnswer {
    const name = answer.name.replace(/\s{2,}/g, " ").trim();
    const content = answer.content.replace(/\s{2,}/g, " ").trim();
    const categories = this.adjustToCategoryRef(answer.categoriesID);

    // convertemos o conjunto para array
    const keyWords = [...this.generateAnswerKeyWords(name)];

    const adjustedAnswer: StoredAnswer = {name, content, categoriesRef: categories, keyWords};

    return adjustedAnswer;
  }

  public createAnswer(answer: Omit<Answer, "id">): Promise<DocumentReference> {
    const newAnswer: StoredAnswer = this.adjustAnswerToFirestore(answer);

    return this.answersCollection.ref.where("name", "==", newAnswer.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty){
                resolve( this.answersCollection.add(newAnswer) );
              } else
                reject("Já há uma resposta com esse nome. Considere um nome que diferencie ou incrementar a resposta já existente.");
            })
          })
  }

  public updateAnswer(answer: Answer): Promise<void> {
    // embora, no Firestore, uma resposta não tenha a propriedade id, iremos colocar o id do próprio documento como uma propriedade chamada id,
    // quando um componente requisitar a leitura das respostas, graças ao recurso idField, usado nos métodos de leitura aqui presentes. Por esse
    // motivo conseguimos pegar um id
    const answerID = answer.id
    const updatedAnswer: StoredAnswer = this.adjustAnswerToFirestore(answer)

    return this.answersCollection.ref.where("name", "==", updatedAnswer.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty || ( whereResult.docs[0].ref.id == answerID)){
                resolve(
                  this.answersCollection
                    .doc(answerID)
                    .update(updatedAnswer)
                )
              } else {
                reject("Já há uma resposta com esse nome. Considere um nome que diferencie ou incrementar a resposta já existente.")
              }
            })
          })
  }

  public readAnswers(): Observable<Answer[] > {
    return this.answersCollection.valueChanges({idField: 'id'}).pipe(map(storedAnswerWithIDTypeToAnswerType));
  }

  public readAnswersByCategoryID(categoryID: string): Observable<Answer[]> {
    const categoryRef = this.categoriesCollection.doc(categoryID).ref;
    const selectedAnswersCollection = this.angularFirestore.collection<StoredAnswer>('answers', answersRef => answersRef.where('categoriesRef', 'array-contains', categoryRef));
    const answersObservable = selectedAnswersCollection.valueChanges({idField: 'id'}).pipe(map(storedAnswerWithIDTypeToAnswerType));

    return answersObservable;
  }

  public deleteAnswer(answerID: string): Promise<void> {
    return this.answersCollection.doc(answerID).delete();
  }
}
