import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyLocatorComponent } from './property-locator/property-locator.component';

const routes: Routes = [
  {
    path: 'property',
    component: PropertyLocatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
