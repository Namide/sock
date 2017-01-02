/* 
 * The MIT License
 *
 * Copyright 2016 Damien Doussaud (namide.com).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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

class ErrorCode {
    
    constructor( lang )
    {
        this.lang = lang
    }
    
    translate( id, ...data )
    {
        const lang = this.lang
        
        if (MESSAGE_LIST[id] == undefined || MESSAGE_LIST[id][lang] == undefined) {
            id = 1;
            data = ['id: ' + id];
	}
        
        let raw = MESSAGE_LIST[id][lang]
	let i = data.length;
	while (--i > -1)
        {
            raw = raw.replace('$' + (i + 1), data[i]);
	}
	
	return raw
    }
}

export default ErrorCode
