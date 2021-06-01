import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor(private snackBar: MatSnackBar) {

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }

   }

  addToCart(cartItem: CartItem, displaySnackBar: boolean) {
    
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.productId === cartItem.productId)
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart) {
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();

    if(displaySnackBar) {
      let snackBarRef = this.snackBar.open(`${cartItem.name} was added to cart.`, 'Dismiss', {duration: 2500});
    }

  }

  computeCartTotals() {
    
    let totalPriceValue: number = 0.00;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values; all subscribers will recieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();

  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  decrementQuantity(cartItem: CartItem) {

    cartItem.quantity--;

    if(cartItem.quantity === 0) {
      this.remove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.productId === cartItem.productId);

    if(itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
      let snackBarRef = this.snackBar.open(`${cartItem.name} was removed from cart.`, 'Dismiss', {duration: 2500});
    }
  }

}
