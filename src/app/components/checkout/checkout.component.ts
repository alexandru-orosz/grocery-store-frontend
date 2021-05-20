import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { GroceryStoreFormService } from 'src/app/services/grocery-store-form.service';
import { GroceryStoreValidators } from 'src/app/validators/grocery-store-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  invoiceTypes: string[] = ['PDF', 'TXT'];
  invoice: string = 'PDF';

  creditCardYears: number[]= [];
  creditCardMonths: number[] = []

  constructor(private formBuilder: FormBuilder,
              private groceryStoreFormService : GroceryStoreFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), GroceryStoreValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:  new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    });

    
    const startMonth: number = new Date().getMonth() + 1;

    this.groceryStoreFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    
    );

    this.groceryStoreFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

  }

  reviewCartDetails() {
    //subscribe to cart service for total quantity and total price

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  copyShippingAddressToBillingAddress(slideToggle: MatSlideToggleChange) {

    if(slideToggle.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit() {

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    let purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    purchase.order = order;
    purchase.orderItems = orderItems;
    purchase.invoice = this.invoice;

    /*
    console.log(purchase.customer);
    console.log(purchase.shippingAddress);
    console.log(purchase.billingAddress);
    console.log(purchase.order);
    console.log(purchase.orderItems);
    console.log(purchase.invoice);
    */

    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          let snackBarRef = this.snackBar.open(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`, 'Dismiss', {duration: 5000});

          snackBarRef.afterDismissed().subscribe(() => {
            this.resetCart()
          });
        },
        error: err => {
          this.snackBar.open(`There was an error: ${err.message}`, 'Dismiss', {duration: 2500});
        }
      }
    );

  }

  resetCart() {

    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");  
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.groceryStoreFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

}
