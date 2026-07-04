import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { StorageService } from '../../services/storage.service';
import { Currency, ConversionResult } from '../../models/currency.model';
import { CurrencyDropdownComponent } from '../currency-dropdown/currency-dropdown.component';
import { ResultCardComponent } from '../result-card/result-card.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyDropdownComponent,
    ResultCardComponent,
    LoaderComponent
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  currencies: Currency[] = [];
  fromCurrency: Currency | null = null;
  toCurrency: Currency | null = null;
  amount: number = 100;
  
  // Status states
  isLoading = false;
  isSwapping = false;
  errorMessage: string | null = null;
  
  // Result
  conversionResult: ConversionResult | null = null;

  constructor(
    private currencyService: CurrencyService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadCurrencies();
  }

  /**
   * Fetch all currencies and initialize settings
   */
  loadCurrencies(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.currencyService.getCurrencies().subscribe({
      next: (list) => {
        this.currencies = list;
        this.initializeSelections();
        this.isLoading = false;
        
        // Auto convert on load
        this.convert();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load currencies. Please check your network connection.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Set dropdown values from localStorage or fallback defaults
   */
  initializeSelections(): void {
    // Restore amount
    const savedAmount = this.storageService.getAmount();
    if (savedAmount !== null && savedAmount > 0) {
      this.amount = savedAmount;
    }

    // Restore selected currencies
    const { from, to } = this.storageService.getCurrencies();
    
    const defaultFrom = from ? this.currencies.find(c => c.code === from) : this.currencies.find(c => c.code === 'USD');
    const defaultTo = to ? this.currencies.find(c => c.code === to) : this.currencies.find(c => c.code === 'EUR');

    this.fromCurrency = defaultFrom || this.currencies[0] || null;
    // Make sure we select a different target currency if available
    this.toCurrency = defaultTo || this.currencies[1] || this.currencies[0] || null;
  }

  /**
   * Swap from and to currencies
   */
  swapCurrencies(): void {
    if (!this.fromCurrency || !this.toCurrency || this.isSwapping) return;

    this.isSwapping = true;
    
    // Perform the swap
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;

    // Cache updated selections
    this.storageService.saveCurrencies(this.fromCurrency.code, this.toCurrency.code);

    // Swap animation reset
    setTimeout(() => {
      this.isSwapping = false;
      this.convert();
    }, 400); // Duration matches animation in SCSS
  }

  /**
   * Handle dropdown changes
   */
  onFromCurrencyChange(currency: Currency): void {
    this.fromCurrency = currency;
    if (this.fromCurrency && this.toCurrency) {
      this.storageService.saveCurrencies(this.fromCurrency.code, this.toCurrency.code);
      this.convert();
    }
  }

  onToCurrencyChange(currency: Currency): void {
    this.toCurrency = currency;
    if (this.fromCurrency && this.toCurrency) {
      this.storageService.saveCurrencies(this.fromCurrency.code, this.toCurrency.code);
      this.convert();
    }
  }

  /**
   * Validate amount input
   */
  isValidAmount(): boolean {
    return this.amount !== null && this.amount !== undefined && this.amount > 0 && this.amount <= 999999999;
  }

  /**
   * Call service and convert the amount
   */
  convert(): void {
    if (!this.isValidAmount() || !this.fromCurrency || !this.toCurrency) {
      this.conversionResult = null;
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    // Save to local storage
    this.storageService.saveAmount(this.amount);

    const fromCode = this.fromCurrency.code;
    const toCode = this.toCurrency.code;

    this.currencyService.getRate(fromCode, toCode).subscribe({
      next: ({ rate, date }) => {
        const converted = this.amount * rate;
        const reverseRate = rate !== 0 ? 1 / rate : 0;
        
        this.conversionResult = {
          fromCurrency: this.fromCurrency!,
          toCurrency: this.toCurrency!,
          amount: this.amount,
          convertedAmount: converted,
          rate: rate,
          reverseRate: reverseRate,
          lastUpdated: date
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Conversion failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
