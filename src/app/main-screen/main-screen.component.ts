import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { TabbedInterfaceService } from '../../services/tsbs.service';
import { SideCalcComponent } from '../side-calc/side-calc.component';
import { Customer } from '../../models/customer.model';

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

export class MainScreenComponent{
  draggableElements: Customer[] = [];
  openDrawer :boolean = false;


  
  constructor(private cdr: ChangeDetectorRef,public tabbedInterfaceService: TabbedInterfaceService) { }



  addTable() {
    this.draggableElements.push({ id: this.draggableElements.length + 1, name: 'Table', toPay: 0, quantity: 0, category: 1, items: [], x: 0, y: 0 });
  }

  addGuest() {
    this.draggableElements.push({ id: this.draggableElements.length + 1, name: 'Guest', toPay: 0, quantity: 0, category: 2, items: [], x: 0, y: 0 });
  }
  toggleDrawer() {
    if(!this.openDrawer)
    {
      this.openDrawer = true;
      this.tabbedInterfaceService.openDrawer();
      console.log(this.draggableElements);
      
    }
    else
    {
      this.openDrawer = false;
      this.tabbedInterfaceService.closeDrawer();

    }
  }
   savePosition() {
    this.cdr.detectChanges(); // Trigger change detection to make sure ngModel is updated
    console.log(this.draggableElements);
  }

  onDragEnd(event: any, element: Customer) {
    element.x = event.source.getFreeDragPosition().x;
    element.y = event.source.getFreeDragPosition().y;
  }
}