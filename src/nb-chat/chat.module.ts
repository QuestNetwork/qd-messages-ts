/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { NbSharedModule } from  './shared.module';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from  '@nebular/theme';
import { NbIconModule } from '@nebular/theme';

import { NbChatComponent } from './chat.component';
import { NbChatMessageComponent } from './chat-message.component';
import { NbChatFormComponent } from './chat-form.component';
import { NbChatMessageTextComponent } from './chat-message-text.component';
import { NbChatMessageFileComponent } from './chat-message-file.component';
import { NbChatMessageQuoteComponent } from './chat-message-quote.component';
import { NbChatMessageMapComponent } from './chat-message-map.component';
import { NbChatOptions } from './chat.options';
import { NbFormFieldModule } from '@nebular/theme';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { LinkyModule } from 'ngx-linky';


const NB_CHAT_COMPONENTS = [
  NbChatComponent,
  NbChatMessageComponent,
  NbChatFormComponent,
  NbChatMessageTextComponent,
  NbChatMessageFileComponent,
  NbChatMessageQuoteComponent,
  NbChatMessageMapComponent,
];

@NgModule({
  imports: [
    NbSharedModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    EmojiModule,
    PickerModule,
    NbFormFieldModule,
    LinkyModule
  ],
  declarations: [
    ...NB_CHAT_COMPONENTS,
  ],
  exports: [
    ...NB_CHAT_COMPONENTS,
  ],
})
export class NbChatModule {

  static forRoot(options?: NbChatOptions) {
    return <ModuleWithProviders<NbChatModule>> {
      ngModule: NbChatModule,
      providers: [
        { provide: NbChatOptions, useValue: options || {} },
      ],
    };
  }

  static forChild(options?: NbChatOptions) {
    return <ModuleWithProviders<NbChatModule>> {
      ngModule: NbChatModule,
      providers: [
        { provide: NbChatOptions, useValue: options || {} },
      ],
    };
  }
}
