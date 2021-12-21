import { Component, Inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Endpoint, Scenario, Server, Step } from '../models/documentation.model'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { FormGroup } from '@angular/forms'

export interface DialogStepEditData {
  step: Step;
  servers$: Observable<Server[]>;
  scenarios$: Observable<Scenario[]>;
  form: FormGroup;
}

@Component({
  selector: 'dialog-step-edit',
  templateUrl: 'dialog-step-edit.component.html'
})
export class DialogStepEditComponent {
  public modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      // [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      // [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      // [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link'] // link and image, video
    ]
  };

  constructor (
    public dialogRef: MatDialogRef<DialogStepEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogStepEditData) {}

  save (): void {
    this.dialogRef.close({ step: this.data.step, form: this.data.form })
  }

  delete (): void {
    this.dialogRef.close({ step: this.data.step, delete: true })
  }

  isRequestOrResponse (): boolean {
    return !!['request', 'response'].find((v: String) => v === this.data.form.get('action').value)
  }

  possibleEndpoints (servers: Server[]): Endpoint[] {
    let selectedServer: Server = null
    if (this.data.form.get('action').value === 'request') {
      selectedServer = servers.find((server: Server) => server.key === this.data.form.get('target').value)
    }
    if (this.data.form.get('action').value === 'response') {
      selectedServer = servers.find((server: Server) => server.key === this.data.form.get('server').value)
    }
    if (selectedServer) {
      return selectedServer.endpoints
    }
    return []
  }
}
