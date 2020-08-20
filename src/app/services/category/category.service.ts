import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StoredCategory } from "../../shared/models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: AngularFirestoreCollection<StoredCategory>

  constructor(
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

  public readCategories(): Observable<StoredCategory[]> {
    const categoriesObservable = this.categoriesCollection.valueChanges()

    return categoriesObservable
  }

  public deleteCategory(categoryName: string): Promise<void> {
    const categoryID = categoryName.toLowerCase()

    return this.categoriesCollection.doc(categoryID).delete()
  }
}
