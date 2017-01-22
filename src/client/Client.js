/* 
 * The MIT License
 *
 * Copyright 2017 Damien Doussaud (namide.com).
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

import Chan from './Chan.js'
import User from './User.js'
import Translate from './Translate.js'
import Parser from './Parser.js'


class Client {
    
    constructor( URI, onConnected = null, onError = null, lang = 'en' )
    {
        this.users = [] // all, me too

        this.me
	this.chan

	this.uri = URI
	this.translate = new Translate(lang)
	
	this.listChans = []
        this.websocket
        
	this._initDispatcher(onConnected, onError)
        this._initWebsocket()
        this._initParser()
    }
    
    _initDispatcher( onConnected, onError )
    {
	this.onConnected = onConnected || (user => { this.onLog('User connected') })
	this.onError = onError || (msg => { console.error(msg) })
        
        this.onLog = msg => { console.log(msg) }
	this.onClose = msg => { this.onLog('Socket closed') }
	this.onMsgUser = (name, msg) => { this.onLog(name + ":" + msg) }
	this.onChanMsg = (name, msg) => { this.onLog(name + ":" + msg) }
	this.onServerMsg = msg => { this.onLog(msg) }
	this.onListChan = list => { this.onLog(list) }
	this.onUserEvt = (user, label, data) => { this.onLog(label) }
	this.onChanEvt = (label, data) => { this.onLog(label) }
	this.onServerEvt = (label, data) => { this.onLog(label) }
	this.onChanChange = chan => { this.onLog('Chan changed') }
	this.onChanDataChange = data => { this.onLog('data changed') }
	this.onChanUserList = list => { this.onLog(list) }
    }
    
    _initParser()
    {
        this.parser = new Parser()
        this.parser.onError = errorCode => {
            this.onError( this.translate.get( errorCode ) )
        }
        
        
        /*
            this.parser.onChanEvent = (chanTargetId, label, msg) => {}
         */
        
        // EVENTS

        this.parser.onUserEvent = (userTargetId, label, msg) => {
            
            const user = this.getUserById( userTargetId )
            if (label === 'msg')
            {
                this.onMsgUser(user.data.name, msg)
            }
            else
            {
                this.onUserEvt(user, label, msg)
            }
        }
        
        this.parser.onChanEvent = (userTargetId, label, msg) => {
            
            const user = this.getUserById( userTargetId )
            if (label === 'msg')
            {
                this.onChanMsg(user.data.name, msg)
            }
            else
            {
                this.onChanEvt(label, msg)
            }
        }
        
        this.parser.onServerEvent = (label, msg) => {
            
            if (label === 'msg')
            {
                this.onServerMsg(msg)
            }
            else if (label === 'error')
            {
                this.onServerMsg(this.translate.get(msg.id, ...msg.vars)
            }
            else
            {
                this.onServerEvt(label, msg)
            }
        }
        

        this.parser.onChanList = (list) => {
            
            // Check if you have new players
            const userList = []
            for (const userData in list)
            {
                const user = this._updateUser(userData, false)
                userList.push(user)
            }
            
            this.chan.replaceUsers(userList)
            this._dispatchChanUserList()
        }
        
        
        this.parser.onServerList = (list) => {
            
            this.listChans = list
            this._dispatchServerChanList()
        }
        
        /* TODO
       
        case "chan-added" :

            if (this.listChans === undefined)
                    this.listChans = [];

            this.listChans.push(d.data);
            this._dispatchServerChanList();

            break;

        case "chan-removed" :

            if (this.listChans === undefined)
                    this.listChans = [];

            var i = this.listChans.indexOf(d.data);
            if (i > -1)
                    this.listChans.splice(i, 1);

            this._dispatchServerChanList();

            break;*/
    


        // DATAS
        this.parser.onChanData = (chanTargetId, msg) => {
            msg.id = chanTargetId
            this._setChanData(d);
        }
        
        this.parser.onUserData = (userTargetId, msg) => {
            msg.id = userTargetId
            this._updateUser(msg)
        }
        
        this.parser.onServerData = (msg) => {
            console.warn('No update for server data')
        }
    }
    
    _initWebsocket()
    {
	try
        {
            this.websocket = new WebSocket(this.uri)
            this.websocket.onclose = evt => { this.onClose(evt.data) }
            this.websocket.onmessage = evt => { this.parser.check(evt.data) }
            this.websocket.onerror = evt => { this.onError(mpgClient.trad.get(5)) }

            window.addEventListener('beforeunload', (e) => { this.close() }, false)
	}
        catch (e)
        {
            this.onError(this.trad.get(0))
	}
    }
    
    _send( data )
    {
        this.websocket.send(JSON.stringify(data))
    }
    
    /**
    * Send a message to the chan or to a user
    *
    * @param {string} msg		Your message
    * @param {User?} user		Facultative, if it's null: the message is send to all the chan
    */
    sendMsg( msg, user = null )
    {
        return this.sendUserEvt( 'msg', msg, user )
    }

    /**
     * Send an event.
     * 
     * @param {String} label		Label of the event
     * @param {Object} data		Datas of the event
     * @param {User} user		Facultative, target of the event (if it's null, the target is you)
     */
    sendUserEvt( label, data, user = null )
    {
        if (user === null)
        {
            return this._send({
                y: 1,
                l: label,
                t: { y: 2, i: this.chan.data.id },
                m: data
            })
        }
        else
        {
            return this._send({
                y: 1,
                l: label,
                t: { y: 1, i: user.data.id },
                m: data
            })
        }
    }

    /**
     * Change data(s) of a user
     *
     * @param {Object} data		Data with new information
     * @param {User?} user		Facultative, target: if null the target is you
     */
    sendUserData( data, user = null )
    {
        const t = {
            y: 1,
            i: (user === null) ? this.me.data.id : user.data.id
        }

        return this._send({
            y: 2,
            t,
            m: data
        })
    }

    /**
     * Send an event to the chan.
     *
     * @param {String} label	Label of the event
     * @param {Object} data		Datas of the event
     */
    sendChanEvt( label, data )
    {
        return this._send({
            y: 1,
            l: label,
            t: { y:2, i:this.chan.data.id },
            m: data
        })
    };

    /**
     * Change a data of the chan (you must to have the moderator of the chan)
     *
     * @param {Object} data		New data to change
     */
    sendChanData( data )
    {
        const t = {
            y: 2,
            i: this.chan.data.id
        }

        return this._send({
            y: 2,
            t,
            m: data
        })
    }

    /**
    * Get all the chans of the server (asynchronus function)
    * 
    * @param {function} callback		Function called when the list is return (like onListChan)
    */
    listenChanList( callback )
    {
        this.onListChan = callback
        this.listChans = []        
        this._send({
            y: 3,
            t: 2,
            l: 1
        })
    }

    /**
    * Stop listen the chan list
    */
    stopListenChans()
    {
        this._send({
            y: 3,
            t: 2,
            l: 0
        })
        this.onListChan = null
    }
    
    /**
    * Change the chan.
    *
    * @param {String} chanName		Name of the new chan
    * @param {String?} chanPass		Facultative pass of the new chan
    */
    joinChan( chanName, chanPass = '' )
    {
        this.sendUserData({
            chan: {
                name: chanName,
                pass: chanPass
            }
        });
    }

   /**
    * Change your name.
    *
    * @param {string} newName		Your new name
    * @param {function} callback	Called when the name is changed
    */
    changeUserName( newName, callback )
    {
        this.me.onDataNameChange = callback
        this.sendUserData({
            name: newName
        })
    }

   /**
    * Change the name of the chan.
    *
    * @param {string} newName		New name of the chan
    */
    changeChanName( newName )
    {
        this.sendChanData({
            name: chanName
        })
    }

   /**
    * Kick a user out of the chan (only if you are moderator)
    *
    * @param {User} user		User to kick
    */
    kickUser( user )
    {
        this.sendUserData({chan:{id: -1}}, user)
    }

   /**
    * Up a user to be moderator (only if you are moderator)
    *
    * @param {user} user		User to be moderator
    */
    upToModerator( user )
    {
        this.sendUserData({role: 1}, user)
    }

    close()
    {
        this.websocket.close()
    }
    
    removeUser( user )
    {
	const i = this.users.indexOf(user)
	if (userI > -1)
        {
            this.users.splice(userI, 1)
            this.chan.removeUser(user)
            
            return true
	}
	
	return false
    }
    
    getUserByName( name )
    {
        return this.users.find( u => u.data.name === name ) || null
    }
    
    getUserById( id )
    {
        return this.users.find( u => u.data.id === id ) || null
    }
    
    _updateUser( data, dispatch = true )
    {
	if (this.me == null)
        {
            this.me = new User()
            this._setUserData(data, this.me, false);

            if (dispatch)
            {
                this._dispatchConnected()
            }

            this.onServerMsg(this.trad.get(3))
            return this.me
	}
	
	var u = this.getUserById(data.id)
	if (u !== null)
        {
            this._setUserData(data, u)
	}
        else
        {
            u = new User()
            this._setUserData(data, u)

            if (dispatch)
            {
                this._dispatchChanUserList()
            }
	}

	return u
    }
    
    _dispatchUserDataChange( user, data )
    {
        if (user.onDataChange != null)
        {
            user.onDataChange(data)
        }

        if (this.onUserDataChange != null)
        {
            this.onUserDataChange(user, data)
        }
    }

    /**
     * @api private
     */
    _dispatchChanUserList()
    {
        if (this.onChanUserList)
        {
            this.onChanUserList(this.getChanUserList())
        }
    }

    /**
     * @api private
     */
    _dispatchServerChanList()
    {
        if (this.onListChan)
        {
            this.onListChan(this.listChans)
        }
    }

    /**
     * @api private
     */
    _dispatchConnected()
    {
        if (this.onConnected)
        {
            this.onConnected(this.me)
        }
    }

    /**
     * @api private
     */
    _dispatchChanChange()
    {
        if (this.onChanDataChange)
        {
            this.onChanDataChange(this.chan.data)
        }

        if (this.onChanChange)
        {
            this.onChanChange(this.chan)
        }

        this._dispatchChanUserList()
        this._dispatchServerChanList()
    }

    /**
     * @api private
     */
    _setUserData( data, user, dispatch = true )
    {
        if (data.id != null)
        {
            user.data.id = data.id
        }
        
        for (const key in data)
        {
            if (key === "name")
            {
                const oldName = user.data.name;
                user.data.name = data.name;

                if (dispatch)
                {
                    if (user.onDataNameChange != null && data.name != oldName)
                    {
                        user.onDataNameChange()
                    }

                    if (oldName != null && oldName != data.name)
                    {
                        this.onServerMsg(this.trad.get(501, [oldName, data.name]))
                    }
                    
                    this._dispatchChanUserList();
                }

            }
            else if (key === "chan")
            {
                if (user !== this.me)
                {
                    if (data.chan.id !== this.chan.data.id)
                    {
                        this.chan.remove(user)
                        this.onServerMsg(this.trad.get(504, [user.data.name, this.chan.data.name]))

                        if (dispatch)
                        {
                            this._dispatchChanUserList()
                        }

                    }
                    else
                    {
                        this.chan.join(user)
                        this.onServerMsg(this.trad.get(505, [user.data.name, this.chan.data.name]))

                        if (dispatch)
                        {
                            this._dispatchChanUserList()
                        }
                    }
                }
            }
            else
            {
                user.data[key] = data[key]
            }
        }

        this._dispatchUserDataChange(user, data)
    }

    /**
     * @api private
     */
    _setChanData( data )
    {
        let newChan = false
        if (this.chan || this.chan.data.id !== data.id)
        {
            this.chan = new Chan(data.id)
            newChan = true
        }

        for (key in data)
        {
            this.chan.data[key] = data[key]
        }

        if (newChan)
        {
            this._dispatchChanChange()
        }
        else if (this.onChanDataChange)
        {
            this.onChanDataChange(data)
        }
    }  
}

export default Client
