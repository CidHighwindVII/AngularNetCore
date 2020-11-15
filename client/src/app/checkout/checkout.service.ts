import { IOrderToCreate } from './../shared/Models/order';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { Injectable } from '@angular/core';
import { IDeliveryMethod } from '../shared/Models/deliveryMethod';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(order: IOrderToCreate): Observable<any> {
    return this.http.post(this.baseUrl + 'orders', order);
  }

  // Todo: Instead of sorting on the client, sort on the server.
  getDeliveryMethods(): Observable<IDeliveryMethod[]> {
    return this.http.get(this.baseUrl + 'orders/deliveryMethods').pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
