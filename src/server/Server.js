import User from './User.js'
import Chan from './Chan.js'
import Connect from './Connect.js'
import Parser from './Parser.js'
import Message from './Message.js'
import DEFAULT_CONFIG from './config.js'


export default class Server
{
    constructor( config = {} )
    {
        this.users = []
        this.chans = []
        this.subscribers = []
        
        this.cache = {
            userName: {},
            userId: {},
            chanName: {},
            chanId: {}
        }
        
        this._config = Object.assign({}, DEFAULT_CONFIG, config)
        // this._onDebug = this._getDebugFunction()
        
        const message = new Message()
        // message.onLog = this._onDebug
        this._message = message
        
        this._initChans()
        
        this._parser = new Parser()
        
        const connect = new Connect(this._config.connect)
        // connect.onLog = this._onDebug.bind(this)
        connect.onNewUser = this._onNewUser.bind(this)
        connect.start()
        this._connect = connect
        
    }
    
    // --------------------------------------------------------------
    //
    //                          INITIALIZATION
    //
    // --------------------------------------------------------------
    
    _initChans()
    {
        for (const options of this._config.chan.start)
        {
            // todo create a user for server to replace null
            this._addChan(null, options.name, options)
        }
    }
    
    
    
    // --------------------------------------------------------------
    //
    //                          USER DATAS
    //
    // --------------------------------------------------------------
    
    _onNewUser( user )
    {
        const userConfig = this._config.user.default
        user.setData( userConfig )
        user.data.name = userConfig.name + ((User.id > 0) ? (User.id) : '')
       
        // this._onDebug('connected', user)
        
	// Inform user of his datas
        this._message.sendData(user, user.data, user)
        
        // Join the default chan
        this.changeChan(user, this.chans[0], '')
    }
    
    
    
    // --------------------------------------------------------------
    //
    //                          CHANNEL DATAS
    //
    // --------------------------------------------------------------
    
    createChan( user, chanName, chanPass = '' )
    {
        const options = this._config.chan.default
        return this._addChan(user, chanName, options, chanPass)
    }
    
    changeChan( user, newChan = null, pass = '' )
    {
        if (newChan === null)
        {
            return false
        }
        
        if (this._canJoinChan(user, newChan, pass))
        {   
            const oldChan = user.chan
            if (oldChan !== null)
            {
                this._leaveChan(user, oldChan)
            }
            
            this._joinChan(user, newChan, pass)
            return true
	}
	
	// can't join chan
        this._message.sendError(user, 406, newChan.data.name)
	return false
    }
    
    _getChan(name)
    {
        return this.cache.chanName[name.toLowerCase()] || null
    }
    
    _canJoinChan( user, chan = null, pass = '' )
    {
        return (chan !== null && pass === chan.pass && chan.canAdd(user))
    }
    
    _rmChan(chan)
    {
        chan.onEmpty = null;
	chan.onNewMod = null;

        const i = this.chans.indexOf(chan)
        this.chans.splice(i, 1)
        
	delete(this.cache.chanName[chan.data.name.toLowerCase()]);
	
	// todo send information to all subscribers
    }
    
    _addChan(user, chanName, options, chanPass = '')
    {
        const chanConfig = this._config.chan
        
        if (chanConfig.valid.name(chanName))
        {
            const chan = new Chan(chanPass, options)
            chan.data.name = chanName
            chan.onEmpty = this._rmChan.bind(this, chan)
            chan.onNewMod = (user) => {
                // inform all the channel that this user is now moderator
                this._message.sendData(user, {role: user.getRole()}, ...chan.users)
            }
            
            this.chans.push(chan)
            this.cache.chanName[chanName.toLowerCase()] = chan
            
            // todo inform subscriber that a new chan is added
            
            return chan
        }
        else
        {
            // Invalid chan name
            this._message.sendError(user, 404, chanName)
        }
        
        return null
    }
    
    _leaveChan( user, chan )
    {
        chan.rm(user)
        // Send the chan change to old chan
        this._message.sendData(user, {chan: {id: -2}}, ...chan.users)
    }
    
    _joinChan( user, chan, pass = '' )
    {
        chan.add(user)
        
        // Send new chan data to user
        this._message.sendData(chan, chan.data, user)
        
        // send to all users in the chan the new user data
        this._message.sendData(user, user.data, ...chan.users)
    }

    /*_getDebugFunction()
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
    }*/
}