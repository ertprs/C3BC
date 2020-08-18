import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Answer {
  id?: string;
  name: string;
  content: string;
  category?: string;
}

export interface RequestAnswer {
  name: string;
  content: string;
  keyWords: Array<string>
  category?: DocumentReference;
}

@Injectable({
  providedIn: 'root'
})
export class KeepDataService {
  answersRef: AngularFirestoreCollection<firebase.firestore.DocumentData>
  categoriesRef: AngularFirestoreCollection<firebase.firestore.DocumentData>

  constructor(
    private angularFirestore: AngularFirestore
  ) {
    this.answersRef = angularFirestore.collection("answers")
    this.categoriesRef = angularFirestore.collection("categories")
  }

  // palavras-chaves serão úteis para propósito de pesquisa
  private generateKeyWords(string): Set<string> {
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
        keyWords = new Set<string>([...keyWords, ...this.generateKeyWords(substring[0])])
    }

    return keyWords
  }

  // Aqui iremos tratar da forma adequada para ir para o Firestore
  private adjustAnswerToFirestore(answer: Answer): RequestAnswer {
    // propriedades name e content são salvas sem espaços duplicados e desnecessários no início ou fim
    const name = answer.name.replace(/\s{2,}/g, " ").trim()
    const content = answer.content.replace(/\s{2,}/g, " ").trim()
    // convertemos o conjunto para array
    const keyWords = [...this.generateKeyWords(name)]
    const adjustedAnswer: RequestAnswer = {name, content, keyWords}

    // Como a propriedade category, no Firestore, é do tipo reference, precisamos manter assim
    if(answer.category){
      const categoryRef: DocumentReference = this.categoriesRef.doc(answer.category).ref
      adjustedAnswer.category = categoryRef
    }

    return adjustedAnswer
  }

  public createAnswer(answer: Answer): Promise<DocumentReference> {
    const newAnswer: RequestAnswer = this.adjustAnswerToFirestore(answer)

    return this.answersRef.ref.where("name", "==", newAnswer.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty){
                resolve( this.answersRef.add(newAnswer) )
              } else
                reject("Já há uma resposta com esse nome. Considere um nome que diferencie ou incrementar a resposta já existente.")
            })
          })
  }

  public updateAnswer(answer: Answer): Promise<void> {
    // embora, no Firestore, uma resposta não tenha a propriedade id, iremos colocar o id do próprio documento como uma propriedade chamada id,
    // quando um componente requisitar a leitura das respostas, graças ao recurso idField, usado nos métodos de leitura aqui presentes. Por esse
    // motivo conseguimos pegar um id
    const answerID = answer.id
    const updatedAnswer: RequestAnswer = this.adjustAnswerToFirestore(answer)

    return this.answersRef.ref.where("name", "==", updatedAnswer.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty || ( whereResult.docs[0].ref.id == answerID)){
                resolve(
                  this.answersRef
                    .doc(answerID)
                    .update(updatedAnswer)
                )
              } else {
                reject("Já há uma resposta com esse nome. Considere um nome que diferencie ou incrementar a resposta já existente.")
              }
            })
          })
  }

  public readAnswersByCategory(category: string): Observable<Answer[]> {
    const categoryRef = this.categoriesRef.doc(category).ref
    const selectedAnswersCollection = this.angularFirestore.collection<Answer>('answers', answersRef => answersRef.where('category', '==', categoryRef))
    const answersObservable = selectedAnswersCollection.valueChanges({idField: 'id'})

    return answersObservable
  }

  public deleteAnswer(answerDocID: string): Promise<void> {
    return this.answersRef.doc(answerDocID).delete()
  }

  public searchByText(text: string): Observable<Answer[]> {
    const selectedAnswersCollection = this.angularFirestore.collection<Answer>( 'answers', answersRef => answersRef.where('keyWords', 'array-contains', text.toLowerCase()) )
    const answersObservable = selectedAnswersCollection.valueChanges({idField: 'id'})

    return answersObservable
  }
}
