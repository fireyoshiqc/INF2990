import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { GameComponent } from '../components/game.component';

// TODO : Put the right paths
const routes: Routes = [
    { path: '', redirectTo: 'waitingRoom', pathMatch: 'full' },
    { path: 'waitingRoom', component: WaitingRoomComponent },
    //TODO: Remove this path once the waiting rooms are fully functional
    { path: 'testGame', component: GameComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
