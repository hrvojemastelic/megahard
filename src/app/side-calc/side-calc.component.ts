import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Observable, Subject, map, startWith, takeUntil, timer } from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormField } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ItemWarehouse } from '../../models/item-warehouse.model';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WarehouseService } from '../../services/warehouse.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-side-calc',
  templateUrl: './side-calc.component.html',
  styleUrls: ['./side-calc.component.css'],
  standalone: true,
  imports: [CommonModule, MatSelectModule,
    NgxMatSelectSearchModule,ReactiveFormsModule,MatInput,MatInputModule,
    FormsModule,
    MatGridListModule,    
    MatButtonModule,
    MatIcon
  ]
})
export class SideCalcComponent implements OnInit {
  searchTerm: string = '';
  items : ItemWarehouse[] = [];
  originalItems  : ItemWarehouse[] = [];
  toPayList  : ItemWarehouse[] = [];
  selectedItem: any;
  newItem: ItemWarehouse = { id:0,name: '', value: 0, quantity: 0 ,category:''};
  totalValue: number = 0;
  totalValueDisplay: string='';
  user : User={ id: 0 };
  private ngUnsubscribe = new Subject<void>();
  constructor(private configService: ConfigService, private http: HttpClient,private warehouseService: WarehouseService,private authService:AuthService)
  {

   
  }
  ngOnInit(): void {
  this.authService.getUserObservable()
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe((user) => {
    this.user = user;
    if (user) {
      const storedUser = this.authService.getUser();
    this.user = storedUser ? JSON.parse(storedUser) : { id: 0 }; 
    this.getWarehouseList();
      return true; // User is authenticated, allow access
    } else {
      // User is not authenticated, redirect to login page
      return false;
    }
  });
  }

  getWarehouseList()
  {
    this.warehouseService.getWarehouseList(this.user.id)
    .subscribe(
      (response) => {
        // Handle the response from the backend, if needed
        if(response['items'])
        {
          this.items = response['items'] as ItemWarehouse[];
          this.originalItems = [...this.items];
          console.log('Insert successful', response);
        }

        // Clear the newAddedItems array after successful insert
      },
      (error) => {
        // Handle any errors that occurred during the HTTP request
        console.error('Error inserting data', error);
      }
    );
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
    this.newItem = { id:0,name: '', value: 0, quantity: 0, category: '' };
  }


onMouseEnter(item: ItemWarehouse) {
  this.selectedItem = item;
}

addToToPayList(item: ItemWarehouse) {
  // Check if the item with the same ID already exists in the toPayList
  const isItemAlreadyAdded = this.toPayList.some((payListItem) => payListItem.id === item.id);

  if (!isItemAlreadyAdded) {
    // If the item is not already in the toPayList, add it
    this.toPayList.push(item);
    this.calculateTotalValue();
  } else {
    // If the item is already in the toPayList, handle it accordingly (e.g., show a message)
    console.log('Item with ID', item.id, 'is already in the toPayList');
    // You can add further logic or UI feedback here
  }
}


calculateTotalValue() {
  try {
    this.totalValue = this.toPayList.reduce((total, item) => total + parseFloat(item.value.toString()), 0);

    // Check if this.totalValue is a number before using toFixed
    if (typeof this.totalValue === 'number' && !isNaN(this.totalValue)) {
      this.totalValueDisplay = this.totalValue.toFixed(2);
    } else {
      // Handle the case where this.totalValue is not a valid number
      console.error("Error: this.totalValue is not a valid number after reduce:", this.totalValue);
      this.totalValueDisplay = ''; // or provide a default value
    }
  } catch (error) {
    // Log the error for further investigation
    console.error("Error in calculateTotalValue:", error);
  }
  console.log(`Total: ${this.totalValue} €`);

}

incrementQuantity(item: ItemWarehouse) {
  item.quantity += 1;
  this.totalValue += item.value; 
  this.calculateTotalValue() // Add the value of the item to the total
}

decrementQuantity(item: ItemWarehouse) {
  if (item.quantity > 1) {
    item.quantity -= 1;
    this.totalValue -= item.value;  
    this.calculateTotalValue()// Subtract the value of the item from the total
  }
}

deleteItem(index: number) {
  this.toPayList.splice(index, 1);
  this.calculateTotalValue(); // Recalculate total value after the change
}
ngOnDestroy(): void {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}
}
