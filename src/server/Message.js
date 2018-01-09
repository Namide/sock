export default class Message
{
    constructor()
    {
        // this.onLog = null
    }
    
    sendError( errorId, data, ...to )
    {
        if (!Array.isArray(data))
        {
            data = [data]
        }
        
        const msg = {
            y: 1,
            t: 3,
            l: 'error',
            m: {
                vars: data,
                id: errorId
            }
        }
        
        this._send(msg, ...to)
    }
    
    /**
     * 
     * @param {Chan|User} item
     * @param {Object} data
     * @param {User[]} to
     */
    sendData( item, data, ...to )
    {
        const msg = {
            y: 2,   // 2 = data
            t: item.type,
            m: Object.assign( {id: item.data.id}, data )
        }
        
        this._send(msg, ...to)
    }
    
    /**
     * 
     * @param {integer} itemType
     * @param {Object[]} list
     * @param {User[]} to
     */
    sendList( itemType, list, ...to )
    {
        const msg = {
            y: 3,   // 3 = list
            t: itemType,
            m: list
        }
	
	this._send(msg, ...to);
    }
    
    _send( msg, ...users )
    {
	const str = JSON.stringify(msg)
        
        for(const user of users)
        {
            user.sendMsg(str)
        }
    }
}