export default class Parser
{
    constructor()
    {
        this.onServerData = (userEmiter, msg) => {}
        this.onChanData = (userEmiter, chanTargetId, msg) => {}
        this.onUserData = (userEmiter, userTargetId, msg) => {}
        
        this.onServerSubscribe = (user) => {}
        this.onServerUnsubscribe = (user) => {}
        this.onChanSubscribe = (user, chanTargetId) => {}
        this.onChanUnsubscribe = (user, chanTargetId) => {}
        
        this.onServerEvent = (userEmiter, label, msg) => {}
        this.onChanEvent = (userEmiter, chanTargetId, label, msg) => {}
        this.onUserEvent = (userEmiter, userTargetId, label, msg) => {}
        
        this.onError = (user, errorMsg) => {}
    }
    
    /**
     * 
     * @param {User} from
     * @param {Object} data
     */
    check( from, data )
    {
        try
        {
            const msg = JSON.parse(data);
            this._checkMsg( from, msg )
	}
        catch(e)
        {
            this.onError(from, `Json error: ${e.message}`)
        }
    }
    
    _getTypeIdByData( data )
    {
        let type = null
        let id = null

        if (Number.isInteger(data))
        {
            type = data
        }
        else
        {
            type = data.y
            id = data.i || null
        }
        
        return { type, id }
    }   
    
    _dispatchMsg( user, msgType, targetType, targetId, label, msg )
    {
        const code = parseInt(msgType + 10 * targetType)
        
        switch( code )
        {
            case 11:    // event for user
            {
                this.onUserEvent(user, targetId, label, msg)
                break
            }
            case 12:    // event for chan
            {
                this.onChanEvent(user, targetId, label, msg)
                break
            }
            case 13:    // event for server
            {
                this.onServerEvent(user, label, msg)
                break
            }
            case 21:    // data for user
            {
                this.onUserData(user, targetId, msg)
                break
            }
            case 22:    // data for chan
            {
                this.onChanData(user, targetId, msg)
                break
            }
            case 23:    // data for server
            {
                this.onServerData(user, msg)
                break
            }
            /*case 31:    // list for user
            {
                
                break
            }*/
            case 32:    // list for chan
            {
                if (label === 0)
                {
                    this.onChanUnsubscribe(user, targetId)
                }
                else if (label === 1)
                {
                    this.onChanSubscribe(user, targetId)
                }
                else
                {
                    this.onError(user, `Parser error: for chan list the label: ${label} does'nt exist`)
                }
                
                break
            }
            case 33:    // list for server
            {
               if (label === 0)
                {
                    this.onServerUnsubscribe(user)
                }
                else if (label === 1)
                {
                    this.onServerSubscribe(user)
                }
                else
                {
                    this.onError(user, `Parser error: for chan list the label: ${label} does'nt exist`)
                }
                
                break
            }
            default:
            {
                this.onError(user, `Parser error: the combination message type: ${msgType} and target type: ${targetType} does'nt exist`)
            }
        }
    }
    
    _checkMsg( user, data )
    {
        const { type: i, label: l, target: t, msg: m } = data
        
        // Get target type
        const { targetType: type, targetId: id } = this._getTypeIdByData(target)
        
        
        if (!Number.isInteger(type) || !Number.isInteger(targetType))
        {
            this.onError(user, 'Parser error: message must have type and target type')
        }
        else if (type < 1 || type > 3 || targetType < 1 || targetType > 3)
        {
            this.onError(user, 'Parser error: message type and target type must be scoped between 0 and 4')
        }
        else
        {
            this._dispatchMsg(user, type, targetType, targetId, label, msg)
        }
    }
}