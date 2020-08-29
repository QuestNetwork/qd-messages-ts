# Quest Messenger JS
> We're working hard on a working build of the master branch, it's coming soon...

> The first fully featured, multi-platform, publicly auditable, decentralized, end-to-end encrypted messenger with a feature to send money to rival all the other chat apps out there.

## Lead Maintainer

[StationedInTheField](https://github.com/StationedInTheField)

## Please Donate
This project is a lot of work and unfortunately we have to eat and pay rent, so we'd be thrilled if you could send us a small donation to:

Bitcoin:
`bc1qujrqa3s34r5h0exgmmcuf8ejhyydm8wwja4fmq`

Ethereum:
`0xBC2A050E7B87610Bc29657e7e7901DdBA6f2D34E`

## Description

The Quest Messenger is the first fully featured, multi-platform, publicly auditable, decentralized, end-to-end encrypted messenger with a feature to send money to rival all the other chat apps. It makes use of the [Interplanetary Filesystem](https://ipfs.io), as well as of the [Quest Network PubSub Protocol](https://github.com/QuestNetwork/quest-pubsub-js) and the Quest Network Whistle ID Protocol among others. We're planning to integrate payments soon, so you can send each other money!

We're planning to become for messaging what [Atom](https://atom.io) is for writing code.

The Quest Messenger works in the browser, as an Electron on Windows, Mac and Linux and as a Chromium on iOS and Android.

## Installation & Usage

Please use our [quest-cli](https://github.com/QuestNetwork/quest-cli) to test and build the app.

Pro Tip: Put a file in your `/bin` that runs the quest-cli like so `node /path/to/quest-cli/index.js` from any folder on your system. It's much nicer!

## Features

0.9.1:
- Does not depend on the internet
- Does not depend on centralized servers
- No static external address or port forwarding necessary
- Encrypted P2P Channels 
- Private Encrypted P2P Channels (open a private channel with someone on the participant list of a channel)
- Encrypted P2P File Transfer 
- Organize Channels By Transport/Protocol And Custom Groups (like project folders in Atom)
- AutoSave For Settings And Message Histories
- Add Custom Themes By Pasting CSS Into The Built-In Theme Editor
- Export Themes 
- Export Settings
- Export Message Histories

## Roadmap

1.0.0:
- P2P Encrypted Audio/Video Conversations (Encryption Can Be Turned Off For Higher Quality)
- Unlimited Custom Emojis
- Inline Preview For Media Files And Links (images, videos, etc)
- Private Channels Extendable To Groups (background create and join)
- Ethereum Payment Integration
- Sync Message History (like syncing the ethereum blockchain, channel participants can offer a history, since every message is signed with an elliptic curve key, we can verify and merge it into ours)

2.0.0:
- Parenting (reply to channel and private messages)
- [OpenAI GPT3](https://en.wikipedia.org/wiki/GPT-3) Integration For Suggestions, AutoRespond And Completion
- Quest Network Widgets (plug-in that connects the messenger to other apps, for example collaborative illustration in Inkscape)

3.0.0:
- Modular Crypto Currency Integration (presets for Bitcoin, Monero and Chainlink)
- Share Screen
