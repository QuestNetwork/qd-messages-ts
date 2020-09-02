import { Injectable } from '@angular/core';
import * as Ipfs from 'ipfs';
// import * as Cid from 'cids';
import { UiService } from './ui.service'
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as swarmJson from '../swarm.json';

// import * as multiaddr from 'multiaddr';


@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  constructor(private ui: UiService) { }


  public ipfsNode;
  private ipfsSwarmLive;

  isReady(){
    return this.ipfsNodeReady;
  }

  ipfsNodeReady = false;
  ipfsNodeReadySub = new Subject<any>();
  setIpfsNodeReady(value: boolean) {
    this.ipfsNodeReady = value;
    this.ipfsNodeReadySub.next(true);
    // localStorage.setItem('isLoggedIn', value ? "true" : "false");
  }


 swarmPeersSub = new Subject();
 setSwarmPeers(value){
   this.swarmPeersSub.next(value);
 }



  async getPeers(){
    if(typeof(this.ipfsNode != 'undefined')){
      let peers = await this.ipfsNode.swarm.peers();
      this.swarmPeersSub.next(peers.length);
      if(peers.length > 0){
        console.log("Swarm is:");
        console.log(peers);
        this.setIpfsNodeReady(true);
        return peers;
      }
    }
    return false;
  }

  ipfsId;
  getIpfsId(){
    return this.ipfsId;
  }

  async start(){
        console.log("Waiting for IPFS...");
        try{
          let repoId = uuidv4();
          // let repoId = uuidv4();

          let ipfsEmptyConfig = {
          repo: 'anoon-repo-'+repoId,
          config: {
            Addresses: {
              Swarm: swarmJson['bootstrapIpfs']['swarm'],
              API: '',
              Gateway: ''
            },
          EXPERIMENTAL: {
               pubsub: true
             }
          }};

          this.ipfsNode = await Ipfs.create(ipfsEmptyConfig);
          const version = await this.ipfsNode.version();
          console.log("IPFS v"+version.version+" created!");
          console.log("Filesystem Online: "+this.ipfsNode.isOnline());
          this.ipfsId = await this.ipfsNode.id();
          console.log("Our IPFS ID is:"+this.ipfsId.id);
        }catch(error){
          console.log("couldn't start IPFS");
          console.warn(error);
          throw('IPFS Fail');
        }

        console.log('About to check...');

        while(!this.ipfsNodeReady){
          //check peers
          console.log('Checking for peers...');
          await this.getPeers()
          await this.ui.delay(2000);
        }

        return true;
  }


  async setSwarmLive(value){
    this.ipfsSwarmLive = value;
  }

  async isSwarmLive(){
    return this.ipfsSwarmLive;
  }


  async IpfsAddString(string){
    let cidSave;
    console.log("Adding String to IPFS:");
    console.log(string);

    for await (let { cid } of this.ipfsNode.add(string)) {
      cidSave = cid;
    }

     console.log('done! hash is: '+cidSave.string);
     return cidSave.string;
  }

  //
  dataCache = "";
  async IpfsGet(cidString){
     // return new Promise( async (resolve) => {
          console.log('getting '+cidString+'...');
          // this.dataCache = "";
          // const chunks = [];
          //
          // let ipfsCid = new ipfsCidGenerator(String(cidString));
          // for await (const chunk of this.ipfsNode.files.read(ipfsCid)) {
          //   chunks.push(chunk)
          // }

          // let data = Buffer.concat(chunks).toString('base64');

          // console.log()
          //
    let frameFetchResult;
    let noCloudflare = 0;
    try{
          // await this.ui.delay(250);
          let url = 'https://cloudflare-ipfs.com/ipfs/'+cidString;
          console.log(url);
          frameFetchResult = await fetch(url);

    }
    catch(error){
      noCloudflare = 1;
    }

    if(noCloudflare){
        console.log('cloudflare could not deliver');
        let url = 'https://ipfs.io/ipfs/'+cidString;
        console.log(url);
        frameFetchResult = await fetch(url);
    }

    if(typeof(frameFetchResult) == 'undefined' || frameFetchResult.status != 200){
        throw('ipfs.get not working');
    }

          let data = await frameFetchResult.text();



          return data;


    // });
  }
  //
  //


}
