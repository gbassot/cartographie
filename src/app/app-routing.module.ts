import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CarteComponent } from './carte/carte.component'

const routes: Routes = [
  { path: 'carte', component: CarteComponent },
  { path: 'carte/:scenario', component: CarteComponent },
  { path: 'carte/:scenario/:step', component: CarteComponent },
  { path: '**', redirectTo: 'carte' }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
