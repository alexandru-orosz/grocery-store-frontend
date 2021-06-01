import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../common/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  getOrders(email: string): Observable<Order[]> {
    const ordersUrl = `${this.apiServerUrl}/orders/${email}`;
    return this.httpClient.get<Order[]>(ordersUrl);
  }
}
