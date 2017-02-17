import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartPageComponent } from '../components/startPage.component';
import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { GameComponent } from '../components/game.component';

// TODO : Put the right paths
const routes: Routes = [
    { path: '', redirectTo: 'startPage', pathMatch: 'full' },
    { path: 'startPage', component: StartPageComponent },
    { path: 'waitingRoom', component: WaitingRoomComponent },
    //TODO: Remove this path once the waiting rooms are fully functional
    { path: 'testGame', component: GameComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
