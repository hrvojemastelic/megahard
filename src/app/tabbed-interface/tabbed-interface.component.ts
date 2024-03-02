import { AfterViewInit, Component, Injector, Input, Type, ViewChild } from '@angular/core';
import { MainScreenComponent } from '../main-screen/main-screen.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { TabbedInterfaceService } from '../../services/tsbs.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterUserComponent } from '../register-user/register-user.component';

export interface Tab {
  label: string;
  content: Type<any>; // Ensure that 'content' is of type 'Type<any>'
}

@Component({
  selector: 'app-tabbed-interface',
  standalone: true,
  imports: [MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,MainScreenComponent,CommonModule,MatIconModule,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    RegisterUserComponent
    
  ],
  templateUrl: './tabbed-interface.component.html',
  styleUrl: './tabbed-interface.component.css'
})

export class TabbedInterfaceComponent  {
  openDrawer :boolean = false;
  constructor(
    public tabbedInterfaceService: TabbedInterfaceService,
    public injector: Injector,
    private router: Router ,
    private authService: AuthService
  ) {

  }
  addNewTab() {
    const label = 'Prostorija ' + this.tabbedInterfaceService.tabs.length;
    const mainScreenInstance = this.tabbedInterfaceService.createComponentInstance(MainScreenComponent);
    
    // You can pass inputs to your component if needed
    // mainScreenInstance.instance.someInput = someValue;

    this.tabbedInterfaceService.addTab(label, mainScreenInstance.componentType);
  }

  removeTab(tab: { label: string; content: Type<any> }) {
    const index = this.tabbedInterfaceService.tabs.indexOf(tab);
    if (index !== -1) {
      this.tabbedInterfaceService.tabs.splice(index, 1);
    }
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

  openWarehouse()
  {
    this.router.navigate(['/warehouse']);
  }

  logout()
  {
    this.authService.logout();
  }

  register()
  {
    this.router.navigate(['/register']);

  }
}
