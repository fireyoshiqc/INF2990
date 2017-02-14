import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { AppComponent } from '../components/app.component';

// TODO : Put the right paths
const routes: Routes = [
    { path: '', redirectTo: 'appcomponent', pathMatch: 'full' },
    { path: 'appcomponent', component: WaitingRoomComponent },
    { path: 'waitingRoom', component: WaitingRoomComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }