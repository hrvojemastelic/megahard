import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'megahard';
  opened: boolean =false;
  user!: User;
  showWarehouse = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(private router: Router,public tabbedInterfaceService: TabbedInterfaceService,private authService: AuthService) {
    this.tabbedInterfaceService.drawerOpen$.subscribe((value) => {
      this.opened = value;

    });

    this.tabbedInterfaceService.drawerOpenWarehouse$.subscribe((value) => {
      this.showWarehouse = value;

    });

    this.authService.getUserObservable()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((user) => {
      this.user = user;

      if (user) {
        return true; // User is authenticated, allow access
      } else {
        // User is not authenticated, redirect to login page
        this.router.navigate(['/login']);
        return false;
      }
    });
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
