import { Injectable } from '@angular/core';
import { Dialog, DialogConfig, DialogModule } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  constructor(public dialog: Dialog) { }

  openDialog<T>(component: ComponentType<unknown>, config: DialogConfig, data: T, onClose: (returnData?: T) => void) {
    config.data = data;
    const dialogRef = this.dialog.open(component, config);

    dialogRef.closed.subscribe(onClose);

  }
}
