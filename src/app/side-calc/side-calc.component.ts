import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
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
import { SideCalcService } from '../../services/side-calc.service';
import { Customer } from '../../models/customer.model';
import { WarehouseComponent } from '../warehouse/warehouse.component';
import { DialogService } from '../../services/dialog.service';

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
  newItem: ItemWarehouse = { id:0,name: '', value: 0, quantity: 0 ,category:0,qToPay:1};
  totalValue: number = 0;
  totalValueDisplay: string='';
  user : User={ id: 0 ,username:'',token:''};
  private ngUnsubscribe = new Subject<void>();
  customerData!: Customer;
  customerName : string = '';



  constructor(    private dialogService: DialogService,
    private sideCalcService:SideCalcService,private configService: ConfigService, private http: HttpClient,private warehouseService: WarehouseService,private authService:AuthService)
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

  this.sideCalcService.customerData$.subscribe(updatedData => {
    // Handle the updated data here
    this.customerData = updatedData;

    if(this.customerData)
    {
      this.customerName = this.customerData.name;
      this.calculateTotalValue();
    }
  });

  this.warehouseService.insertComplete$.subscribe(inserted => {
    if (inserted) {
      // Call the getWarehouseList method here this is called after change in warehouse
      this.getWarehouseList();
    }
  });
  }

  handleEmit(insert:boolean)
  {
    this.getWarehouseList();

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
          this.sideCalcService.updateOriginalItems(this.originalItems);
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
    this.newItem = { id:0,name: '', value: 0, quantity: 0, category: 0 ,qToPay:1};
  }


onMouseEnter(item: ItemWarehouse) {
  this.selectedItem = item;
}

addToToPayList(item: ItemWarehouse) {
  // Check if the item with the same ID already exists in the toPayList
  console.log(item);
  if(item.quantity > 0)
    {
      if(this.customerData)
        {
        const isItemAlreadyAdded = this.customerData.items.some((payListItem) => payListItem.id === item.id);
          // Find the index of the corresponding item in the originalItems list based on its ID
          const originalItemIndex = this.originalItems.findIndex(originalItem => originalItem.id === item.id);

          // If the original item is found, decrement its quantity
          if (originalItemIndex !== -1) {
            this.originalItems[originalItemIndex].quantity -= 1;
            this.sideCalcService.updateOriginalItems(this.originalItems);
            this.warehouseService.insert(this.originalItems,this.user.id)
            .subscribe(
              (response) => {
                // Handle the response from the backend, if needed
                if(response['items'])
                {
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


        if (!isItemAlreadyAdded) {
          // Create a deep copy of the item to ensure it's a new instance
          const newItem = { ...item };
          this.toPayList.push(newItem);
          this.customerData.items.push(newItem);
          this.calculateTotalValue();


        } else {
          // If the item is already in the toPayList, handle it accordingly (e.g., show a message)
          console.log('Item with ID', item.id, 'is already in the toPayList');
          // You can add further logic or UI feedback here
        }
      }
    }
    else
    {
      this.dialogService.openDialog('Skladište', 'Stanje na skladištu nije dovoljno.',null,'Ok','400px', '175px').afterClosed().subscribe((result: any) => {
        if (result) {
          // Handle Yes button click
        } else {
          // Handle No button click
        }
      });
    }

}


calculateTotalValue() {
  if(this.customerData)
  {

  try {
    this.totalValue = this.customerData.items.reduce((total, item) => {
      const quantity = item.qToPay || 1; // Use qToPay if available, or default to 1
      return total + parseFloat(item.value.toString()) * quantity;
    }, 0);
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
  this.customerData.toPay = this.totalValue;
  }
}

incrementQuantity(item: ItemWarehouse,index:number) {
      // Find the index of the corresponding item in the originalItems list based on its ID
  console.log(this.originalItems[index]);
  const originalItemIndex = this.originalItems.findIndex(originalItem => originalItem.id === item.id);

  if(this.originalItems[originalItemIndex].quantity > 0)
  {
    this.customerData.items[index].qToPay = (item.qToPay || 0) + 1;
    // If the original item is found, decrement its quantity
    if (originalItemIndex !== -1) {
      this.originalItems[originalItemIndex].quantity -= 1;
      this.sideCalcService.updateOriginalItems(this.originalItems);
      this.warehouseService.insert(this.originalItems,this.user.id)
      .subscribe(
        (response) => {
          // Handle the response from the backend, if needed
          if(response['items'])
          {
            console.log('Insert successful', response);
          }

          // Clear the newAddedItems array after successful insert
        },
        (error) => {
          // Handle any errors that occurred during the HTTP request
          console.error('Error inserting data', error);
        }
      );

      console.log(this.originalItems,'koji sta');


    }

   this.calculateTotalValue();
  }
  else{
    this.dialogService.openDialog('Skladište', 'Stanje na skladištu nije dovoljno.',null,'Ok','400px', '175px').afterClosed().subscribe((result: any) => {
      if (result) {
        // Handle Yes button click
      } else {
        // Handle No button click
      }
    });
  }


}

decrementQuantity(item: ItemWarehouse,index:number) {
  if (item.qToPay > 1) {
    this.customerData.items[index].qToPay =  item.qToPay -= 1;
      // Find the index of the corresponding item in the originalItems list based on its ID
   const originalItemIndex = this.originalItems.findIndex(originalItem => originalItem.id === item.id);

   // If the original item is found, decrement its quantity
   if (originalItemIndex !== -1) {
     this.originalItems[originalItemIndex].quantity += 1;
     this.sideCalcService.updateOriginalItems(this.originalItems);
     this.warehouseService.insert(this.originalItems,this.user.id)
     .subscribe(
      (response) => {
        // Handle the response from the backend, if needed
        if(response['items'])
        {
          console.log('Insert successful', response);
        }

        // Clear the newAddedItems array after successful insert
      },
      (error) => {
        // Handle any errors that occurred during the HTTP request
        console.error('Error inserting data', error);
      }
    );

     console.log(this.originalItems,'koji sta');
   }
    this.calculateTotalValue();
  }
}

deleteItem(index: number) {

  this.dialogService.openDialog('Kalkulator', 'Sigurno želite izbrisati proizvod ?','Ne','Da','400px', '175px').afterClosed().subscribe((result: any) => {
    if (result) {
      // Handle Yes button click
       // Find the index of the corresponding item in the originalItems list based on its ID
  const originalItemIndex = this.originalItems.findIndex(originalItem => originalItem.id === this.toPayList[index].id);
  // If the original item is found, decrement its quantity
  if (originalItemIndex !== -1) {
    this.originalItems[originalItemIndex].quantity =  this.originalItems[originalItemIndex].quantity +  this.customerData.items[index].qToPay;
    this.sideCalcService.updateOriginalItems(this.originalItems);

  }
  this.toPayList.splice(index, 1);
  this.customerData.items[index].qToPay = 1;
  this.customerData.items.splice(index, 1);
  this.calculateTotalValue(); // Recalculate total value after the change
    } else {
      // Handle No button click
    }
  });

}
ngOnDestroy(): void {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}
}
