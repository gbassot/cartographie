import { Component, Inject } from '@angular/core'
import { Scenario } from '../models/documentation.model'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormGroup } from '@angular/forms'

export interface DialogScenarioEditData {
  scenario: Scenario;
  form: FormGroup;
}

@Component({
  selector: 'dialog-scenario-edit',
  templateUrl: 'dialog-scenario-edit.component.html'
})
export class DialogScenarioEditComponent {
  constructor (
    public dialogRef: MatDialogRef<DialogScenarioEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogScenarioEditData) {}

  save (): void {
    this.dialogRef.close({ scenario: this.data.scenario, form: this.data.form })
  }

  delete (): void {
    this.dialogRef.close({ scenario: this.data.scenario, delete: true })
  }
}
