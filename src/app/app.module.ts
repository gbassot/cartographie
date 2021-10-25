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
import { EditorComponent } from './editor/editor.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    CarteComponent,
    ServerComponent,
    LinkComponent,
    ScenarioComponent,
    StepComponent,
    EditorComponent
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
