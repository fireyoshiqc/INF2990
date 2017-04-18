import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlComponent } from '../components/gl.component';

const routes: Routes = [
    { path: '', redirectTo: 'glcomp', pathMatch: 'full' },
    { path: 'glcomp', component: GlComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
