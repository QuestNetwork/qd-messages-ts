import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestMessengerJSComponent } from './qd-messages-ts.component';

const routes: Routes = [
  { path: '', component: QuestMessengerJSComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestMessengerJSRoutingModule { }
