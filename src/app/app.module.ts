import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CarteComponent } from './carte/carte.component'
import { ServerComponent } from './server/server.component'
import { LinkComponent } from './link/link.component'
import { StoreModule } from '@ngrx/store'
import { serverReducer } from './stores/server/server.reducer'
import { scenarioReducer } from './stores/scenario/scenario.reducer'
import { ScenarioComponent } from './scenario/scenario.component'
import { StepComponent } from './step/step.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { CdkAccordionModule } from '@angular/cdk/accordion'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatChipsModule } from '@angular/material/chips'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select'
import { DialogStepEditComponent } from './step/dialog-step-edit.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { ServerEditorComponent } from './server-editor/server-editor.component'
import { ScenarioEditorComponent } from './scenario-editor/scenario-editor.component'
import { MatInputModule } from '@angular/material/input'
import { DialogServerEditComponent } from './server-editor/dialog-server-edit.component'
import { EndpointComponent } from './endpoint/endpoint.component'
import { DialogEndpointEditComponent } from './endpoint/dialog-endpoint-edit.component'
import { DialogScenarioEditComponent } from './scenario-editor/dialog-scenario-edit.component'
import { Nl2BrPipeModule } from 'nl2br-pipe'

@NgModule({
  declarations: [
    AppComponent,
    CarteComponent,
    ServerComponent,
    LinkComponent,
    ScenarioComponent,
    StepComponent,
    DialogStepEditComponent,
    ServerEditorComponent,
    ScenarioEditorComponent,
    DialogServerEditComponent,
    DialogEndpointEditComponent,
    DialogScenarioEditComponent,
    EndpointComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ servers: serverReducer, scenarios: scenarioReducer }),
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    CdkAccordionModule,
    MatGridListModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    Nl2BrPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
