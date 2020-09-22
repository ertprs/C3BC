import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { StoredAnswer, Answer, storedAnswerWithIDTypeToAnswerType } from '../../models/answer.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _showSearchToolbar = new BehaviorSubject<boolean>(false);

  constructor(
    private angularFirestore: AngularFirestore
  ) { }
  
  public searchAnswerByText(text: string): Observable<Answer[]> {
    const selectedAnswersCollection = this.angularFirestore.collection<StoredAnswer>( 'answers', answersRef => answersRef.where('keyWords', 'array-contains', text.toLowerCase()) )
    const answersObservable = selectedAnswersCollection.valueChanges({idField: 'id'}).pipe(map(storedAnswerWithIDTypeToAnswerType))

    return answersObservable
  }

  get showSearchToolbar() {
    return this._showSearchToolbar
  }

  enableSearchToolbar() {
    this._showSearchToolbar.next(true)
  }

  disableSearchToolbar() {
    this._showSearchToolbar.next(false)
  }
}
