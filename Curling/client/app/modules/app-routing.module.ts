import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlComponent } from '../components/gl.component';

const routes: Routes = [
    { path: '', redirectTo: 'Curling', pathMatch: 'full' },
    { path: 'Curling', component: GlComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
