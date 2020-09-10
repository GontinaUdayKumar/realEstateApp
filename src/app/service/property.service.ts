import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { propertiesData } from '../shared/properties.data'

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor() { }

  getProperties(): Observable<any> {
    return of(propertiesData());
  }

}
