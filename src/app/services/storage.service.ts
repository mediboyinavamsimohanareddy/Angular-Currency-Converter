import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'apexrates_';
  private readonly KEY_AMOUNT = this.PREFIX + 'amount';
  private readonly KEY_FROM_CURRENCY = this.PREFIX + 'from';
  private readonly KEY_TO_CURRENCY = this.PREFIX + 'to';

  constructor() {}

  /**
   * Save last entered amount
   */
  saveAmount(amount: number): void {
    try {
      localStorage.setItem(this.KEY_AMOUNT, amount.toString());
    } catch (e) {
      console.error('Error saving amount to LocalStorage', e);
    }
  }

  /**
   * Get last entered amount, default to null if not stored or invalid
   */
  getAmount(): number | null {
    try {
      const stored = localStorage.getItem(this.KEY_AMOUNT);
      if (stored) {
        const val = parseFloat(stored);
        return isNaN(val) ? null : val;
      }
    } catch (e) {
      console.error('Error reading amount from LocalStorage', e);
    }
    return null;
  }

  /**
   * Save currency selection preferences
   */
  saveCurrencies(fromCode: string, toCode: string): void {
    try {
      localStorage.setItem(this.KEY_FROM_CURRENCY, fromCode);
      localStorage.setItem(this.KEY_TO_CURRENCY, toCode);
    } catch (e) {
      console.error('Error saving currencies to LocalStorage', e);
    }
  }

  /**
   * Get cached currency selections
   */
  getCurrencies(): { from: string | null; to: string | null } {
    try {
      return {
        from: localStorage.getItem(this.KEY_FROM_CURRENCY),
        to: localStorage.getItem(this.KEY_TO_CURRENCY)
      };
    } catch (e) {
      console.error('Error reading currencies from LocalStorage', e);
      return { from: null, to: null };
    }
  }
}
