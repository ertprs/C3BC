import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable, combineLatest} from 'rxjs';
import { StoredCategory, storedCategoryWithAnswers } from "../../shared/models/category.model";
import { AnswerService } from '../answer/answer.service';
import { map, concatAll, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: AngularFirestoreCollection<StoredCategory>

  constructor(
    private answerService: AnswerService,
    angularFirestore: AngularFirestore
  ) {
    this.categoriesCollection = angularFirestore.collection<StoredCategory>("categories")
  }

  private adjustCategoryToFirestore(category: StoredCategory): StoredCategory {
    const name = category.name.replace(/\s{2,}/g, " ").trim()
    const adjustedCategory: StoredCategory = {name}

    if(category.parent) {
      adjustedCategory.parent = category.parent
    }

    return adjustedCategory
  }

  public createCategory(category: StoredCategory): Promise<DocumentReference> {
    const newCategory: StoredCategory = this.adjustCategoryToFirestore(category)

    return this.categoriesCollection.ref.where("name", "==", newCategory.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty){
                resolve( this.categoriesCollection.add(newCategory) )
              } else
                reject("Já há uma categoria com esse nome.")
            })
          })
  }

  public updateCategory(category: StoredCategory): Promise<void> {
    const categoryID = category.name.toLowerCase()
    const updatedCategory: StoredCategory = this.adjustCategoryToFirestore(category)

    return this.categoriesCollection.ref.where("name", "==", updatedCategory.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty || ( whereResult.docs[0].ref.id == categoryID)){
                resolve(
                  this.categoriesCollection
                    .doc(categoryID)
                    .update(updatedCategory)
                )
              } else {
                reject("Já há uma categoria com esse nome.")
              }
            })
          })
  }

  // provisório
  public readCategoriesWithAnswers(): Observable<Observable<storedCategoryWithAnswers>[]> {
    const superiorOrderObservableOfCategoriesWithAnswers: Observable<Observable<storedCategoryWithAnswers>[]> = this.categoriesCollection.valueChanges().pipe(
      map( (categories: StoredCategory[]) : Observable<storedCategoryWithAnswers>[] => {
        // para cada categoria, iremos acrescentar suas respectivas respostas
        const categoriesWithAnswersObservable: Observable<storedCategoryWithAnswers>[] = categories.map( (category: StoredCategory) : Observable<storedCategoryWithAnswers> => {

          const categoryID = category.name.toLowerCase()

          // capturamos as respostas de uma categoria
          const categoryWithAnswersObservable: Observable<storedCategoryWithAnswers> = this.answerService.readAnswersByCategoryID(categoryID).pipe(
            map( (answers) : storedCategoryWithAnswers => {
              return {
                ...category,
                answers: answers
              }
            })
          )

          return categoryWithAnswersObservable
        })

        // aqui, transformamos Observable<storedCategoryWithAnswers>[] em Observable<storedCategoryWithAnswers[]>
        return categoriesWithAnswersObservable
      })
    )

    // aqui, transformamos um Observable<Observable<storedCategoryWithAnswers[]>> em Observable<storedCategoryWithAnswers[]>, ou seja, transformamos um Observable
    // de ordem superior em um outro de primeira ordem
    const firstOrderObservable: Observable<Observable<storedCategoryWithAnswers>[]> = superiorOrderObservableOfCategoriesWithAnswers;

    return firstOrderObservable;
  }

  public deleteCategory(categoryName: string): Promise<void> {
    const categoryID = categoryName.toLowerCase()

    return this.categoriesCollection.doc(categoryID).delete()
  }
}
