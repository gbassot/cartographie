import { Component, Inject } from '@angular/core'
import { Endpoint } from '../models/documentation.model'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormGroup } from '@angular/forms'

export interface DialogEndpointEditData {
  endpoint: Endpoint;
  form: FormGroup;
}

@Component({
  selector: 'dialog-endpoint-edit',
  templateUrl: 'dialog-endpoint-edit.component.html'
})
export class DialogEndpointEditComponent {
  constructor (
    public dialogRef: MatDialogRef<DialogEndpointEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogEndpointEditData) {}

  save (): void {
    this.dialogRef.close({ endpoint: this.data.endpoint, form: this.data.form })
  }

  delete (): void {
    this.dialogRef.close({ endpoint: this.data.endpoint, delete: true })
  }
}
