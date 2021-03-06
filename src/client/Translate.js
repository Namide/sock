const MESSAGE_LIST = {

    0: {en: 'Can not connect',
        fr: 'Connexion impossible'},

    1: {en: 'Client undefined error ($1)',
        fr: 'Erreur client indéfinie ($1)'},

    2: {en: 'Data parsing stopped: transferred data incomplete',
        fr: 'Analyse des données stoppé, données transférées incomplêtes'},

    3: {en: 'You are connected!',
        fr: 'Vous êtes connecté !'},

    4: {en: 'You are disconnected!',
        fr: 'Vous êtes déconnecté !'},

    5: {en: 'Connection server error',
        fr: 'Erreur de connexion avec le serveur'},

    // Commands
    101: {en: 'Command label undefined ($1)',
          fr: 'Commande indéfinie ($1)'},

    102: {en: 'Unknown command ($1)',
          fr: 'Commande inconnue ($1)'},

    201: {en: 'Message to user $1 error (text or user name empty)',
          fr: 'Erreur d\'envoie de message à l\'utilisateur $1 (texte ou nom d\'utilisateur manquant)'},

    // Users
    301: {en: 'User not found',
          fr: 'L\'utilisateur n\'a pas été trouvé'},

    302: {en: 'You don\'t have permission to change chan data $1',
          fr: 'Vous n\'avez pas la permission de changer les données du salon $1'},

    303: {en: 'You can only use alphanumeric, hyphen and underscore between 3 and 10 characters in an user name but you have write $1',
          fr: 'Pour un nom d\'utilisateur vous ne pouvez utiliser que des caractères latin standarts (minuscules, majuscules), des chiffres, des tirets et des underscores entre 3 et 10 caractères mais vous avez écris $1'},

    304: {en: 'Name undefined',
          fr: 'Nom indéfinis'},

    305: {en: 'The name $1 is already used',
          fr: 'Le nom $1 est déjà utilisé'},

    306: {en: 'Name undefined',
          fr: 'Nom indéfinis'},

    307: {en: 'You can\'t change your role',
          fr: 'Vous ne pouvez pas changer votre rôle'},

    308: {en: 'A user event must have a label property ($1)',
          fr: 'Un évênement utilisateur doit avoir une propriété \'label\' ($1)'},

    309: {en: 'You can\'t change the role of $1 if you are not moderator',
          fr: 'Vous ne pouvez pas changer le role de $1 si vous n\'êtes pas modérateur'},

    310: {en: 'You don\'t have permission to change data $1 of $2',
          fr: 'Vous n\'avez pas la permission de changer la donnée $1 de $2'},

    311: {en: 'You don\'t have permission to kick $1 from $2',
          fr: 'Vous n\'avez pas la permission d\'expulser $1 du salon $2'},

    312: {en: '$1 is already $2',
          fr: '$1 est déjà $2'},

    // Chan
    401: {en: 'You don\'t have permission to change the pass of the chan',
          fr: 'Vous n\'avez pas la permission de changer le mot de passe du salon'},

    402: {en: 'The name $1 is already used',
          fr: 'Le nom $1 est déjà utilisé'},

    403: {en: 'Name undefined',
          fr: 'Nom indéfinis'},

    404: {en: 'You can only use alphanumeric, hyphen and underscore between 3 and 10 characters in a chan name but you have write $1',
          fr: 'Pour un nom de salon vous ne pouvez utiliser que des caractères latin standarts (minuscules, majuscules), des chiffres, des tirets et des underscores entre 3 et 10 caractères mais vous avez écris $1'},

    405: {en: 'A chan event must have a label property ($1)',
          fr: 'Un évênement de salon doit avoir une propriété \'label\' ($1)'},

    406: {en: 'You can\'t join the chan $1',
          fr: 'Vous n\'êtes pas autorisé à rejoindre le salon $1)'},

    407: {en: 'You can\'t create the chan $1',
          fr: 'Il est impossible de créer le salon $1)'},

    // Messages
    501: {en: '$1 change his name to $2',
          fr: '$1 s\'appele désormais $2'},

    502: {en: '$1 has been kicked by $2',
          fr: '$1 a été expulsé par $2'},

    503: {en: 'You have been kicked by $1',
          fr: 'Vous avez été expulsé par $1'},

    504: {en: '$1 leave the chan $2',
          fr: '$1 a quitté le salon $2'},

    505: {en: '$1 join the chan $2',
          fr: '$1 a rejoind le salon $2'}
}

export default class Translate
{
    constructor( lang )
    {
        this.lang = lang
    }
    
    get( id, ...datas )
    {
        const lang = this.lang
        
        if (MESSAGE_LIST[id] == undefined || MESSAGE_LIST[id][lang] == undefined) {
            id = 1;
            data = ['id: ' + id];
	}
        
        let raw = MESSAGE_LIST[id][lang]
	let i = datas.length;
	while (--i > -1)
        {
            raw = raw.replace('$' + (i + 1), datas[i])
	}
	
	return raw
    }
    
    /**
     * Add a new message for the code. Example:
     * 
     * const message1 = {
     *  en: 'You are to young to connect here',
     *  fr: 'Tu es trop jeune pour te connecter ici'
     * }
     * add( 1001, message1 }
     * 
     * const message2 = {
     *  en: 'You are killed by $1 assisted by $2',
     *  fr: 'Tu as été tué par $1 assisté de $2'
     * }
     * add( 1002, message2 }
     * 
     * 
     * 
     * @param {Integer} code        Code message
     * @param {Object} messages     Object contain messages by language
     * @returns {undefined}
     */
    add( code, messages )
    {
        if (MESSAGE_LIST[code] != null)
        {
            console.warn(`The error code ${code} already exist`)
        }
        else
        {
            MESSAGE_LIST[code] = messages
        }
    }
}