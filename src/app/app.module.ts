import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarteComponent } from './carte/carte.component';
import { ServerComponent } from './server/server.component';
import { LinkComponent } from './link/link.component';
import { StoreModule } from '@ngrx/store';
import { serverReducer } from './stores/server/server.reducer';
import { scenarioReducer } from './stores/scenario/scenario.reducer';

@NgModule({
  declarations: [
    AppComponent,
    CarteComponent,
    ServerComponent,
    LinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ servers: serverReducer, scenarios: scenarioReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
