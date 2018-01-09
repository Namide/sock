class Chan
{
    /**
     * @param {String} name             Name of the channel
     * @param {String} pass             Pass of the channel
     * @param {Object} defaultChanData  Default datas of the channel
     * @returns {Chan}
     */
    constructor( pass = '', defaultChanData = {} )
    {
        this.type = 2
        this.pass = pass
	this.users = []
        this.subscribers = []   // user list that will be inform of chan changes
	        
        this.data = Object.assign({ id: ++Chan.id }, defaultChanData)
	
	this.onEmpty = null
        this.onNewMod = null
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
        }
        
	user.setChan( this )
	
        this._update()
    }
    
    /**
     * Remove an user from the channel
     * 
     * @param {User} user
     * @public
     */
    rm( user )
    {
        const userIndex = this.users.indexOf(user)
        if (userIndex > -1)
        {
            this.users.splice(userIndex, 1)
            user.setChan( null )
            this._update()
        } 
    }
    
    /**
     * Test if the user can be added to this channel
     * 
     * @param {User} user
     * @returns {Boolean}
     */
    canAdd( user )
    {
        return this.users.length < this.data.userMax
    }
    
    /**
     * Chack if the channel has one moderator (user's role > 0) ; If it's don't
     * have, a new moderator it's added and the data it's dispatched.
     * @private
     */
    _update()
    {
        if (this.users.length < this.data.userMin)
        {
            if (this.onEmpty !== null)
            {
                this.onEmpty()
            }
	}
	else if (this.data.modEnabled && !this._hasMod())
        {
            this._addMod()
        }
    }
    
    /**
     * Add a new moderator of the channel
     * 
     * @param {User} user
     * @returns {Boolean}       A new moderator has bin added
     * @public
     */
    addmod( user = null )
    {
        if (!this.data.modEnabled)
        {
            return false
        }
		
	if (user === null)
        {
            user = this.users[0]
        }
	
	if (user.getRole() < 1)
        {
            user.setRole(1)
            if (this.onNewMod !== null)
            {
                this.onNewMod(user)
            }
        }
        
        return true
    }
    
    /**
     * One or more users in this channel are moderator or administrator.
     * 
     * @return {Boolean}        This chan has a moderator
     * @public
     */
    hasMod()
    {
        return this.users.find( u => u.getRole() > 0 ) !== undefined
    }
}

Chan.id = -1

export default Chan