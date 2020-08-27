import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { StoredAnswerWithID, StoredAnswer } from '../../shared/models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _showSearchToolbar = new BehaviorSubject<boolean>(false);

  constructor(
    private angularFirestore: AngularFirestore
  ) { }
  
  public searchAnswerByText(text: string): Observable<StoredAnswerWithID[]> {
    const selectedAnswersCollection = this.angularFirestore.collection<StoredAnswer>( 'answers', answersRef => answersRef.where('keyWords', 'array-contains', text.toLowerCase()) )
    const answersObservable = selectedAnswersCollection.valueChanges({idField: 'id'})

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