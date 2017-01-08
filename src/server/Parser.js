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
        const code = (msgType + 10 * targetType)
        
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
        let { targetType: type, targetId: id } = this._getTypeIdByData(target)
        
        
        if (!Number.isInteger(type) || !Number.isInteger(targetType))
        {
            this.onError(user, `Parser error: message must have type and target type`)
        }
        else if (type < 1 || type > 3 || targetType < 1 || tType > 3)
        {
            this.onError(user, `Parser error: message type and target type must be scoped between 0 and 4`)
        }
        else
        {
            this._dispatchMsg(user, type, targetType, targetId, label, msg)
        }
    }
}

export default Parser
