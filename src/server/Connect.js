/* 
 * The MIT License
 *
 * Copyright 2016 Damien Doussaud (namide.com).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var WebSocketServer = require('ws').Server
import User from './User.js'

export default class Connect {
    
    constructor( config )
    {
        this.onLog = null
        this.onNewUser = null
        
        this._options = {
            port: (process.env.PORT || config.port),
            host: config.host,
            path: config.path
        }
    }
    
    start()
    {
        const options = this._options
        const wss = new WebSocketServer(options)
        this._wss = wss
        this.onLog(`Sock initialized: ${options.host}${options.path}: ${options.port}`)
        
        // Listen the new connections
        wss.on('connection', this.add.bind(this))
        this.onLog(`Sock listen connections`)
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
                this.onLog(`Socket closed: ${error}`)
                user.onClose(error);
            }
        }
        
	socket.on('message', user.onMsg)
	socket.on('close', user.onClose)
        
        this.onNewUser(user)
    }
}
