// warehouse.component.ts
import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';

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
    MatCheckboxModule,
    MatGridListModule
  ],
})
export class WarehouseComponent  implements OnInit {
  newItem: Item = { name: '', value: 0, quantity: 0 ,category:''};
  searchTerm: string = '';
  items: Item[] = [];
  originalItems: Item[] = [];
  selectedItems: Set<Item> = new Set<Item>();


  constructor() {
    // Initialize the originalItems with a copy of the initial items array
    this.originalItems = [...this.items];
  }
  ngOnInit(): void {
    this.originalItems = [...this.items];

  }

  
  addItem() {
  // Add the new item to the items array
  this.items.push({ ...this.newItem });

  // Update the originalItems array to reflect the latest state
  this.originalItems = [...this.items];

  // Clear the inputs
  this.clearInputs();
  }

  searchItems() {
    if (this.searchTerm.trim() === '') {
      // If the search term is empty, reset the items array to the original state
      this.items = [...this.originalItems];
      this.clearInputs();
      return;
    }

    // Convert the search term to lowercase for case-insensitive search
    const searchTermLowerCase = this.searchTerm.toLowerCase();

    // Filter items based on the search term
    this.items = this.originalItems.filter((item) =>
      item.name.toLowerCase().includes(searchTermLowerCase)
    );
  }

  resetSearch() {
    this.searchTerm = '';
    // Reset the items array to the original state
    this.items = [...this.originalItems];
    this.clearInputs();
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
    this.originalItems = this.originalItems.filter(item => !this.selectedItems.has(item));
  }
}
