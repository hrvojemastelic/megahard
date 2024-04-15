// tabbed-interface.service.ts

import { Injectable, ComponentFactoryResolver, Injector, Type, EventEmitter, ComponentRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TabbedInterfaceComponent } from '../app/tabbed-interface/tabbed-interface.component';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class TabbedInterfaceService {

  tabs: {id:number, label: string; content: Type<any> }[] = [];
  drawerOpen$ = new EventEmitter<boolean>();
  drawerState : boolean = false;
  drawerOpenWarehouse$ = new EventEmitter<boolean>();
  drawerStateWarehouse : boolean = false;
  activeTabId: number | null = null;

  constructor(private configService: ConfigService,private http: HttpClient,private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {}
  private get backendUrl(): string {
    return this.configService.getBackendUrl();
  }


  addTab(id: number,label: string, component: Type<any>) {
    this.tabs.push({id, label, content: component });
  }

 createComponentInstance(component: Type<any>) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);

    // Provide an Injector instance when creating the component
    return factory.create(this.injector);
  }
  openDrawer() {
    console.log("open");
    this.drawerState = true;
    this.drawerOpen$.emit(true);


  }

  closeDrawer() {
    console.log("close");
    this.drawerState = false;
    this.drawerOpen$.emit(false);
  }
  getDrawerState()
  {
    return this.drawerState;
  }

  createTabbedInterfaceComponentInstance() {
    return this.createComponentInstance(TabbedInterfaceComponent);
  }

  openDrawerWarehouse() {
    console.log("open");
    this.drawerStateWarehouse = true;
    this.drawerOpenWarehouse$.emit(true);


  }

  closeDrawerWarehouse() {
    console.log("close");
    this.drawerStateWarehouse = false;
    this.drawerOpenWarehouse$.emit(false);
  }
  getDrawerStateWarehouse()
  {
    return this.drawerStateWarehouse;
  }

  setActiveTabId(activeTabId: number) {

    this.activeTabId = activeTabId;
  }

  getActiveTabId()
  {
    return this.activeTabId;
  }

  getTablesList(userId: number): Observable<any> {
    const credentials = {
      userId
    }
    // Adjust the endpoint and request type based on your backend implementation
    return this.http.post(`${this.backendUrl}/api/tables/getList`, credentials);
  }


}
