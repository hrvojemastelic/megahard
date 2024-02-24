import { ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { TabbedInterfaceService } from '../../services/tsbs.service';
import { SideCalcComponent } from '../side-calc/side-calc.component';

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

export class MainScreenComponent {
  draggableElements: any[] = [];
  openDrawer :boolean = false;


  
  constructor(private cdr: ChangeDetectorRef,public tabbedInterfaceService: TabbedInterfaceService) { }
  addTable() {
    this.draggableElements.push({ label: 'Table', x: 0, y: 0 });
  }

  addGuest() {
    this.draggableElements.push({ label: 'Guest', x: 0, y: 0 });
  }
  toggleDrawer() {
    if(!this.openDrawer)
    {
      this.openDrawer = true;
      this.tabbedInterfaceService.openDrawer();
    }
    else
    {
      this.openDrawer = false;
      this.tabbedInterfaceService.closeDrawer();

    }
  }
}