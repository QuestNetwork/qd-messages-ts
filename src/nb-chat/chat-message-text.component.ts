
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges } from '@angular/core';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';


 // <p class="sender" *ngIf="sender || date">{{ sender }} <time>{{ date  | date:'shortTime' }}</time></p>
 // <p class="sender" *ngIf="sender || date">{{ sender }} <time>{{ date  | date:'shortTime' }}</time></p>


@Component({
  selector: 'nb-chat-message-text',
  styleUrls: ['./chat-message-text.component.scss'],
  template: `

    <p class="sender" *ngIf="sender['social'] !== 'unknown'" (click)="goToProfile(sender['social'])" class="socialLink messageDisplayName">
      {{ sender['name'] }}
      <nb-icon icon='star-outline' *ngIf="sender['isRequestedFavorite']" class="senderIcon messageSenderStarIcon"></nb-icon>
      <nb-icon icon='heart-outline' *ngIf="sender['isFavorite']" class="senderIcon" ></nb-icon>
      </p>

      <p class="sender" *ngIf="sender['social'] == 'unknown'" class="messageDisplayName">
        {{ sender['name'] }}
        </p>

    <div class="text" *ngIf="!messages['isEmoji']">
      <div *ngFor="let m of messages" style="display:inline-block" class="messagesTextWrapper">
        <div class="messagesInnerWrapper">  <p *ngIf="!m['isEmoji']" style="display:inline-block;padding-left: 2px;padding-right: 2px;" [innerHTML]="m | linky:{newWindow: true}"></p> </div>
          <div *ngIf="m['isEmoji']"  class="emojiChunk">
            <ngx-emoji emoji="{{ m['emojiColon'] }}" set="apple" size="22" class="" style="display:inline-block;max-height: 22px;overflow: hidden;"></ngx-emoji>
          </div>
      </div>
    </div>
    <div *ngIf="messages['isEmoji']">
      <ngx-emoji emoji="{{ messages['emojiColon'] }}" set="apple" size="64" class="" ></ngx-emoji>
    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbChatMessageTextComponent {

  constructor(private q: QuestOSService){

  }

  messages
  ngOnInit(){
    this.messages = this.getArray(this.message);
  }
  ngOnChanges(){
      this.messages = this.getArray(this.message);
  }

  goToProfile(pubKey){
    this.q.os.social.select(pubKey);
    this.q.os.ui.toTabIndex('2');
  }

  getArray(message){
    let messageArray = [];
    let inputArray =  [];
    try{
       let inputString =  String(message).trim();

       let colonedEmojis = /:(?![\n])[()#$@-\w]+:/g
       let emojis = colonedEmojis.exec(inputString);
       // alert(emojis);
       for(let emoji of emojis){
         // console.log(emoji.substr(1,emoji.length-2));
         if(emoji.substr(1,emoji.length-2).indexOf(':') < 0){
           inputString = inputString.replace(emoji,' '+emoji+' ');
         }
       }
       // alert(inputString);
       inputArray = inputString.trim().split(" ");
       if(inputArray.length < 2){
         throw('not found');
       }
    }catch(e){console.log(e); inputArray = [message]}

      for(let chunk of inputArray){

        chunk = chunk.trim();

        if(chunk == ':D' || chunk == ':)' || chunk == '=)' || chunk == '=D' ){
          chunk = ':grinning:'
        }

        if(chunk.indexOf(':') == 0 && chunk.substr(1).indexOf(':') == chunk.length-2){
          let emojiChunk = { isEmoji: true, emojiColon: chunk.substr(1,chunk.length-2) };
          if(inputArray.length == 1){
            return emojiChunk;
          }
          messageArray.push(emojiChunk);
        }
        else{
          messageArray.push(chunk);
        }
      }
      return messageArray;
  }

  /**
   * Message sender
   * @type {string}
   */
  @Input() sender: string;

  /**
   * Message sender
   * @type {string}
   */
  @Input() message: string;

  /**
   * Message send date
   * @type {Date}
   */
  @Input() date: Date;

}
