import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private baseUrl = 'https://api.exchangerate.host/latest';

  constructor(private http: HttpClient) {}

  getRates(base: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?base=${base}`);
  }
}
