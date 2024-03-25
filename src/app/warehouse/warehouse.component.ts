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
import { MatSelectModule } from '@angular/material/select';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
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
    MatSelectModule
  ],
})
export class WarehouseComponent  implements OnInit {
  newItem: ItemWarehouse = {id:0, name: '', value: 0, quantity: 0 ,category:0,qToPay:1};
  searchTerm: string = '';
  items: ItemWarehouse[] = [];
  originalItems: ItemWarehouse[] = [];
  selectedItems: Set<ItemWarehouse> = new Set<ItemWarehouse>();
  user:User={ id: 0 };
  addCategoryValue!: Category ;
  searchCategoryValue!: number ;
  searchCategory: Category[] = [{ name:'Topli napitci',id:1},{name:'Bezalkoholna pića',id:2},{name:'Alkoholna pića',id:3},{name:'Miješana alk. pića',id:4},{name:'Pivo',id:5},{name:'Točeno pivo',id:6}];
  closeWarehouseDrawer : boolean=false;
  private originalItemsSubscription: Subscription;


  constructor(private warehouseService:WarehouseService,
    private authService: AuthService,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router,
    private sideCalcService: SideCalcService,
    private tabbedInterfaceService:TabbedInterfaceService) {
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
      this.dialogService.openDialog('Izbriši proizvod', 'Sigurno želite izbrisati odabrane proizvode?','Ne','Da','300px', '150px').afterClosed().subscribe((result: any) => {
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
}
