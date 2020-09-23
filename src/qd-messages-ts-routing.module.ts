import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QDMessagesComponent } from './qd-messages-ts.component';

const routes: Routes = [
  { path: '', component: QDMessagesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestMessengerJSRoutingModule { }
