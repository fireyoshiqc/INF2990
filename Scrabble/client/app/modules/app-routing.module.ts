import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartPageComponent } from '../components/startPage.component';
import { GameComponent } from '../components/game.component';

const routes: Routes = [
    { path: '', redirectTo: 'startPage', pathMatch: 'full' },
    { path: 'startPage', component: StartPageComponent },
    { path: 'game', component: GameComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
