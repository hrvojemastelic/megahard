import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Observable, map, startWith } from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormField } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Item } from '../../models/item.model';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
export class SideCalcComponent {
  searchTerm: string = '';
  items : Item[] = [{category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
  {category:'piva',name:'žuja mala',value:2,quantity:120},
  {category:'piva',name:'žuja velika',value:3,quantity:150},
  {category:'piva',name:'lefe ',value:4,quantity:120},
  {category:'piva',name:'grif mali',value:2,quantity:120},
  {category:'piva',name:'grif veliki',value:3,quantity:120},
  {category:'piva',name:'setlla',value:2,quantity:120},
];
  originalItems  : Item[] = [];
  toPayList  : Item[] = [];
  selectedItem: any;
  newItem: Item = { name: '', value: 0, quantity: 0 ,category:''};
  totalValue: number = 0;


  constructor()
  {
    this.originalItems= this.items;
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


onMouseEnter(item: any) {
  this.selectedItem = item;
}

addToToPayList(item: any) {
  // Add logic to add the clicked item to the toPayList
  this.toPayList.push(item);
  this.calculateTotalValue();
}

calculateTotalValue() {
  this.totalValue = this.toPayList.reduce((total, item) => total + item.value, 0);
}

deleteItem()
{

}
}
