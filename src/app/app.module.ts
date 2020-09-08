import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
// import {MatTreeModule} from '@angular/material/tree';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {DragDropModule} from '@angular/cdk/drag-drop';


import { HttpClientModule } from '@angular/common/http';


import { NgxElectronModule } from 'ngx-electron';

import { NbThemeModule, NbContextMenuModule, NbMenuService, NbMenuModule,     NbDialogModule} from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbSidebarService, NbTabsetModule } from '@nebular/theme';
import { NbChatModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbIconModule,NbTreeGridModule,    NbCardModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

//
import { UiService} from './services/ui.service';
import { QuestOSService } from './services/quest-os.service';
//
import { FsIconComponent } from './nb-fs-icon/nb-fs-icon.component';
import { LoadHexComponent } from './load-hex/load-hex.component';
import { ChannelComponent } from './channel/channel.component';
import { MatMenuComponent } from './mat-menu/mat-menu.component';
import { SettingsComponent } from './settings/settings.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { ChannelListComponent } from './channel-list/channel-list.component';
import { ChannelSidebarRightComponent } from './channel-sidebar-right/channel-sidebar-right.component';
import { ChannelSidebarLeftComponent } from './channel-sidebar-left/channel-sidebar-left.component';
import { ChannelParticipantListComponent } from './channel-participant-list/channel-participant-list.component';
import { ChannelSettingsComponent } from './channel-settings/channel-settings.component';
import { ChannelTabComponent } from './channel-tab/channel-tab.component';

import {ClipboardModule} from '@angular/cdk/clipboard';


@NgModule({
  declarations: [

    AppComponent,
    LoadHexComponent,
    ChannelComponent,
    MatMenuComponent,
    SettingsComponent,
    SignInComponent,
    FsIconComponent,
    ChannelListComponent,
    ChannelSidebarRightComponent,
    ChannelSidebarLeftComponent,
    ChannelParticipantListComponent,
    ChannelSettingsComponent,
    ChannelTabComponent
  ],
  imports: [
    ClipboardModule,
    FlexLayoutModule,
    HttpClientModule,
    MatSliderModule,
    MatCardModule,
    MatTabsModule,
    NgxFileDropModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatIconModule,
    MatSnackBarModule,
    NgxElectronModule,
    NbThemeModule.forRoot({name:'dark'}),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbChatModule,
    NbTabsetModule,
    NbEvaIconsModule,
    NbIconModule,
    NbTreeGridModule,
    FormsModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbCardModule
  ],
  providers: [
      UiService,
      QuestOSService,
    NbSidebarService,NbMenuService,NbDialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
