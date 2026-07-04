import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Currency } from '../../models/currency.model';

@Component({
  selector: 'app-currency-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-dropdown.component.html',
  styleUrls: ['./currency-dropdown.component.scss']
})
export class CurrencyDropdownComponent implements OnInit {
  @Input() currencies: Currency[] = [];
  @Input() selectedCurrency: Currency | null = null;
  @Input() placeholder = 'Search currency...';
  @Input() label = 'Select Currency';
  
  @Output() currencyChange = new EventEmitter<Currency>();

  isOpen = false;
  searchQuery = '';
  filteredCurrencies: Currency[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.filteredCurrencies = this.currencies;
  }

  ngOnChanges(): void {
    this.filterCurrencies();
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
      this.filteredCurrencies = this.currencies;
      // Focus the search input on the next event loop tick
      setTimeout(() => {
        const searchInput = this.elementRef.nativeElement.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 50);
    }
  }

  selectCurrency(currency: Currency): void {
    this.selectedCurrency = currency;
    this.currencyChange.emit(currency);
    this.isOpen = false;
    this.searchQuery = '';
  }

  filterCurrencies(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCurrencies = this.currencies;
      return;
    }
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCurrencies = this.currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query)
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
