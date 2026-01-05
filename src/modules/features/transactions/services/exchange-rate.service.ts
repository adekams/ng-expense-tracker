import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ExchangeRateResponse {
  success: boolean;
  base: string;
  date: string;
  quotes: Record<string, number>;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private baseUrl = 'https://api.exchangerate.host/live';

  constructor(private http: HttpClient) {}

  getRates(
    base: string,
    currencies?: string[]
  ): Observable<ExchangeRateResponse> {
    const apiKey = '3ba82d974810748210d032566ebacd6e';

    let params = new HttpParams()
      .set('access_key', apiKey)
      .set('source', base)
      .set('format', '1');

    if (currencies && currencies.length) {
      params = params.set('currencies', currencies.join(','));
    }

    console.log('Fetching exchange rates with params:', params.toString());

    return this.http.get<ExchangeRateResponse>(`${this.baseUrl}?${params}`);
  }
}
