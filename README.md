# Quest Messenger JS
> We strive to become the first fully featured, multi-platform, publicly auditable, decentralized, end-to-end encrypted messenger with a feature to send money to rival all the other chat apps out there.

![Screenshot](https://github.com/QuestNetwork/quest-messenger-js/blob/master/doc/images/messages-locked-sidebars.png?raw=true)

## Lead Maintainer

[StationedInTheField](https://github.com/StationedInTheField)

## Please Donate
This project is a lot of work and unfortunately we need to eat food, so we'd be thrilled if you sent us your donations to:

Bitcoin:
`bc1qujrqa3s34r5h0exgmmcuf8ejhyydm8wwja4fmq`

Ethereum:
`0xBC2A050E7B87610Bc29657e7e7901DdBA6f2D34E`

## Download

| Platform | Download link                | 
|---------:|------------------------------|
| **Linux**  | [0.9.0.AppImage](https://github.com/QuestNetwork/quest-messenger-js/releases/download/0.9.0/@questnetwork-quest-messenger-js-0.9.0-linux.zip) 
| **Mac**    | [0.9.0.app](https://github.com/QuestNetwork/quest-messenger-js/releases/download/0.9.0/@questnetwork-quest-messenger-js-0-9-0-mac.zip) 

If you want anything else, you'll have to build from sources and probably fix some stuff.

## Description

The Quest Messenger is on track to become the first fully featured, multi-platform, publicly auditable, decentralized, end-to-end encrypted messenger with a feature to send money to rival all the other chat apps. It makes use of the [Interplanetary Filesystem](https://ipfs.io), [IPFS GossipSub](https://blog.ipfs.io/2020-05-20-gossipsub-v1.1/) as well as of the [Quest Network PubSub Protocol](https://github.com/QuestNetwork/quest-pubsub-js), [Quest P2P Captcha](https://github.com/QuestNetwork/quest-captcha-js) and the Quest Network Whistle ID Protocol among others. We're planning to integrate payments soon, so you can send each other money!

We're planning to become for messaging what [Atom](https://atom.io) is for writing code. **Full Matrix integration is planned as well.**

The Quest Messenger works in the browser, as an Electron on Windows, Mac and Linux and Android using Cordova.

## Installation & Usage

Please use our [quest-cli](https://github.com/QuestNetwork/quest-cli) to test and build the app.

Pro Tip: Put a file in your `/bin` that runs the quest-cli like so `node /path/to/quest-cli/index.js` from any folder on your system. It's much nicer!

## Warning
**THIRD PARTY DEPENDENCIES NOT AUDITED YET! APP HAS ACCESS TO FILESYSTEM! USE IN VIRTUAL MACHINE UNTIL 1.0.0!**

## Features

**0.9.0**
- Does not depend on the internet
- Does not depend on centralized servers
- No static external address or port forwarding necessary
- Dark Mode
- Messages are signed using a P-521 EC keypair
- Encrypted P2P Channels (End-To-End, AES-256-CBC, Shared Via 4096 Bit OAEP)
- Organize Channels By Transport/Protocol And Custom Groups (like project folders in Atom)
- AutoSave For Settings

**0.9.1**
- Join/Create Custom Channels
- Import/Export Channel Groups
- Invite Only Channels (Generate tokens to invite participants instead of the challenge flow)

## Roadmap

**0.9.2**
- AutoSave For Message Histories
- Pair with participants by sharing public keys in person (scanning qr codes of the keys/channels)
- Ban Channel Participants By Generating New Channel Names (ask representatives for new name, refuse banned participants)
- Alias (show custom name instead of pub key)

**0.9.3**
- Private Encrypted P2P Channels (End-To-End, AES-256-CBC, Shared Via 4096 Bit OAEP)
- Encrypted P2P File Transfer (End-To-End AES-256-CBC, Shared Via 4096 Bit OAEP)
- Export Settings
- Export Message Histories

**0.9.4**
- Light Mode
- Add Custom Themes By Pasting CSS Into The Built-In Theme Editor
- Import/Export Themes.

**0.9.5**
- IRC Plugin to add IRC servers

**0.9.6**
- Encrypt Settings/Message History Files

**0.9.7**
- Private Channels Extendable To Groups (background create and join)

**0.9.8**
- P2P Encrypted Audio/Video Conversations (Encryption Can Be Turned Off For Higher Quality)

**1.0.0**
- Third Party Dependencies Audited, Security Issues Fixed
- Inline Preview For Media Files And Links (images, videos, etc)
- Unlimited Custom Emojis

**1.1.0**
- QuickResponse (from list of possible responses)
- AutoResponse (from quick responses)

**1.2.0**
- Parenting (reply to channel and private messages)
- Sync Message History (like syncing the blockchain, channel participants can offer a history, since every message is signed with an elliptic curve key, we can verify and merge it into ours)

**2.0.0**
- Ethereum Payment Integration

**2.1.0**
- Matrix Plugin to add Matrix rooms and communities

**3.0.0**
- [OpenAI GPT3](https://en.wikipedia.org/wiki/GPT-3) Integration For Suggestions, AutoRespond And Completion

**4.0.0**
- Quest Network Widgets (plug-in that connects the messenger to other apps, for example collaborative illustration in Inkscape)
- Modular Crypto Currency Integration (presets for Bitcoin, Monero and Chainlink)
- Share Screen

## License

GNU GPLv3
