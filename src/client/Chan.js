export default class Chan
{
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