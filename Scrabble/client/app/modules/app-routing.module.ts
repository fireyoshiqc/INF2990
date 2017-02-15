import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { AppComponent } from '../components/app.component';
import { GameComponent } from '../components/game.component';

// TODO : Put the right paths
const routes: Routes = [
    { path: '', redirectTo: 'game', pathMatch: 'full' },
    { path: 'game', component: WaitingRoomComponent },
    { path: 'waitingRoom', component: WaitingRoomComponent },
    //TODO: Remove this path once the waiting rooms are fully functional
    { path: 'testGame', component: GameComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
