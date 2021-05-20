import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { Category } from '../common/category';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) { }

  getProduct(productId: string): Observable<Product> {
    const productUrl = `${this.apiServerUrl}/product/find/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getAllProducts() {
    const searchUrl = `${this.apiServerUrl}/product/all`;
    return this.getProducts(searchUrl);
  }

  getProductList(categoryId: string): Observable<Product[]> {
    const searchUrl = `${this.apiServerUrl}/product/category/${categoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(keyword: string) {
    const searchUrl = `${this.apiServerUrl}/product/search/${keyword}`;
    return this.getProducts(searchUrl);
  }

  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${searchUrl}`);
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.apiServerUrl}/category/all`);
  }
  
}
