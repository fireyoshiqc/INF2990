import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard.component';

import { GlComponent } from '../components/gl.component';
// TODO : Put the right paths
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch:'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'glcomp', component: GlComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
