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

class Parser {
    
    constructor()
    {
        this.onServerData = (msg) => {}
        this.onChanData = (chanTargetId, msg) => {}
        this.onUserData = (userTargetId, msg) => {}
        
        this.onServerEvent = (label, msg) => {}
        this.onChanEvent = (userTargetId, label, msg) => {}
        this.onUserEvent = (userTargetId, label, msg) => {}
        
        this.onServerList = (list) => {}
        this.onChanList = (list) => {}
        
        this.onError = (code) => {}
    }
    
    /**
     * 
     * @param {User} from
     * @param {String} data
     */
    check( data )
    {
        try
        {
            const msg = JSON.parse(data)
            this._checkMsg(msg)
	}
        catch(e)
        {
            this.onError(2)
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
    
    _dispatchMsg( msgType, fromType, targetId, label, msg )
    {
        const code = parseInt(msgType + 10 * fromType)
        
        switch( code )
        {
            case 11:    // event for user
            {
                this.onUserEvent(targetId, label, msg)
                break
            }
            case 12:    // event for chan
            {
                this.onChanEvent(targetId, label, msg)
                break
            }
            case 13:    // event for server
            {
                this.onServerEvent(label, msg)
                break
            }
            case 21:    // data for user
            {
                this.onUserData(targetId, msg)
                break
            }
            case 22:    // data for chan
            {
                this.onChanData(targetId, msg)
                break
            }
            case 23:    // data for server
            {
                this.onServerData(msg)
                break
            }
            /*case 31:    // list for user
            {
                
                break
            }*/
            case 32:    // list for chan
            {
                this.onChanList(msg)
                break
            }
            case 33:    // list for server
            {
                this.onServerList(msg)
                break
            }
            default:
            {
                console.warn(`Parser error: the combination message type: ${msgType} and from type: ${fromType} does'nt exist`)
                this.onError(2)
            }
        }
    }
    
    _checkMsg( data )
    {
        const { type: i, from: f, label: l, target: t, msg: m } = data
        
        // Get target type
       const { targetType: type, targetId: id } = this._getTypeIdByData(from)
        
        
        if (!Number.isInteger(type) || !Number.isInteger(targetType))
        {
            console.warn('Parser error: message must have type and target type')
            this.onError(2)
        }
        else if (type < 1 || type > 3 || targetType < 1 || targetType > 3)
        {
            console.warn('Parser error: message type and target type must be scoped between 0 and 4')
            this.onError(2)
        }
        else
        {
            this._dispatchMsg(type, targetType, targetId, label, msg)
        }
    }
}

export default Parser
