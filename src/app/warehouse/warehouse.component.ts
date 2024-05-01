import { SideCalcComponent } from './../side-calc/side-calc.component';
// warehouse.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ItemWarehouse } from '../../models/item-warehouse.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import { WarehouseService } from '../../services/warehouse.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialog
} from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { Category } from '../../models/category.model';
import { Router } from '@angular/router';
import { SideCalcService } from '../../services/side-calc.service';
import { Subscription } from 'rxjs';
import { TabbedInterfaceService } from '../../services/tsbs.service';
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
    MatGridListModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  providers:[SideCalcComponent]
})
export class WarehouseComponent  implements OnInit {
  newItem: ItemWarehouse = {id:0, name: '', value: 0, quantity: 0 ,category:0,qToPay:1};
  searchTerm: string = '';
  items: ItemWarehouse[] = [];
  originalItems: ItemWarehouse[] = [];
  selectedItems: Set<ItemWarehouse> = new Set<ItemWarehouse>();
  user:User={ id: 0, username:'',token:'' };
  addCategoryValue!: Category ;
  searchCategoryValue!: number ;
  searchCategory: Category[] = [{ name:'Topli napitci',id:1},{name:'Bezalkoholna pića',id:2},{name:'Alkoholna pića',id:3},{name:'Miješana alk. pića',id:4},{name:'Pivo',id:5},{name:'Točeno pivo',id:6}];
  closeWarehouseDrawer : boolean=false;
  newItemForm!: FormGroup; // Declare a form group for your form fields
  private originalItemsSubscription: Subscription;
  numberOfCols:number= 10;
  alarm:number = 20;

  constructor(private warehouseService:WarehouseService,
    private authService: AuthService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router,
    private sideCalcService: SideCalcService,
    private tabbedInterfaceService:TabbedInterfaceService,
    private formBuilder: FormBuilder,
    private sideCalc:SideCalcComponent) {
    // Initialize the originalItems with a copy of the initial items array
    this.originalItemsSubscription = this.sideCalcService.originalItems$.subscribe(items => {
      this.originalItems = items;
      this.items = items

    });
    this.tabbedInterfaceService.drawerOpenWarehouse$.subscribe((value) => {
      this.closeWarehouseDrawer = value;

    });

  }
  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    this.user = storedUser ? JSON.parse(storedUser) : { id: 0 };
    this.newItemForm = this.formBuilder.group({
      name: ['', Validators.required], // Name field is required
      value: ['', [Validators.required, this.decimalValidator()]], // Value field is required
      quantity:['', [Validators.required, this.numberValidator()]], // Quantity field is required
      category: ['', Validators.required] // Category field is required
    });

  }



  addItem() {
    if (this.newItemForm.valid) {
  // Add the new item to the items array list that is showing data from database
  this.newItem = this.newItemForm.value as ItemWarehouse
  this.items.push({ ...this.newItem });
  //Items that will be save
  // Update the originalItems array to reflect the latest state
  this.originalItems = [...this.items];

  // Clear the inputs
  this.clearInputs();
  this.insert(false);
  this.newItemForm.reset();

    }
    else
    {

    }

  }

  searchItems() {
    if (this.searchTerm.trim() === '') {
      // If the search term is empty, reset the items array to the original state
      this.items = [...this.originalItems];
      this.filterByCategory();
      this.clearInputs();
      return;
    }

    // Convert the search term to lowercase for case-insensitive search
    const searchTermLowerCase = this.searchTerm.toLowerCase();

    // Filter items based on the search term
    this.items = this.originalItems.filter((item) =>
      item.name.toLowerCase().includes(searchTermLowerCase)
    );

    this.filterByCategory();
  }

  resetSearch() {
    this.searchTerm = '';
    // Reset the items array to the original state
    this.items = [...this.originalItems];
    this.clearInputs();
  }

  clearInputs() {
     this.newItem = { id:0,name: '', value: 0, quantity: 0, category: 0,qToPay:1 };
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
    this.insert(true);
  }

  insert(isDelete :boolean)
  {
    //TODO ADD ITEMS FROM LIST CHECK ORIGINAL LIST AND ITEM LIST IF EVERYTHING IS OK
    const id = this.user.id;
    if(isDelete && id !== undefined && id !== null)
    {
      this.warehouseService.insert(this.items,id)
      .subscribe(
        (response) => {
          this.warehouseService.emitInsertComplete(true);
          // Handle the response from the backend, if needed
          console.log('Insert successful', response);


        },
        (error) => {
          // Handle any errors that occurred during the HTTP request
          console.error('Error inserting data', error);
        }
      );
    }
    if(this.items.length > 0 && id !== undefined && id !== null)
    {
      this.warehouseService.insert(this.items,id)
      .subscribe(
        (response) => {
          // Handle the response from the backend, if needed
          console.log('Insert successful', response);
          this.warehouseService.emitInsertComplete(true);

        },
        (error) => {
          // Handle any errors that occurred during the HTTP request
          console.error('Error inserting data', error);
        }
      );
    }
  }

  openYesNoDialog(): void {
    if(this.selectedItems !== null && this.selectedItems !== undefined && this.selectedItems.size > 0)
    {
      this.dialogService.openDialog('Izbriši proizvod', 'Sigurno želite izbrisati odabrane proizvode?','Ne','Da','400px', '175px').afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('User clicked Yes');
        this.deleteSelectedItems();
        // Handle Yes button click
      } else {
        console.log('User clicked No');
        // Handle No button click
      }
    });
  }
  }

  filterByCategory() {
    console.log('filter category');

    if (this.searchCategoryValue) {
      // Filter items based on the selected category
      this.items = this.originalItems.filter((item) => item.category === this.searchCategoryValue);
    }
  }

  onCategoryChange() {
    this.searchItems(); // Call searchItems() when the category select changes
  }

  back()
  {
      this.closeWarehouseDrawer = false;
      this.tabbedInterfaceService.closeDrawerWarehouse();
  }

    // Custom validator function for decimal validation
    decimalValidator() {
      return (control: FormControl) => {
        const value = control.value;
        if (value === null || value === '') {
          // If the value is empty, validation fails
          return null;
        }
        // Regular expression to match full numbers or decimals with up to two decimal places
        const decimalRegex = /^\d+(\.\d{1,2})?$/;
        // Test the value against the regex pattern
        return decimalRegex.test(value) ? null : { invalidDecimal: true };
      };
    }

      // Custom validator function for number validation
  numberValidator() {
    return (control: FormControl) => {
      const value = control.value;
      if (value === null || value === '') {
        // If the value is empty, validation fails
        return { invalidNumber: true };
      }
      // Regular expression to match full numbers (no decimal places)
      const numberRegex = /^[0-9]*$/;
      // Test the value against the regex pattern
      return numberRegex.test(value) ? null : { invalidNumber: true };
    };
  }

  openSaveDialog(): void {

      this.dialogService.openDialog('Spremi proizvode', 'Sigurno želite spremiti promjene na proizvodima?','Ne','Da','400px', '175px').afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('User clicked Yes');
        this.insert(false);
        // Handle Yes button click
      } else {
        console.log('User clicked No');
        // Handle No button click
      }
    });
  }
}
