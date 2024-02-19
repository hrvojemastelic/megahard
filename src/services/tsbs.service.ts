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
    this.drawerOpen$.emit(true);

    
  }

  closeDrawer() {
    console.log("close");
    this.drawerOpen$.emit(false);
  }

  createTabbedInterfaceComponentInstance() {
    return this.createComponentInstance(TabbedInterfaceComponent);
  }
}
