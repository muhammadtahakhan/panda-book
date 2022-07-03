import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalEventService {

  private _eventBus: BehaviorSubject<BroadcastEvent>;

  constructor() {
    this._eventBus = new BehaviorSubject<BroadcastEvent>({key: '', data: ''});
  }

  broadcast(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  on<T>(key: any): Observable<T> {
    return this._eventBus
              .asObservable()
              .pipe(filter((event:any)=>event.key===key), map((event:any) => <T>event.data))
      
  }
  
}
