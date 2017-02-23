import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartPageComponent } from '../components/startPage.component';
import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { GameComponent } from '../components/game.component';

const routes: Routes = [
    { path: '', redirectTo: 'startPage', pathMatch: 'full' },
    { path: 'startPage', component: StartPageComponent },
    { path: 'waitingRoom', component: WaitingRoomComponent },
    { path: 'testGame', component: GameComponent }  // TODO: Temporary, for testing
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
