import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../app/dialogs/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(title: string, message: string,buttonOne:string,buttonTwo:string,width:string, height: string ): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
        buttonOne:buttonOne,
        buttonTwo:buttonTwo
      },
      width: width, // Set the width
      height: height, // Set the height
    });
  }
}
