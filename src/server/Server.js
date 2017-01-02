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

import User from './User.js'
import Chan from './Chan.js'
import Connect from './Connect.js'
import Message from './Message.js'

const DEFAULT_CONFIG = {

    debug: true,
    
    connect: {
        host: '0.0.0.0',
        path: '/chat',
        port: 8000
    },

    chan: {
        public: [{
            name: 'home',
            userMin: 0,
            userMax: 1000000,
            modEnabled: false
        }],
        default: {
            userMin: 1,
            userMax: 100,
            modEnabled: true
        },
        valid: {
            name: name =>  name.match(/^[_A-Za-z0-9-]{3,10}$/)
        }
    },

    user: {
        default: {
            name: 'guest',
            role: 0
        },
        valid: {
            name: name =>  name.match(/^[_A-Za-z0-9-]{3,10}$/)
        }
    }
}

class Server {
    
    constructor( config = {} )
    {
        this.users = []
        this.cache = {
            userName = {},
            userId = {},
            chanName = {},
            chanList = {}
        }
        
        this._config = Object.assign({}, DEFAULT_CONFIG, config)
        this._onDebug = this._getDebugFunction()
        
        const message = new Message()
        message.onLog = this._onDebug
        this._message = message
        
        this._initChans()
        
        const connect = new Connect(this._config.connect)
        connect.onLog = this._onDebug.bind(this)
        connect.onNewUser = this._onNewUser.bind(this)
        connect.start()
        this._connect = connect
        
    }
    
    joinChan( user, chan = null, pass = '' )
    {
	const oldChan = user.chan;
		
        if (this._joinChan(user, chan, pass))
        {
            // Add the new chan to the user who change chan
            this._message.sendChanData(chan, chan.data, user);

            // Send the chan change to old chan
            if (oldChan != null)
            {
                this.sendUserData(user, {chan: {id: -2}}, oldChan.users);
            }

            // send to all users in the new chan without the new user
            var list = [...chan.users]
            list.splice(list.indexOf(user), 1)
            this.sendUserData(user, user.data, list);

            // send new data for user
            this._message.sendChanUserList(chan, chan.users ,user);

            return true
	}
	
	// can't join chan
        this._message.sendError(user, 406, chan.data.name)
	return false
    }
    
    _joinChan( user, chan = null, pass = '' )
    {
        if (chan != null && pass !== chan.pass)
        {
            
            return false
        }
        
        chan.add(user)
        return true
    }
    
    _initChans()
    {
        const chans = []
        
        const chanConfigPublic = this._config.chan.public
        for (let i = 0, l = chanConfigPublic.length; i < l; i++)
        {
            const chan = new Chan( '', chanConfigPublic[i] )
            chans.push(chan)
        }
        
        this.chans = chans
    }
    
    _getDebugFunction()
    {
	// Active debug mode
	if (this._config.debug)
        {
            return (msg, user = null) => {

                if (user !== null)
                {
                    msg = (user.data.name + "(" + user.data.id + ") ") + msg
                }
                console.log(msg)
            }
	}
	return () => {}
    }
    
    _onNewUser( user )
    {
        const userConfig = this._config.user.default
        user.setData( userConfig )
        user.data.name = userConfig.name + ((User.id > 0) ? (User.id) : '')
       
        this._onDebug('connected', user)
        
	// Inform user of his datas
        this._sendUserData(user, user.data, user)
        
        // Join the default chan
       this.joinChan(user, this.chans[0], '')
    }
}

export default Server
