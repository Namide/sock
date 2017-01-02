
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
    type = i : event = 1 | data = 2 | list = 3,

    label = l: String | null,

    from = f: {
        type: user = 1 | chan = 2 |  server = 3,
        id: int | null
    } | null

    to = t: {
        type: user = 1 | chan = 2 | server = 3,
        id: int | null
    } | null

    msg = m: *
}
```

server -> client



client -> server

**Subscribe to the channel list and update of the channel list**
```
{
    type: list,
    to: {
        type: server
        id: 1
    }
}
```

**Unsubscribe to the channel list and update of the channel list**
```
{
    type: list,
    to: {
        type: server
        id: -1
    }
}
```
