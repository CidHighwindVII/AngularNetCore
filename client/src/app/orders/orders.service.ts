import { IOrder, IOrderToCreate } from './../shared/Models/order';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import { Injectable } from '@angular/core';
import { IDeliveryMethod } from '../shared/Models/deliveryMethod';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrdersForUser() {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get<IOrder>(this.baseUrl + 'orders/' + id);
  }
}
