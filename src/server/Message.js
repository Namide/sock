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

class Message {
    
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
            i: 1,
            f: 3,
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
            i: 2,   // 2 = data
            f: item.type,
            m: Object.assign( {id: from.data.id}, data )
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
            i: 3,   // 3 = list
            f: itemType,
            m: list
        }
	
	this._send(msg, ...to);
    }
    
    _send( msg, ...user )
    {
	const str = JSON.stringify(msg)
        
        let i = user.length
        while (--i > -1)
        {
            user[i].sendMsg(str)
        }
    }
}

export default Message
