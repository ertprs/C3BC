import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category, CategoryWithAnswers } from "../../shared/models/category.model";
import { AnswerService } from '../answer/answer.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: AngularFirestoreCollection<Category>;

  constructor(
    private answerService: AnswerService,
    angularFirestore: AngularFirestore
  ) {
    this.categoriesCollection = angularFirestore.collection<Category>("categories");
  }

  private adjustCategoryToFirestore(category: Category): Category {
    const name = category.name.replace(/\s{2,}/g, " ").trim().toUpperCase();
    const adjustedCategory: Category = {name};

    if(category.parents) {
      adjustedCategory.parents = category.parents;
    }

    return adjustedCategory;
  }

  public createCategory(category: Category): Promise<void> {
    const newCategory: Category = this.adjustCategoryToFirestore(category);
    const newCategoryID = newCategory.name.toLowerCase();

    return this.categoriesCollection.ref.where("name", "==", newCategory.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty){
                resolve( this.categoriesCollection.doc(newCategoryID).set(newCategory) );
              } else
                reject("Já há uma categoria com esse nome.");
            })
          })
  }

  public updateCategory(category: any): Promise<void> {
    const categoryID = category.id;
    const updatedCategory: Category = this.adjustCategoryToFirestore(category);

    return this.categoriesCollection.ref.where("name", "==", updatedCategory.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty || ( whereResult.docs[0].ref.id == categoryID)){
                resolve(
                  this.categoriesCollection
                    .doc(categoryID)
                    .update(updatedCategory)
                );
              } else {
                reject("Já há uma categoria com esse nome.");
              }
            })
          })
  }

  public readCategories(): Observable<Category[]> {
    return this.categoriesCollection.valueChanges();
  }

  // provisório
  public readCategoriesWithAnswers(): Observable<Observable<CategoryWithAnswers>[]> {
    const superiorOrderObservableOfCategoriesWithAnswers: Observable<Observable<CategoryWithAnswers>[]> = this.categoriesCollection.valueChanges().pipe(
      map( (categories: Category[]) : Observable<CategoryWithAnswers>[] => {
        // para cada categoria, iremos acrescentar suas respectivas respostas
        const categoriesWithAnswersObservable: Observable<CategoryWithAnswers>[] = categories.map( (category: Category) : Observable<CategoryWithAnswers> => {

          const categoryID = category.name.toLowerCase();

          // capturamos as respostas de uma categoria
          const categoryWithAnswersObservable: Observable<CategoryWithAnswers> = this.answerService.readAnswersByCategoryID(categoryID).pipe(
            map( (answers) : CategoryWithAnswers => {
              return {
                ...category,
                answers: answers
              }
            })
          );

          return categoryWithAnswersObservable;
        })

        // aqui, transformamos Observable<storedCategoryWithAnswers>[] em Observable<storedCategoryWithAnswers[]>
        return categoriesWithAnswersObservable;
      })
    )

    // aqui, transformamos um Observable<Observable<storedCategoryWithAnswers[]>> em Observable<storedCategoryWithAnswers[]>, ou seja, transformamos um Observable
    // de ordem superior em um outro de primeira ordem
    const firstOrderObservable: Observable<Observable<CategoryWithAnswers>[]> = superiorOrderObservableOfCategoriesWithAnswers;

    return firstOrderObservable;
  }

  public deleteCategory(categoryName: string): Promise<void> {
    const categoryID = categoryName.toLowerCase();

    return this.categoriesCollection.doc(categoryID).delete();
  }
}
