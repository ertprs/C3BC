import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category, CategoryWithAnswers, StoredCategory } from "../../shared/models/category.model";
import { AnswerService } from '../answer/answer.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: AngularFirestoreCollection<StoredCategory>;

  constructor(
    private answerService: AnswerService,
    angularFirestore: AngularFirestore
  ) {
    this.categoriesCollection = angularFirestore.collection<StoredCategory>("categories");
  }

  private adjustToCategoryRef(categoryIDs: string[]): DocumentReference[] {
    return categoryIDs.map( categoryID => this.categoriesCollection.doc(categoryID).ref );
  }

  private adjustCategoryToFirestore(category: Category | Omit<Category, "id">): StoredCategory {
    const name = category.name.replace(/\s{2,}/g, " ").trim().toUpperCase();
    const parents = category.parentIDs ? this.adjustToCategoryRef(category.parentIDs) : [];

    const adjustedCategory: StoredCategory = {name, parentRefs: parents};

    return adjustedCategory;
  }

  public createCategory(category: Omit<Category, "id">): Promise<DocumentReference> {
    const newCategory: StoredCategory = this.adjustCategoryToFirestore(category);

    return this.categoriesCollection.ref.where("name", "==", newCategory.name).get()
          .then(whereResult => {
            return new Promise( (resolve, reject) => {
              if(whereResult.empty){
                resolve( this.categoriesCollection.add(newCategory) );
              } else
                reject("Já há uma categoria com esse nome.");
            })
          })
  }

  public updateCategory(category: Category): Promise<void> {
    const categoryID = category.id;
    const updatedCategory: StoredCategory = this.adjustCategoryToFirestore(category);

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
    return this.categoriesCollection.valueChanges({idField: "id"}).pipe(
      map( storedCategories => {
        return storedCategories.map( storedCategory => {
          const parentIDs = storedCategory.parentRefs.map( parentRef => parentRef.id);
          const category: Category = {id: storedCategory.id, name: storedCategory.name, parentIDs};
          
          return category;
        });
      })
    );
  }

  // provisório
  public readCategoriesWithAnswers(): Observable<Observable<CategoryWithAnswers>[]> {
    const superiorOrderObservableOfCategoriesWithAnswers: Observable<Observable<CategoryWithAnswers>[]> = this.readCategories().pipe(
      map( (categories: Category[]) : Observable<CategoryWithAnswers>[] => {
        // para cada categoria, iremos acrescentar suas respectivas respostas
        const categoriesWithAnswersObservable: Observable<CategoryWithAnswers>[] = categories.map( (category: Category) : Observable<CategoryWithAnswers> => {

          // capturamos as respostas de uma categoria
          const categoryWithAnswersObservable: Observable<CategoryWithAnswers> = this.answerService.readAnswersByCategoryID(category.id).pipe(
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

  public deleteCategory(categoryID: string): Promise<void> {
    return this.categoriesCollection.doc(categoryID).delete();
  }
}
