import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Order } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  email: string = '';
  orders: Order[];

  constructor(private orderService: OrderService,
              private oktaAuthService: OktaAuthService) { }
  
  ngOnInit(): void {
    this.setUserEmail();
  }

  setUserEmail() {
    this.oktaAuthService.getUser().then(
      (res) => {
        this.email = res.email;
        this.setOrders();
      });
  }

  setOrders() {
    this.orderService.getOrders(this.email).subscribe(
      data => {
        this.orders = data;
      }
    )
  }

}
