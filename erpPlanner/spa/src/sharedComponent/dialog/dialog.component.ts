import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface DialogProps {
  title: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() dialogProps: DialogProps = {
    title: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  };
  @Output() onClose: EventEmitter<string> = new EventEmitter<string>();


  closeDialog() {
    const dialog = document.querySelector(`#${this.dialogProps.title}`) as HTMLDialogElement;
    dialog.showModal();
  }
}
