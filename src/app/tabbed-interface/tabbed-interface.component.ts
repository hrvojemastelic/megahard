import { AfterViewInit, Component, Injector, Input, OnInit, Type, ViewChild } from '@angular/core';
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
import { DialogService } from '../../services/dialog.service';
import { User } from '../../models/user.model';

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

export class TabbedInterfaceComponent  implements OnInit {
  openDrawer :boolean = false;
  openDrawerWarehouse :boolean = false;
  user!:User ;
  title : string = 'WhiteLion';
  constructor(
    public tabbedInterfaceService: TabbedInterfaceService,
    public injector: Injector,
    private router: Router ,
    private authService: AuthService,
    private dialogService: DialogService,
  ) {
    this.tabbedInterfaceService.drawerOpen$.subscribe((value) => {
      this.openDrawer = value;

    });
    this.tabbedInterfaceService.drawerOpenWarehouse$.subscribe((value) => {
      this.openDrawer = value;

    });
  }
  ngOnInit(): void {
    const storedUser = this.authService.getUser();
    this.user = storedUser ? JSON.parse(storedUser) : { id: 0 };
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
      this.openDrawerWarehouse = true;
      this.tabbedInterfaceService.openDrawerWarehouse();
  }

  logout()
  {
    this.dialogService.openDialog('Odjavi se', 'Sigurno se želite odjaviti?','Ne','Da','400px', '175px').afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('User clicked Yes');
        this.authService.logout();
        // Handle Yes button click
      } else {
        console.log('User clicked No');
        // Handle No button click
      }
    });
  }

  register()
  {
    this.router.navigate(['/register']);

  }

  openDeleleteDialog(tab: { label: string; content: Type<any> })
{
  this.dialogService.openDialog('Izbriši prostoriju', 'Sigurno želite izbrisati prostoriju?','Ne','Da','400px', '175px').afterClosed().subscribe((result: any) => {
    if (result) {
      console.log('User clicked Yes');
      this.removeTab(tab);
      // Handle Yes button click
    } else {
      console.log('User clicked No');
      // Handle No button click
    }
  });
}

}
