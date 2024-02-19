// warehouse.component.ts
import { Component } from '@angular/core';
import { Item } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule
  ],
})
export class WarehouseComponent {
  newItem: Item = { name: '', value: 0, quantity: 0 ,category:''};
  searchTerm: string = '';
  items: Item[] = [];
  displayedItems: Item[][] = [];
  selectedItems: Set<Item> = new Set<Item>();

  addItem() {
    this.items.push({ ...this.newItem });
    this.displayItems();
    this.clearInputs();
  }

  searchItems() {
    this.displayedItems = this.items
      .filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .map(item => [item]);
  }

// warehouse.component.ts

// ... (previous code)

displayItems() {
  const itemsPerColumn = 10;
  const totalItems = this.items.length;
  const totalColumns = Math.ceil(totalItems / itemsPerColumn);

  this.displayedItems = [];

  for (let i = 0; i < itemsPerColumn; i++) {
    const column = [];
    for (let j = 0; j < totalColumns; j++) {
      const index = i + j * itemsPerColumn;
      if (index < totalItems) {
        column.push(this.items[index]);
      }
    }
    this.displayedItems.push(column);
  }
}


  clearInputs() {
    this.newItem = { name: '', value: 0, quantity: 0 ,category:''};
  }

  toggleItemSelection(item: Item) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  deleteSelectedItems() {
    this.items = this.items.filter(item => !this.selectedItems.has(item));
    this.displayItems();
  }
}
