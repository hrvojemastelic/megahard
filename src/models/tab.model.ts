import { Type } from "@angular/core";
import { MainScreenComponent } from "../app/main-screen/main-screen.component";

export interface Tab {
  label: string;
  content: Type<any>; // Ensure that 'content' is of type 'Type<any>'
  mainScreenComponentInstance?: MainScreenComponent; // Add this property
}
