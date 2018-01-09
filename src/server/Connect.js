import User from './User.js'

const WebSocketServer = require('ws').Server


export default class Connect
{
    constructor( config )
    {
        // this.onLog = null
        this.onNewUser = null
        
        this._options = {
            port: (process.env.PORT || config.port),
            host: config.host,
            path: config.path
        }
        
        this.add = this.add.bind(this)
    }
    
    start()
    {
        const options = this._options
        const wss = new WebSocketServer(options)
        this._wss = wss
        // this.onLog(`Sock initialized: ${options.host}${options.path}: ${options.port}`)
        
        console.log(`Sock initialized: ${options.host}${options.path}: ${options.port}`)
        
        // Listen the new connections
        wss.on('connection', this.add)
        // this.onLog(`Sock listen connections`)
    }
    
    close()
    {
        if (this._wss)
        {
            this._wss.off('connection', this.add)
            this._wss.close()
        }
    }
    
    add( socket )
    {
	const user = new User(socket);
	
        user.sendMsg = (str) => {
            
            try
            {
                socket.send(str);
            }
            catch (error)
            {
                // this.onLog(`Socket closed: ${error}`)
                user.onClose(error);
            }
        }
        
	socket.on('message', user.onMsg)
	socket.on('close', user.onClose)
        
        this.onNewUser(user)
    }
}
