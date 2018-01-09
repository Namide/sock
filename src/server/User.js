class User
{
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