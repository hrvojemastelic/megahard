// tabbed-interface.service.ts

import { Injectable, ComponentFactoryResolver, Injector, Type, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TabbedInterfaceComponent } from '../app/tabbed-interface/tabbed-interface.component';

@Injectable({
  providedIn: 'root',
})
export class TabbedInterfaceService {
  tabs: { label: string; content: Type<any> }[] = [];
  drawerOpen$ = new EventEmitter<boolean>();
  drawerState : boolean = false;
  drawerOpenWarehouse$ = new EventEmitter<boolean>();
  drawerStateWarehouse : boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {}

  addTab(label: string, component: Type<any>) {
    this.tabs.push({ label, content: component });
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
}
