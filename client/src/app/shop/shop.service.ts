import { IProduct } from './../shared/Models/product';
import { ShopParams } from './../shared/Models/shopParams';
import { IBrand } from '../shared/Models/brand';
import { IType } from '../shared/Models/productType';
import { IPagination, Pagination } from './../shared/Models/pagination';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();

  constructor(private http: HttpClient) {}

  getProducts(useCache: boolean): Observable<IPagination> {
    if (!useCache) {
      this.products = [];
    }

    if (this.products.length > 0 && useCache) {
      const pagesReceived = Math.ceil(
        this.products.length / this.shopParams.pageSize
      );

      if (this.shopParams.pageNumber <= pagesReceived) {
        this.pagination.data = this.products.slice(
          (this.shopParams.pageNumber - 1) * this.shopParams.pageSize,
          this.shopParams.pageNumber * this.shopParams.pageSize
        );

        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams.brandId !== 0) {
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId !== 0) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http
      .get<IPagination>(this.baseUrl + 'products', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.products = [...this.products, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    const product = this.products.find((p) => p.id === id);

    if (product) {
      return of(product);
    }

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands(): Observable<IType[]> {
    if (this.brands.length > 0) {
      return of(this.brands);
    }

    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map((response) => {
        this.brands = response;
        return response;
      })
    );
  }

  getTypes(): Observable<IBrand[]> {
    if (this.types.length > 0) {
      return of(this.types);
    }

    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map((response) => {
        this.types = response;
        return response;
      })
    );
  }
}
