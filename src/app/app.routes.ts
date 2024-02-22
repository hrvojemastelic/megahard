import { Routes } from '@angular/router';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { LoginComponent } from './login/login.component';
import { TabbedInterfaceComponent } from './tabbed-interface/tabbed-interface.component';
import { WarehouseComponent } from './warehouse/warehouse.component';

export const routes: Routes = [
    
    { path: 'login', component: LoginComponent },
    { path: 'tabs-interface', component: TabbedInterfaceComponent },
    { path: 'main-screen', component: MainScreenComponent },
    { path: 'warehouse', component: WarehouseComponent },
];
