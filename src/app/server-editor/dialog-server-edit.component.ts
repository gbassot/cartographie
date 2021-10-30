import { Component, Inject } from '@angular/core'
import { Server } from '../models/documentation.model'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormGroup } from '@angular/forms'

export interface DialogServerEditData {
  server: Server;
  form: FormGroup;
}

@Component({
  selector: 'dialog-server-edit',
  templateUrl: 'dialog-server-edit.component.html'
})
export class DialogServerEditComponent {
  technologies: string[] = ['angular', 'twig', 'symfony', 'sylius', 'api platform', 'php4', 'google']

  constructor (
    public dialogRef: MatDialogRef<DialogServerEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogServerEditData) {
    console.log(data)
  }

  save (): void {
    console.log(this.data)
    this.dialogRef.close({ server: this.data.server, form: this.data.form })
  }

  delete (): void {
    this.dialogRef.close({ server: this.data.server, delete: true })
  }
}
