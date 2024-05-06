import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TabbedInterfaceService } from '../services/tsbs.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideCalcComponent } from './side-calc/side-calc.component';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { isPlatformBrowser } from '@angular/common';
import { DialogService } from '../services/dialog.service';
import { MainScreenService } from '../services/main-screen.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginComponent,FormsModule,ReactiveFormsModule,HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,SideCalcComponent,WarehouseComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
 @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    // Cancel the event
    const numberOfTabs = this.tabbedInterfaceService.tabs;
    this.mainScreenService.saveTablePositions(this.mainScreenService.tables,this.user.id,numberOfTabs.length);
    $event.returnValue = 'Are you sure you want to leave?';
  }

  title = 'megahard';
  opened: boolean =false;
  user!: User;
  showWarehouse = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(private router: Router
    ,public tabbedInterfaceService: TabbedInterfaceService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private dialogService:DialogService,
  private mainScreenService :MainScreenService) {

    this.tabbedInterfaceService.drawerOpen$.subscribe((value) => {
      this.opened = value;

    });

    this.tabbedInterfaceService.drawerOpenWarehouse$.subscribe((value) => {
      this.showWarehouse = value;

    });

  }
  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.authService.setToken(token);
      } else {
        this.router.navigate(['/login']);
      }
    }


    const storedUser = this.authService.getUser();
    this.user = storedUser ? JSON.parse(storedUser) : { id: 0 };
  }
  logout() {
    // Call the logout service method
    this.authService.logout();
    // Update UI or redirect after logout
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
