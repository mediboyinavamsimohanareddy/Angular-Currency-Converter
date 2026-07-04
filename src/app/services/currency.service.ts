import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Currency, FrankfurterCurrenciesResponse, FrankfurterRatesResponse } from '../models/currency.model';
import { getCountryCode, getCurrencySymbol } from '../data/currency-metadata';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly API_BASE = 'https://api.frankfurter.dev/v2';
  private cachedCurrencies: Currency[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Fetches list of all active currencies
   */
  getCurrencies(): Observable<Currency[]> {
    if (this.cachedCurrencies.length > 0) {
      return of(this.cachedCurrencies);
    }

    return this.http.get<FrankfurterCurrenciesResponse>(`${this.API_BASE}/currencies`).pipe(
      map((response) => {
        const list: Currency[] = [];
        for (const code of Object.keys(response)) {
          list.push({
            code,
            name: response[code],
            symbol: getCurrencySymbol(code),
            countryCode: getCountryCode(code)
          });
        }
        // Sort alphabetically by currency code
        return list.sort((a, b) => a.code.localeCompare(b.code));
      }),
      tap((list) => {
        this.cachedCurrencies = list;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches exchange rate for a single pair
   * Returns exchange rate and the date of rate
   */
  getRate(from: string, to: string): Observable<{ rate: number; date: string }> {
    // If base and target are the same, rate is 1
    if (from === to) {
      return of({ rate: 1, date: new Date().toISOString().split('T')[0] });
    }

    return this.http.get<FrankfurterRatesResponse>(`${this.API_BASE}/rate/${from}/${to}`).pipe(
      map((response) => {
        const rate = response.rates[to];
        if (!rate) {
          throw new Error(`Could not find exchange rate for target currency ${to}`);
        }
        return {
          rate,
          date: response.date
        };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Helper to handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred while contacting the exchange rates server.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 404) {
        errorMessage = 'Requested currency rates could not be found. The currency code might be unsupported.';
      } else if (error.status >= 500) {
        errorMessage = 'The exchange rate service is currently experiencing issues. Please try again later.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
