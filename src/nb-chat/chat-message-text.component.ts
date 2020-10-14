
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, NgZone } from '@angular/core';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $:any;

 // <p class="sender" *ngIf="sender || date">{{ sender }} <time>{{ date  | date:'shortTime' }}</time></p>
 // <p class="sender" *ngIf="sender || date">{{ sender }} <time>{{ date  | date:'shortTime' }}</time></p>
 //
 //


 //


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

        <div *ngIf="messageRows.length > 0 && (messageRows.length > 1 || !messageRows[0][0]['isEmoji'])"  class="text">
          <div *ngFor="let row of messageRows" style="display:block;clear:both;">

              <div *ngFor="let chunk of row" class="chunkContainer">
                  <div *ngIf="!chunk['isEmoji']" class="textChunk"  [innerHTML]="chunk['text'] | linky:{newWindow: true}"></div>
                  <ngx-emoji *ngIf="chunk['isEmoji']" class="emojiChunk" [emoji]="chunk['emojiColon']" set="apple" size="22"  style="display:inline-block;max-height: 22px;overflow: hidden;"></ngx-emoji>
              </div>


          </div>
        </div>


        <!-- is single emoji -->
        <div *ngIf="messageRows.length == 1 && messageRows[0].length == 1 && messageRows[0][0]['isEmoji']">
          <ngx-emoji emoji="{{ messageRows[0][0]['emojiColon'] }}" set="apple" size="64" class="" ></ngx-emoji>
        </div>



  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbChatMessageTextComponent {

  constructor(private ngZone: NgZone,private router: Router,private q: QuestOSService){

  }

  scrollable = { };
  scrollBottom(){


      try{

        //TODO: ADD TO UI SERVICE
        this.scrollable['nativeElement'] = window['quest-network-ui-globals']['messages-chat-scrollable'];

        if(this.scrollable['nativeElement'] != null && this.scrollable['nativeElement'].scrollTop > this.scrollable['nativeElement'].scrollHeight-$(this.scrollable['nativeElement']).height()-210){
          this.scrollable['nativeElement'].scrollTop = this.scrollable['nativeElement'].scrollHeight;
        }


      }catch(e){console.log(e)}


  }

  messageRows
  ngOnInit(){
    this.messageRows = this.getArray(this.message);
    this.scrollBottom();
  }
  ngOnChanges(){
      this.messageRows = this.getArray(this.message);
      this.scrollBottom();
  }

  goToProfile(pubKey){
    // this.q.os.social.profile.select(pubKey);
    // this.q.os.ui.toTabIndex('2');

    this.ngZone.run(() => this.router.navigate(['/social/profile/'+pubKey]));
    // this.q.os.ui.toTabIndex('2');
  }

  getArray(message){
    let messageArray = [];
    let inputArray =  [];

    let inputRows =  [];
    let rows = [];

    let inputString =  String(message).trim();

    try{
      let replacers = [ '\n:', '\n :', '\n  :'];
      for(let replacer of replacers){
        inputString = inputString.replace(new RegExp(replacer,"g"),' :');
      }

    }catch(e){}



    try{

       let replacers = [ ':D', ':\\)', '=\\)', ':-\\)', '=D'];
       for(let replacer of replacers){
         inputString = inputString.replace(new RegExp(replacer,"g"),':grinning:');
       }

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


    }catch(e){console.log(e); }

    inputRows =  inputString.trim().split('\n');
    rows = [];
    for(let row of inputRows){
      rows.push(row.trim().split(" "));
    }

    for(let i=0;i<rows.length;i++){
      for(let i2=0;i2<rows[i].length;i2++){

        let chunk = String(rows[i][i2]).trim();

        if(chunk.indexOf(':') == 0 && chunk.substr(1).indexOf(':') == chunk.length-2){
          let emojiChunk = { isEmoji: true, emojiColon: chunk.substr(1,chunk.length-2) };
          if(inputArray.length == 1){
            return emojiChunk;
          }
          rows[i][i2] = emojiChunk;
        }
        else{
          let thisChunk = { isEmoji: false, text: chunk }
          rows[i][i2] = thisChunk;
        }
      }
    }


    // setTimeout( () => {
    // },1000)

    return rows;



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
