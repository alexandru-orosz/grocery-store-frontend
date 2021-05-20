import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: string;
  searchMode: boolean;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode && this.route.snapshot.paramMap.get('keyword') != "") {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');
    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = this.route.snapshot.paramMap.get('id');

      this.productService.getProductList(this.currentCategoryId).subscribe(
        data => {
          this.products = data;
        }
      );
    }
    else {
      //display all products
      this.productService.getAllProducts().subscribe(
        data => {
          this.products = data;
        }
      );
    }
  }

  addToCart(product: Product){
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem, true);
  }

}
