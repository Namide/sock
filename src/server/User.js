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

class User {
    
    constructor( socket )
    {
        this.type = 1
        this.socket = socket
	this.chan = null
        this.data = { id: ++User.id }
        
        this.sendMsg = str => {}
        this.onMsg = (str, flags) => {}
        this.onClose = str => {}
    }
    
    /**
     * Set user data
     * 
     * @param {Object} data
     * @public
     */
    setData( data )
    {
        this.data = Object.assign(this.data, data)
    }
    
    /**
     * Set the chan of the user
     * 
     * @param {Chan} chan
     * @public
     */
    setChan( chan = null )
    {
        this.chan = chan
        
        if (chan)
        {
            const chanData = chan.data
            this.data.chan = {
                id: chanData.id,
                name: chanData.name
            }
            
            if (this.getRole() === 1)
            {
                this.setRole(0)
            }
        }
        else
        {
            this.data.chan = null
        }
    }
    
    /**
     * Get the role of the user:
     * - 0 > Simple user
     * - 1 > Moderator: It's the manager of his channel
     * - 2 > Admin: It's the manager of the server
     * 
     * @returns {Integer}
     * @public
     */
    getRole()
    {
        return this.data.role || 0
    }
    
    /**
     * Change the role of the user:
     * - 0 > Simple user
     * - 1 > Moderator: It's the manager of his channel
     * - 2 > Admin: It's the manager of the server
     * 
     * @param {Integer} role
     * @public
     */
    setRole( role )
    {
        this.data.role = role
    }
}

User.id = -1

export default User
