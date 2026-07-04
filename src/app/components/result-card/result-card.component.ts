import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionResult } from '../../models/currency.model';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss']
})
export class ResultCardComponent {
  @Input() result: ConversionResult | null = null;
}
