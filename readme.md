
# Sock

Lightweight JavaScript library (server/client) for multiplayer mini games and chat.

- Version: alpha
- TCP: Websockets
- Server Dependencies: NodeJS>=6.9.0, WS
- Client Dependencies: none
- Example: [chat](http://namide.com/chat) (jQuery)


## Get started

[Install NodeJs and NPM](https://docs.npmjs.com/getting-started/installing-node).

Open your shell, go to the directory `sock/` and add the dependencies with the command :
```sh
npm install
```

Build client:
```sh
npm run build
```


## Value objects struct
	
```javascript
{
    type = y: event = 1 | data = 2 | list = 3,

    label = l: String | null,

    target = t: {
        type = y: user = 1 | chan = 2 | server = 3,
        id = i: int | null
    } | null

    msg = m: *
}
```

server -> client



client -> server

**Subscribe to the channel list and updates of the channel list**
```
{
    y: 3,    // type: list
    t: 3     // target (about): server
    l: 1,    // label: subscribe
}
```

**Unsubscribe to the channel list and updates of the channel list**
```
{
    y: 3,    // type: list
    t: 3,    // target (about): server
    l: 0,    // label: unsubscribe
}
```

**Subscribe to the user list and updates of a chan**
```
{
    y: 3,       // type: list
    t: 2        // target (about): chan
    l: 1,       // label: subscribe
    m: {        // message
        id: 1   // chan id: 1
    }
}
```
