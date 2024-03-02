// warehouse.component.ts
import { Component, OnInit } from '@angular/core';
import { ItemWarehouse } from '../../models/item-warehouse.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import { WarehouseService } from '../../services/warehouse.service';
import { userInfo } from 'os';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

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
  newItem: ItemWarehouse = { name: '', value: 0, quantity: 0 ,category:''};
  searchTerm: string = '';
  items: ItemWarehouse[] = [];
  originalItems: ItemWarehouse[] = [];
  selectedItems: Set<ItemWarehouse> = new Set<ItemWarehouse>();
  user:User={ id: 0 };
  constructor(private warehouseService:WarehouseService,private authService: AuthService) {
    // Initialize the originalItems with a copy of the initial items array
    this.originalItems = [...this.items];
  }
  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    this.user = storedUser ? JSON.parse(storedUser) : { id: 0 }; 
    console.log(this.user);
    // Default value or appropriate default
    this.warehouseService.getWarehouseList(this.user.id)
    .subscribe(
      (response) => {
        // Handle the response from the backend, if needed
        this.items = response['items'] as ItemWarehouse[];
        this.originalItems = [...this.items];
        console.log('Insert successful', response);
        // Clear the newAddedItems array after successful insert
      },
      (error) => {
        // Handle any errors that occurred during the HTTP request
        console.error('Error inserting data', error);
      }
    );

  }

  getWarehouseList()
  {

  }

  
  addItem() {
  // Add the new item to the items array list that is showing data from database
  this.items.push({ ...this.newItem });
  //Items that will be save
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
    this.newItem = { name: '', value: 0, quantity: 0, category: '' };
  }
  toggleItemSelection(item: ItemWarehouse) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  deleteSelectedItems() {
    this.items = this.items.filter(item => !this.selectedItems.has(item));
    this.originalItems = this.originalItems.filter(item => !this.selectedItems.has(item));
    this.insert();
  }

  insert()
  {
    //TODO ADD ITEMS FROM LIST CHECK ORIGINAL LIST AND ITEM LIST IF EVERYTHING IS OK 
    console.log('insert');
    console.log(this.user);
    const id = this.user.id;
    console.log(id);
    if(this.items.length > 0 && id !== undefined && id !== null)
    this.warehouseService.insert(this.items,id)
    .subscribe(
      (response) => {
        // Handle the response from the backend, if needed
        console.log('Insert successful', response);
      },
      (error) => {
        // Handle any errors that occurred during the HTTP request
        console.error('Error inserting data', error);
      }
    );
  }
}
