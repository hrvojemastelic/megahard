import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { TabbedInterfaceService } from '../../services/tsbs.service';
import { SideCalcComponent } from '../side-calc/side-calc.component';
import { Customer } from '../../models/customer.model';
import { SideCalcService } from '../../services/side-calc.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  templateUrl: './main-screen.component.html',
  imports: [CdkDrag,MatButtonModule,MatToolbarModule,
    CommonModule,
    FormsModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    SideCalcComponent
  ],
  styleUrls: ['./main-screen.component.css']
})

export class MainScreenComponent implements OnInit{
  draggableElements: Customer[] = [];
  openDrawer :boolean = false;
  selectedItems: Customer[] = [];
  completeCustomerList : Customer[] = [];

  constructor(private sideCalcService:SideCalcService,private dialogService: DialogService,private cdr: ChangeDetectorRef,public tabbedInterfaceService: TabbedInterfaceService)
   {
    this.tabbedInterfaceService.drawerOpen$.subscribe((value) => {
      this.openDrawer = value;

    });
    }

  ngOnInit(): void {

  }
  addTable() {
    this.draggableElements.push({ id: this.draggableElements.length + 1, name: 'Stol', toPay: 0, quantity: 0, category: 1, items: [], x: 0, y: 0 });
    this.completeCustomerList = this.draggableElements;
    console.log(this.completeCustomerList);
  }

  addGuest() {
    this.draggableElements.push({ id: this.draggableElements.length + 1, name: 'Gost', toPay: 0, quantity: 0, category: 2, items: [], x: 0, y: 0 });
    this.completeCustomerList = this.draggableElements;
    console.log(this.completeCustomerList);

  }
  toggleDrawer(customer:any) {
    this.sideCalcService.setCustomerData(customer);
    if(!this.openDrawer)
    {
      this.openDrawer = true;
      this.tabbedInterfaceService.openDrawer();
    }
    console.log(this.completeCustomerList);

  }
   savePosition() {
    this.cdr.detectChanges(); // Trigger change detection to make sure ngModel is updated
    console.log(this.draggableElements);
  }

  onDragEnd(event: any, element: Customer) {
    element.x = event.source.getFreeDragPosition().x;
    element.y = event.source.getFreeDragPosition().y;
  }

  ngOnDestroy(): void {

  }

    // Function to toggle selection of items
    toggleSelection(event: any, item: Customer) {
      if (event.target.checked) {
        this.selectedItems.push(item);
      } else {
        const index = this.selectedItems.indexOf(item);
        if (index !== -1) {
          this.selectedItems.splice(index, 1);
        }
      }
    }

      // Function to delete selected items
  deleteSelectedItems() {
    this.draggableElements = this.draggableElements.filter(item => !this.selectedItems.includes(item));
    this.selectedItems = [];
  }

  openYesNoDialog(): void {
    if(this.selectedItems !== null && this.selectedItems !== undefined && this.selectedItems.length > 0)
    {
  this.dialogService.openDialog('Izbriši objekt', 'Sigurno želite izbrisati odabrane objekte?','Ne','Da','400px', '175px').afterClosed().subscribe((result: any) => {
    if (result) {
      console.log('User clicked Yes');
      this.deleteSelectedItems();
    } else {
      console.log( result);
    }
  });
}

  }

  downloadListAsTextFile() {
    const listAsString = this.completeCustomerList
      .map(customer => JSON.stringify(customer))
      .join('\n\n'); // Add an empty line between each customer
    const blob = new Blob([listAsString], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer_list.txt');

    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  }
}
