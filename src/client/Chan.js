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

class Chan {
    
    /**
     * @param {String} name             Name of the channel
     * @param {String} pass             Pass of the channel
     * @param {Object} defaultChanData  Default datas of the channel
     * @returns {Chan}
     */
    constructor( id )
    {
        this.users = []
        this.data = { id }
    }
    
    /**
     * Add a new user in the channel
     * 
     * @param {User} user
     * @public
     */
    add( user )
    {        
        const users = this.users
	if (users.indexOf(user) < 0)
        {
            users.push(user)
            return true
        }
        return false
    }
    
    remove( user )
    {
        const users = this.users
	const i = users.indexOf(user)
        if (i > -1)
        {
            users.splice(i, 1)
            return true
        }
        return false
    }
    
    replaceUsers( newUsers )
    {
	this.users = newUsers
    }
    
}

export default Chan
