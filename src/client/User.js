export default class User
{
    constructor()
    {
        this.data = {}
	
	this.onDataNameChange = temp => {}
	this.onDataChange = temp => {}
        this.onLeave = temp => {}
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
}