(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Chan = function () {

    /**
     * @param {String} name             Name of the channel
     * @param {String} pass             Pass of the channel
     * @param {Object} defaultChanData  Default datas of the channel
     * @returns {Chan}
     */
    function Chan(id) {
        _classCallCheck(this, Chan);

        this.users = [];
        this.data = { id: id };
    }

    /**
     * Add a new user in the channel
     * 
     * @param {User} user
     * @public
     */


    _createClass(Chan, [{
        key: "add",
        value: function add(user) {
            var users = this.users;
            if (users.indexOf(user) < 0) {
                users.push(user);
                return true;
            }
            return false;
        }
    }, {
        key: "remove",
        value: function remove(user) {
            var users = this.users;
            var i = users.indexOf(user);
            if (i > -1) {
                users.splice(i, 1);
                return true;
            }
            return false;
        }
    }, {
        key: "replaceUsers",
        value: function replaceUsers(newUsers) {
            this.users = newUsers;
        }
    }]);

    return Chan;
}();

exports.default = Chan;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Parser = function () {
    function Parser() {
        _classCallCheck(this, Parser);

        this.onServerData = function (msg) {};
        this.onChanData = function (chanTargetId, msg) {};
        this.onUserData = function (userTargetId, msg) {};

        this.onServerEvent = function (label, msg) {};
        this.onChanEvent = function (userTargetId, label, msg) {};
        this.onUserEvent = function (userTargetId, label, msg) {};

        this.onServerList = function (list) {};
        this.onChanList = function (list) {};

        this.onError = function (code) {};
    }

    /**
     * 
     * @param {User} from
     * @param {String} data
     */


    _createClass(Parser, [{
        key: 'check',
        value: function check(data) {
            try {
                var msg = JSON.parse(data);
                this._checkMsg(msg);
            } catch (evt) {
                this.onError(2);
                console.error(evt, data);
            }
        }
    }, {
        key: '_getTypeIdByData',
        value: function _getTypeIdByData(data) {
            var type = null;
            var id = null;

            if (Number.isInteger(data)) {
                type = data;
            } else {
                type = data.y;
                id = data.i || null;
            }

            return { type: type, id: id };
        }
    }, {
        key: '_dispatchMsg',
        value: function _dispatchMsg(msgType, fromType, targetId, label, msg) {
            var code = parseInt(msgType + 10 * fromType);

            switch (code) {
                case 11:
                    // event for user
                    {
                        this.onUserEvent(targetId, label, msg);
                        break;
                    }
                case 12:
                    // event for chan
                    {
                        this.onChanEvent(targetId, label, msg);
                        break;
                    }
                case 13:
                    // event for server
                    {
                        this.onServerEvent(label, msg);
                        break;
                    }
                case 21:
                    // data for user
                    {
                        this.onUserData(targetId, msg);
                        break;
                    }
                case 22:
                    // data for chan
                    {
                        this.onChanData(targetId, msg);
                        break;
                    }
                case 23:
                    // data for server
                    {
                        this.onServerData(msg);
                        break;
                    }
                /*case 31:    // list for user
                {
                    
                    break
                }*/
                case 32:
                    // list for chan
                    {
                        this.onChanList(msg);
                        break;
                    }
                case 33:
                    // list for server
                    {
                        this.onServerList(msg);
                        break;
                    }
                default:
                    {
                        console.warn('Parser error: the combination message type: ' + msgType + ' and from type: ' + fromType + ' does\'nt exist');
                        this.onError(2);
                    }
            }
        }
    }, {
        key: '_checkMsg',
        value: function _checkMsg(data) {
            var type = data.y,
                label = data.l,
                target = data.t,
                msg = data.m;

            // Get target type

            var _getTypeIdByData2 = this._getTypeIdByData(target),
                targetType = _getTypeIdByData2.type,
                targetId = _getTypeIdByData2.id;

            if (!Number.isInteger(type) || !Number.isInteger(targetType)) {
                console.warn('Parser error: message must have type and target type');
                this.onError(2);
            } else if (type < 1 || type > 3 || targetType < 1 || targetType > 3) {
                console.warn('Parser error: message type and target type must be scoped between 0 and 4');
                this.onError(2);
            } else {
                this._dispatchMsg(type, targetType, targetId, label, msg);
            }
        }
    }]);

    return Parser;
}();

exports.default = Parser;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var MESSAGE_LIST = {

      0: { en: 'Can not connect',
            fr: 'Connexion impossible' },

      1: { en: 'Client undefined error ($1)',
            fr: 'Erreur client indéfinie ($1)' },

      2: { en: 'Data parsing stopped: transferred data incomplete',
            fr: 'Analyse des données stoppé, données transférées incomplêtes' },

      3: { en: 'You are connected!',
            fr: 'Vous êtes connecté !' },

      4: { en: 'You are disconnected!',
            fr: 'Vous êtes déconnecté !' },

      5: { en: 'Connection server error',
            fr: 'Erreur de connexion avec le serveur' },

      // Commands
      101: { en: 'Command label undefined ($1)',
            fr: 'Commande indéfinie ($1)' },

      102: { en: 'Unknown command ($1)',
            fr: 'Commande inconnue ($1)' },

      201: { en: 'Message to user $1 error (text or user name empty)',
            fr: 'Erreur d\'envoie de message à l\'utilisateur $1 (texte ou nom d\'utilisateur manquant)' },

      // Users
      301: { en: 'User not found',
            fr: 'L\'utilisateur n\'a pas été trouvé' },

      302: { en: 'You don\'t have permission to change chan data $1',
            fr: 'Vous n\'avez pas la permission de changer les données du salon $1' },

      303: { en: 'You can only use alphanumeric, hyphen and underscore between 3 and 10 characters in an user name but you have write $1',
            fr: 'Pour un nom d\'utilisateur vous ne pouvez utiliser que des caractères latin standarts (minuscules, majuscules), des chiffres, des tirets et des underscores entre 3 et 10 caractères mais vous avez écris $1' },

      304: { en: 'Name undefined',
            fr: 'Nom indéfinis' },

      305: { en: 'The name $1 is already used',
            fr: 'Le nom $1 est déjà utilisé' },

      306: { en: 'Name undefined',
            fr: 'Nom indéfinis' },

      307: { en: 'You can\'t change your role',
            fr: 'Vous ne pouvez pas changer votre rôle' },

      308: { en: 'A user event must have a label property ($1)',
            fr: 'Un évênement utilisateur doit avoir une propriété \'label\' ($1)' },

      309: { en: 'You can\'t change the role of $1 if you are not moderator',
            fr: 'Vous ne pouvez pas changer le role de $1 si vous n\'êtes pas modérateur' },

      310: { en: 'You don\'t have permission to change data $1 of $2',
            fr: 'Vous n\'avez pas la permission de changer la donnée $1 de $2' },

      311: { en: 'You don\'t have permission to kick $1 from $2',
            fr: 'Vous n\'avez pas la permission d\'expulser $1 du salon $2' },

      312: { en: '$1 is already $2',
            fr: '$1 est déjà $2' },

      // Chan
      401: { en: 'You don\'t have permission to change the pass of the chan',
            fr: 'Vous n\'avez pas la permission de changer le mot de passe du salon' },

      402: { en: 'The name $1 is already used',
            fr: 'Le nom $1 est déjà utilisé' },

      403: { en: 'Name undefined',
            fr: 'Nom indéfinis' },

      404: { en: 'You can only use alphanumeric, hyphen and underscore between 3 and 10 characters in a chan name but you have write $1',
            fr: 'Pour un nom de salon vous ne pouvez utiliser que des caractères latin standarts (minuscules, majuscules), des chiffres, des tirets et des underscores entre 3 et 10 caractères mais vous avez écris $1' },

      405: { en: 'A chan event must have a label property ($1)',
            fr: 'Un évênement de salon doit avoir une propriété \'label\' ($1)' },

      406: { en: 'You can\'t join the chan $1',
            fr: 'Vous n\'êtes pas autorisé à rejoindre le salon $1)' },

      407: { en: 'You can\'t create the chan $1',
            fr: 'Il est impossible de créer le salon $1)' },

      // Messages
      501: { en: '$1 change his name to $2',
            fr: '$1 s\'appele désormais $2' },

      502: { en: '$1 has been kicked by $2',
            fr: '$1 a été expulsé par $2' },

      503: { en: 'You have been kicked by $1',
            fr: 'Vous avez été expulsé par $1' },

      504: { en: '$1 leave the chan $2',
            fr: '$1 a quitté le salon $2' },

      505: { en: '$1 join the chan $2',
            fr: '$1 a rejoind le salon $2' }
};

var Translate = function () {
      function Translate(lang) {
            _classCallCheck(this, Translate);

            this.lang = lang;
      }

      _createClass(Translate, [{
            key: 'get',
            value: function get(id) {
                  var lang = this.lang;

                  if (MESSAGE_LIST[id] == undefined || MESSAGE_LIST[id][lang] == undefined) {
                        id = 1;
                        data = ['id: ' + id];
                  }

                  var raw = MESSAGE_LIST[id][lang];

                  for (var _len = arguments.length, datas = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        datas[_key - 1] = arguments[_key];
                  }

                  var i = datas.length;
                  while (--i > -1) {
                        raw = raw.replace('$' + (i + 1), datas[i]);
                  }

                  return raw;
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

      }, {
            key: 'add',
            value: function add(code, messages) {
                  if (MESSAGE_LIST[code] != null) {
                        console.warn('The error code ' + code + ' already exist');
                  } else {
                        MESSAGE_LIST[code] = messages;
                  }
            }
      }]);

      return Translate;
}();

exports.default = Translate;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var User = function () {
    function User() {
        _classCallCheck(this, User);

        this.data = {};

        this.onDataNameChange = function (temp) {};
        this.onDataChange = function (temp) {};
        this.onLeave = function (temp) {};
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


    _createClass(User, [{
        key: "getRole",
        value: function getRole() {
            return this.data.role || 0;
        }
    }]);

    return User;
}();

exports.default = User;

},{}],5:[function(require,module,exports){
'use strict';

var _client = require('./client.js');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.sock = _client2.default; /* 
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

},{"./client.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* 
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

var _Chan = require('./Chan.js');

var _Chan2 = _interopRequireDefault(_Chan);

var _User = require('./User.js');

var _User2 = _interopRequireDefault(_User);

var _Translate = require('./Translate.js');

var _Translate2 = _interopRequireDefault(_Translate);

var _Parser = require('./Parser.js');

var _Parser2 = _interopRequireDefault(_Parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
    function Client(URI) {
        var onConnected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var lang = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'en';

        _classCallCheck(this, Client);

        console.log(URI);
        this.users = []; // all, me too

        this.me = null;
        this.chan = null;

        this.uri = URI;
        this.translate = new _Translate2.default(lang);

        this.listChans = [];
        this.websocket = null;

        this._initDispatcher(onConnected, onError);
        this._initWebsocket();
        this._initParser();
    }

    _createClass(Client, [{
        key: '_initDispatcher',
        value: function _initDispatcher(onConnected, onError) {
            var _this = this;

            this.onConnected = onConnected || function (user) {
                _this.onLog('User connected');
            };
            this.onError = onError || function (msg) {
                console.error(msg);
            };

            this.onLog = function (msg) {
                console.log(msg);
            };
            this.onClose = function (msg) {
                _this.onLog('Socket closed');
            };
            this.onMsgUser = function (name, msg) {
                _this.onLog(name + ":" + msg);
            };
            this.onChanMsg = function (name, msg) {
                _this.onLog(name + ":" + msg);
            };
            this.onServerMsg = function (msg) {
                _this.onLog(msg);
            };
            this.onListChan = function (list) {
                _this.onLog(list);
            };
            this.onUserEvt = function (user, label, data) {
                _this.onLog(label);
            };
            this.onChanEvt = function (label, data) {
                _this.onLog(label);
            };
            this.onServerEvt = function (label, data) {
                _this.onLog(label);
            };
            this.onChanChange = function (chan) {
                _this.onLog('Chan changed');
            };
            this.onChanDataChange = function (data) {
                _this.onLog('data changed');
            };
            this.onChanUserList = function (list) {
                _this.onLog(list);
            };
        }
    }, {
        key: '_initParser',
        value: function _initParser() {
            var _this2 = this;

            this.parser = new _Parser2.default();
            this.parser.onError = function (errorCode) {
                _this2.onError(_this2.translate.get(errorCode));
            };

            /*
                this.parser.onChanEvent = (chanTargetId, label, msg) => {}
             */

            // EVENTS

            this.parser.onUserEvent = function (userTargetId, label, msg) {

                var user = _this2.getUserById(userTargetId);
                if (label === 'msg') {
                    _this2.onMsgUser(user.data.name, msg);
                } else {
                    _this2.onUserEvt(user, label, msg);
                }
            };

            this.parser.onChanEvent = function (userTargetId, label, msg) {

                var user = _this2.getUserById(userTargetId);
                if (label === 'msg') {
                    _this2.onChanMsg(user.data.name, msg);
                } else {
                    _this2.onChanEvt(label, msg);
                }
            };

            this.parser.onServerEvent = function (label, msg) {

                if (label === 'msg') {
                    _this2.onServerMsg(msg);
                } else if (label === 'error') {
                    var _translate;

                    _this2.onServerMsg((_translate = _this2.translate).get.apply(_translate, [msg.id].concat(_toConsumableArray(msg.vars))));
                } else {
                    _this2.onServerEvt(label, msg);
                }
            };

            this.parser.onChanList = function (list) {

                // Check if you have new players
                var userList = [];
                for (var userData in list) {
                    var user = _this2._updateUser(userData, false);
                    userList.push(user);
                }

                _this2.chan.replaceUsers(userList);
                _this2._dispatchChanUserList();
            };

            this.parser.onServerList = function (list) {

                _this2.listChans = list;
                _this2._dispatchServerChanList();
            };

            /* TODO
                    case "chan-added" :
                 if (this.listChans === undefined)
                        this.listChans = [];
                 this.listChans.push(d.data);
                this._dispatchServerChanList();
                 break;
             case "chan-removed" :
                 if (this.listChans === undefined)
                        this.listChans = [];
                 var i = this.listChans.indexOf(d.data);
                if (i > -1)
                        this.listChans.splice(i, 1);
                 this._dispatchServerChanList();
                 break;*/

            // DATAS
            this.parser.onChanData = function (chanTargetId, msg) {
                msg.id = chanTargetId;
                _this2._setChanData(msg);
            };

            this.parser.onUserData = function (userTargetId, msg) {
                msg.id = userTargetId;
                _this2._updateUser(msg);
            };

            this.parser.onServerData = function (msg) {
                console.warn('No update for server data');
            };
        }
    }, {
        key: '_initWebsocket',
        value: function _initWebsocket() {
            var _this3 = this;

            try {
                this.websocket = new WebSocket(this.uri);
                this.websocket.onclose = function (evt) {
                    _this3.onClose(evt.data);
                };
                this.websocket.onmessage = function (evt) {
                    _this3.parser.check(evt.data);
                };
                this.websocket.onerror = function (evt) {
                    _this3.onError(_this3.translate.get(5));
                };

                window.addEventListener('beforeunload', function (evt) {
                    _this3.close();
                }, false);
            } catch (e) {
                this.onError(this.translate.get(0));
                console.error(e.message);
            }
        }
    }, {
        key: '_send',
        value: function _send(data) {
            this.websocket.send(JSON.stringify(data));
        }

        /**
        * Send a message to the chan or to a user
        *
        * @param {string} msg		Your message
        * @param {User?} user		Facultative, if it's null: the message is send to all the chan
        */

    }, {
        key: 'sendMsg',
        value: function sendMsg(msg) {
            var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            return this.sendUserEvt('msg', msg, user);
        }

        /**
         * Send an event.
         * 
         * @param {String} label		Label of the event
         * @param {Object} data		Datas of the event
         * @param {User} user		Facultative, target of the event (if it's null, the target is you)
         */

    }, {
        key: 'sendUserEvt',
        value: function sendUserEvt(label, data) {
            var user = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (user === null) {
                return this._send({
                    y: 1,
                    l: label,
                    t: { y: 2, i: this.chan.data.id },
                    m: data
                });
            } else {
                return this._send({
                    y: 1,
                    l: label,
                    t: { y: 1, i: user.data.id },
                    m: data
                });
            }
        }

        /**
         * Change data(s) of a user
         *
         * @param {Object} data		Data with new information
         * @param {User?} user		Facultative, target: if null the target is you
         */

    }, {
        key: 'sendUserData',
        value: function sendUserData(data) {
            var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var t = {
                y: 1,
                i: user === null ? this.me.data.id : user.data.id
            };

            return this._send({
                y: 2,
                t: t,
                m: data
            });
        }

        /**
         * Send an event to the chan.
         *
         * @param {String} label	Label of the event
         * @param {Object} data		Datas of the event
         */

    }, {
        key: 'sendChanEvt',
        value: function sendChanEvt(label, data) {
            return this._send({
                y: 1,
                l: label,
                t: { y: 2, i: this.chan.data.id },
                m: data
            });
        }
    }, {
        key: 'sendChanData',


        /**
         * Change a data of the chan (you must to have the moderator of the chan)
         *
         * @param {Object} data		New data to change
         */
        value: function sendChanData(data) {
            var t = {
                y: 2,
                i: this.chan.data.id
            };

            return this._send({
                y: 2,
                t: t,
                m: data
            });
        }

        /**
        * Get all the chans of the server (asynchronus function)
        * 
        * @param {function} callback		Function called when the list is return (like onListChan)
        */

    }, {
        key: 'listenChanList',
        value: function listenChanList(callback) {
            this.onListChan = callback;
            this.listChans = [];
            this._send({
                y: 3,
                t: 2,
                l: 1
            });
        }

        /**
        * Stop listen the chan list
        */

    }, {
        key: 'stopListenChans',
        value: function stopListenChans() {
            this._send({
                y: 3,
                t: 2,
                l: 0
            });
            this.onListChan = null;
        }

        /**
        * Change the chan.
        *
        * @param {String} chanName		Name of the new chan
        * @param {String?} chanPass		Facultative pass of the new chan
        */

    }, {
        key: 'joinChan',
        value: function joinChan(chanName) {
            var chanPass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            this.sendUserData({
                chan: {
                    name: chanName,
                    pass: chanPass
                }
            });
        }

        /**
         * Change your name.
         *
         * @param {string} newName		Your new name
         * @param {function} callback	Called when the name is changed
         */

    }, {
        key: 'changeUserName',
        value: function changeUserName(newName, callback) {
            this.me.onDataNameChange = callback;
            this.sendUserData({
                name: newName
            });
        }

        /**
         * Change the name of the chan.
         *
         * @param {string} newName		New name of the chan
         */

    }, {
        key: 'changeChanName',
        value: function changeChanName(newName) {
            this.sendChanData({
                name: chanName
            });
        }

        /**
         * Kick a user out of the chan (only if you are moderator)
         *
         * @param {User} user		User to kick
         */

    }, {
        key: 'kickUser',
        value: function kickUser(user) {
            this.sendUserData({ chan: { id: -1 } }, user);
        }

        /**
         * Up a user to be moderator (only if you are moderator)
         *
         * @param {user} user		User to be moderator
         */

    }, {
        key: 'upToModerator',
        value: function upToModerator(user) {
            this.sendUserData({ role: 1 }, user);
        }
    }, {
        key: 'close',
        value: function close() {
            this.websocket.close();
        }
    }, {
        key: 'removeUser',
        value: function removeUser(user) {
            var i = this.users.indexOf(user);
            if (userI > -1) {
                this.users.splice(userI, 1);
                this.chan.removeUser(user);

                return true;
            }

            return false;
        }
    }, {
        key: 'getUserByName',
        value: function getUserByName(name) {
            return this.users.find(function (u) {
                return u.data.name === name;
            }) || null;
        }
    }, {
        key: 'getUserById',
        value: function getUserById(id) {
            return this.users.find(function (u) {
                return u.data.id === id;
            }) || null;
        }
    }, {
        key: '_updateUser',
        value: function _updateUser(data) {
            var dispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (this.me == null) {
                this.me = new _User2.default();
                this._setUserData(data, this.me, false);

                if (dispatch) {
                    this._dispatchConnected();
                }

                this.onServerMsg(this.trad.get(3));
                return this.me;
            }

            var u = this.getUserById(data.id);
            if (u !== null) {
                this._setUserData(data, u);
            } else {
                u = new _User2.default();
                this._setUserData(data, u);

                if (dispatch) {
                    this._dispatchChanUserList();
                }
            }

            return u;
        }
    }, {
        key: '_dispatchUserDataChange',
        value: function _dispatchUserDataChange(user, data) {
            if (user.onDataChange != null) {
                user.onDataChange(data);
            }

            if (this.onUserDataChange != null) {
                this.onUserDataChange(user, data);
            }
        }

        /**
         * @api private
         */

    }, {
        key: '_dispatchChanUserList',
        value: function _dispatchChanUserList() {
            if (this.onChanUserList) {
                this.onChanUserList(this.chan.users);
            }
        }

        /**
         * @api private
         */

    }, {
        key: '_dispatchServerChanList',
        value: function _dispatchServerChanList() {
            if (this.onListChan) {
                this.onListChan(this.listChans);
            }
        }

        /**
         * @api private
         */

    }, {
        key: '_dispatchConnected',
        value: function _dispatchConnected() {
            if (this.onConnected) {
                this.onConnected(this.me);
            }
        }

        /**
         * @api private
         */

    }, {
        key: '_dispatchChanChange',
        value: function _dispatchChanChange() {
            if (this.onChanDataChange) {
                this.onChanDataChange(this.chan.data);
            }

            if (this.onChanChange) {
                this.onChanChange(this.chan);
            }

            this._dispatchChanUserList();
            this._dispatchServerChanList();
        }

        /**
         * @api private
         */

    }, {
        key: '_setUserData',
        value: function _setUserData(data, user) {
            var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (data.id != null) {
                user.data.id = data.id;
            }

            for (var key in data) {
                if (key === "name") {
                    var oldName = user.data.name;
                    user.data.name = data.name;

                    if (dispatch) {
                        if (user.onDataNameChange != null && data.name != oldName) {
                            user.onDataNameChange();
                        }

                        if (oldName != null && oldName != data.name) {
                            this.onServerMsg(this.trad.get(501, [oldName, data.name]));
                        }

                        this._dispatchChanUserList();
                    }
                } else if (key === "chan") {
                    if (user !== this.me) {
                        if (data.chan.id !== this.chan.data.id) {
                            this.chan.remove(user);
                            this.onServerMsg(this.trad.get(504, [user.data.name, this.chan.data.name]));

                            if (dispatch) {
                                this._dispatchChanUserList();
                            }
                        } else {
                            this.chan.join(user);
                            this.onServerMsg(this.trad.get(505, [user.data.name, this.chan.data.name]));

                            if (dispatch) {
                                this._dispatchChanUserList();
                            }
                        }
                    }
                } else {
                    user.data[key] = data[key];
                }
            }

            this._dispatchUserDataChange(user, data);
        }

        /**
         * @api private
         */

    }, {
        key: '_setChanData',
        value: function _setChanData(data) {
            var newChan = false;
            if (this.chan == null || this.chan.data.id !== data.id) {
                this.chan = new _Chan2.default(data.id);
                newChan = true;
            }

            for (var key in data) {
                this.chan.data[key] = data[key];
            }

            if (newChan) {
                this._dispatchChanChange();
            } else if (this.onChanDataChange) {
                this.onChanDataChange(data);
            }
        }
    }]);

    return Client;
}();

exports.default = Client;

},{"./Chan.js":1,"./Parser.js":2,"./Translate.js":3,"./User.js":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGNsaWVudFxcQ2hhbi5qcyIsInNyY1xcY2xpZW50XFxQYXJzZXIuanMiLCJzcmNcXGNsaWVudFxcVHJhbnNsYXRlLmpzIiwic3JjXFxjbGllbnRcXFVzZXIuanMiLCJzcmNcXGNsaWVudFxcYXBwLmpzIiwic3JjXFxjbGllbnRcXGNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JNLEk7O0FBRUY7Ozs7OztBQU1BLGtCQUFhLEVBQWIsRUFDQTtBQUFBOztBQUNJLGFBQUssS0FBTCxHQUFhLEVBQWI7QUFDQSxhQUFLLElBQUwsR0FBWSxFQUFFLE1BQUYsRUFBWjtBQUNIOztBQUVEOzs7Ozs7Ozs7OzRCQU1LLEksRUFDTDtBQUNJLGdCQUFNLFFBQVEsS0FBSyxLQUFuQjtBQUNQLGdCQUFJLE1BQU0sT0FBTixDQUFjLElBQWQsSUFBc0IsQ0FBMUIsRUFDTztBQUNJLHNCQUFNLElBQU4sQ0FBVyxJQUFYO0FBQ0EsdUJBQU8sSUFBUDtBQUNIO0FBQ0QsbUJBQU8sS0FBUDtBQUNIOzs7K0JBRU8sSSxFQUNSO0FBQ0ksZ0JBQU0sUUFBUSxLQUFLLEtBQW5CO0FBQ1AsZ0JBQU0sSUFBSSxNQUFNLE9BQU4sQ0FBYyxJQUFkLENBQVY7QUFDTyxnQkFBSSxJQUFJLENBQUMsQ0FBVCxFQUNBO0FBQ0ksc0JBQU0sTUFBTixDQUFhLENBQWIsRUFBZ0IsQ0FBaEI7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxtQkFBTyxLQUFQO0FBQ0g7OztxQ0FFYSxRLEVBQ2Q7QUFDSCxpQkFBSyxLQUFMLEdBQWEsUUFBYjtBQUNJOzs7Ozs7a0JBSVUsSTs7Ozs7Ozs7Ozs7OztBQzFFZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JNLE07QUFFRixzQkFDQTtBQUFBOztBQUNJLGFBQUssWUFBTCxHQUFvQixV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c0IsS0FBSyxFQUFwRCxFQUNBO0FBQ0kscUJBQUssSUFBTCxHQUFZLG1CQUFTLEtBQUssRUFBZCxDQUFaO0FBQ0EsMEJBQVUsSUFBVjtBQUNIOztBQUVELGlCQUFLLElBQU0sR0FBWCxJQUFrQixJQUFsQixFQUNBO0FBQ0kscUJBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxHQUFmLElBQXNCLEtBQUssR0FBTCxDQUF0QjtBQUNIOztBQUVELGdCQUFJLE9BQUosRUFDQTtBQUNJLHFCQUFLLG1CQUFMO0FBQ0gsYUFIRCxNQUlLLElBQUksS0FBSyxnQkFBVCxFQUNMO0FBQ0kscUJBQUssZ0JBQUwsQ0FBc0IsSUFBdEI7QUFDSDtBQUNKOzs7Ozs7a0JBR1UsTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBcbiAqIFRoZSBNSVQgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAyMDE2IERhbWllbiBEb3Vzc2F1ZCAobmFtaWRlLmNvbSkuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiAqIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5jbGFzcyBDaGFuIHtcbiAgICBcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICAgICAgICAgICBOYW1lIG9mIHRoZSBjaGFubmVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHBhc3MgICAgICAgICAgICAgUGFzcyBvZiB0aGUgY2hhbm5lbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0Q2hhbkRhdGEgIERlZmF1bHQgZGF0YXMgb2YgdGhlIGNoYW5uZWxcbiAgICAgKiBAcmV0dXJucyB7Q2hhbn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciggaWQgKVxuICAgIHtcbiAgICAgICAgdGhpcy51c2VycyA9IFtdXG4gICAgICAgIHRoaXMuZGF0YSA9IHsgaWQgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBBZGQgYSBuZXcgdXNlciBpbiB0aGUgY2hhbm5lbFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VXNlcn0gdXNlclxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBhZGQoIHVzZXIgKVxuICAgIHsgICAgICAgIFxuICAgICAgICBjb25zdCB1c2VycyA9IHRoaXMudXNlcnNcblx0aWYgKHVzZXJzLmluZGV4T2YodXNlcikgPCAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB1c2Vycy5wdXNoKHVzZXIpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBcbiAgICByZW1vdmUoIHVzZXIgKVxuICAgIHtcbiAgICAgICAgY29uc3QgdXNlcnMgPSB0aGlzLnVzZXJzXG5cdGNvbnN0IGkgPSB1c2Vycy5pbmRleE9mKHVzZXIpXG4gICAgICAgIGlmIChpID4gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJzLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgXG4gICAgcmVwbGFjZVVzZXJzKCBuZXdVc2VycyApXG4gICAge1xuXHR0aGlzLnVzZXJzID0gbmV3VXNlcnNcbiAgICB9XG4gICAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5cbiIsIi8qIFxyXG4gKiBUaGUgTUlUIExpY2Vuc2VcclxuICpcclxuICogQ29weXJpZ2h0IDIwMTcgRGFtaWVuIERvdXNzYXVkIChuYW1pZGUuY29tKS5cclxuICpcclxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiAqXHJcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuICogVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbmNsYXNzIFBhcnNlciB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9uU2VydmVyRGF0YSA9IChtc2cpID0+IHt9XHJcbiAgICAgICAgdGhpcy5vbkNoYW5EYXRhID0gKGNoYW5UYXJnZXRJZCwgbXNnKSA9PiB7fVxyXG4gICAgICAgIHRoaXMub25Vc2VyRGF0YSA9ICh1c2VyVGFyZ2V0SWQsIG1zZykgPT4ge31cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9uU2VydmVyRXZlbnQgPSAobGFiZWwsIG1zZykgPT4ge31cclxuICAgICAgICB0aGlzLm9uQ2hhbkV2ZW50ID0gKHVzZXJUYXJnZXRJZCwgbGFiZWwsIG1zZykgPT4ge31cclxuICAgICAgICB0aGlzLm9uVXNlckV2ZW50ID0gKHVzZXJUYXJnZXRJZCwgbGFiZWwsIG1zZykgPT4ge31cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9uU2VydmVyTGlzdCA9IChsaXN0KSA9PiB7fVxyXG4gICAgICAgIHRoaXMub25DaGFuTGlzdCA9IChsaXN0KSA9PiB7fVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMub25FcnJvciA9IChjb2RlKSA9PiB7fVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtVc2VyfSBmcm9tXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxyXG4gICAgICovXHJcbiAgICBjaGVjayggZGF0YSApXHJcbiAgICB7XHJcbiAgICAgICAgdHJ5XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBKU09OLnBhcnNlKGRhdGEpXHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrTXNnKG1zZylcclxuXHR9XHJcbiAgICAgICAgY2F0Y2goIGV2dCApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoMilcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihldnQsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBfZ2V0VHlwZUlkQnlEYXRhKCBkYXRhIClcclxuICAgIHtcclxuICAgICAgICBsZXQgdHlwZSA9IG51bGxcclxuICAgICAgICBsZXQgaWQgPSBudWxsXHJcblxyXG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGRhdGEpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZSA9IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZSA9IGRhdGEueVxyXG4gICAgICAgICAgICBpZCA9IGRhdGEuaSB8fCBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7IHR5cGUsIGlkIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgX2Rpc3BhdGNoTXNnKCBtc2dUeXBlLCBmcm9tVHlwZSwgdGFyZ2V0SWQsIGxhYmVsLCBtc2cgKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBwYXJzZUludChtc2dUeXBlICsgMTAgKiBmcm9tVHlwZSlcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2goIGNvZGUgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAxMTogICAgLy8gZXZlbnQgZm9yIHVzZXJcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblVzZXJFdmVudCh0YXJnZXRJZCwgbGFiZWwsIG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAxMjogICAgLy8gZXZlbnQgZm9yIGNoYW5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5FdmVudCh0YXJnZXRJZCwgbGFiZWwsIG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAxMzogICAgLy8gZXZlbnQgZm9yIHNlcnZlclxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VydmVyRXZlbnQobGFiZWwsIG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAyMTogICAgLy8gZGF0YSBmb3IgdXNlclxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVXNlckRhdGEodGFyZ2V0SWQsIG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAyMjogICAgLy8gZGF0YSBmb3IgY2hhblxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbkRhdGEodGFyZ2V0SWQsIG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAyMzogICAgLy8gZGF0YSBmb3Igc2VydmVyXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJEYXRhKG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypjYXNlIDMxOiAgICAvLyBsaXN0IGZvciB1c2VyXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIGNhc2UgMzI6ICAgIC8vIGxpc3QgZm9yIGNoYW5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5MaXN0KG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAzMzogICAgLy8gbGlzdCBmb3Igc2VydmVyXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJMaXN0KG1zZylcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBQYXJzZXIgZXJyb3I6IHRoZSBjb21iaW5hdGlvbiBtZXNzYWdlIHR5cGU6ICR7bXNnVHlwZX0gYW5kIGZyb20gdHlwZTogJHtmcm9tVHlwZX0gZG9lcydudCBleGlzdGApXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IoMilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgX2NoZWNrTXNnKCBkYXRhIClcclxuICAgIHtcclxuICAgICAgICBjb25zdCB7IHk6IHR5cGUsIGw6IGxhYmVsLCB0OiB0YXJnZXQsIG06IG1zZyB9ID0gZGF0YVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEdldCB0YXJnZXQgdHlwZVxyXG4gICAgICAgIGNvbnN0IHsgdHlwZTogdGFyZ2V0VHlwZSwgaWQ6IHRhcmdldElkIH0gPSB0aGlzLl9nZXRUeXBlSWRCeURhdGEodGFyZ2V0KVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcih0eXBlKSB8fCAhTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRUeXBlKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUGFyc2VyIGVycm9yOiBtZXNzYWdlIG11c3QgaGF2ZSB0eXBlIGFuZCB0YXJnZXQgdHlwZScpXHJcbiAgICAgICAgICAgIHRoaXMub25FcnJvcigyKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlIDwgMSB8fCB0eXBlID4gMyB8fCB0YXJnZXRUeXBlIDwgMSB8fCB0YXJnZXRUeXBlID4gMylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUGFyc2VyIGVycm9yOiBtZXNzYWdlIHR5cGUgYW5kIHRhcmdldCB0eXBlIG11c3QgYmUgc2NvcGVkIGJldHdlZW4gMCBhbmQgNCcpXHJcbiAgICAgICAgICAgIHRoaXMub25FcnJvcigyKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaE1zZyh0eXBlLCB0YXJnZXRUeXBlLCB0YXJnZXRJZCwgbGFiZWwsIG1zZylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhcnNlclxyXG4iLCIvKiBcbiAqIFRoZSBNSVQgTGljZW5zZVxuICpcbiAqIENvcHlyaWdodCAyMDE2IERhbWllbiBEb3Vzc2F1ZCAobmFtaWRlLmNvbSkuXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbmNvbnN0IE1FU1NBR0VfTElTVCA9IHtcblxuICAgIDA6IHtlbjogJ0NhbiBub3QgY29ubmVjdCcsXG4gICAgICAgIGZyOiAnQ29ubmV4aW9uIGltcG9zc2libGUnfSxcblxuICAgIDE6IHtlbjogJ0NsaWVudCB1bmRlZmluZWQgZXJyb3IgKCQxKScsXG4gICAgICAgIGZyOiAnRXJyZXVyIGNsaWVudCBpbmTDqWZpbmllICgkMSknfSxcblxuICAgIDI6IHtlbjogJ0RhdGEgcGFyc2luZyBzdG9wcGVkOiB0cmFuc2ZlcnJlZCBkYXRhIGluY29tcGxldGUnLFxuICAgICAgICBmcjogJ0FuYWx5c2UgZGVzIGRvbm7DqWVzIHN0b3Bww6ksIGRvbm7DqWVzIHRyYW5zZsOpcsOpZXMgaW5jb21wbMOqdGVzJ30sXG5cbiAgICAzOiB7ZW46ICdZb3UgYXJlIGNvbm5lY3RlZCEnLFxuICAgICAgICBmcjogJ1ZvdXMgw6p0ZXMgY29ubmVjdMOpICEnfSxcblxuICAgIDQ6IHtlbjogJ1lvdSBhcmUgZGlzY29ubmVjdGVkIScsXG4gICAgICAgIGZyOiAnVm91cyDDqnRlcyBkw6ljb25uZWN0w6kgISd9LFxuXG4gICAgNToge2VuOiAnQ29ubmVjdGlvbiBzZXJ2ZXIgZXJyb3InLFxuICAgICAgICBmcjogJ0VycmV1ciBkZSBjb25uZXhpb24gYXZlYyBsZSBzZXJ2ZXVyJ30sXG5cbiAgICAvLyBDb21tYW5kc1xuICAgIDEwMToge2VuOiAnQ29tbWFuZCBsYWJlbCB1bmRlZmluZWQgKCQxKScsXG4gICAgICAgICAgZnI6ICdDb21tYW5kZSBpbmTDqWZpbmllICgkMSknfSxcblxuICAgIDEwMjoge2VuOiAnVW5rbm93biBjb21tYW5kICgkMSknLFxuICAgICAgICAgIGZyOiAnQ29tbWFuZGUgaW5jb25udWUgKCQxKSd9LFxuXG4gICAgMjAxOiB7ZW46ICdNZXNzYWdlIHRvIHVzZXIgJDEgZXJyb3IgKHRleHQgb3IgdXNlciBuYW1lIGVtcHR5KScsXG4gICAgICAgICAgZnI6ICdFcnJldXIgZFxcJ2Vudm9pZSBkZSBtZXNzYWdlIMOgIGxcXCd1dGlsaXNhdGV1ciAkMSAodGV4dGUgb3Ugbm9tIGRcXCd1dGlsaXNhdGV1ciBtYW5xdWFudCknfSxcblxuICAgIC8vIFVzZXJzXG4gICAgMzAxOiB7ZW46ICdVc2VyIG5vdCBmb3VuZCcsXG4gICAgICAgICAgZnI6ICdMXFwndXRpbGlzYXRldXIgblxcJ2EgcGFzIMOpdMOpIHRyb3V2w6knfSxcblxuICAgIDMwMjoge2VuOiAnWW91IGRvblxcJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGNoYW5nZSBjaGFuIGRhdGEgJDEnLFxuICAgICAgICAgIGZyOiAnVm91cyBuXFwnYXZleiBwYXMgbGEgcGVybWlzc2lvbiBkZSBjaGFuZ2VyIGxlcyBkb25uw6llcyBkdSBzYWxvbiAkMSd9LFxuXG4gICAgMzAzOiB7ZW46ICdZb3UgY2FuIG9ubHkgdXNlIGFscGhhbnVtZXJpYywgaHlwaGVuIGFuZCB1bmRlcnNjb3JlIGJldHdlZW4gMyBhbmQgMTAgY2hhcmFjdGVycyBpbiBhbiB1c2VyIG5hbWUgYnV0IHlvdSBoYXZlIHdyaXRlICQxJyxcbiAgICAgICAgICBmcjogJ1BvdXIgdW4gbm9tIGRcXCd1dGlsaXNhdGV1ciB2b3VzIG5lIHBvdXZleiB1dGlsaXNlciBxdWUgZGVzIGNhcmFjdMOocmVzIGxhdGluIHN0YW5kYXJ0cyAobWludXNjdWxlcywgbWFqdXNjdWxlcyksIGRlcyBjaGlmZnJlcywgZGVzIHRpcmV0cyBldCBkZXMgdW5kZXJzY29yZXMgZW50cmUgMyBldCAxMCBjYXJhY3TDqHJlcyBtYWlzIHZvdXMgYXZleiDDqWNyaXMgJDEnfSxcblxuICAgIDMwNDoge2VuOiAnTmFtZSB1bmRlZmluZWQnLFxuICAgICAgICAgIGZyOiAnTm9tIGluZMOpZmluaXMnfSxcblxuICAgIDMwNToge2VuOiAnVGhlIG5hbWUgJDEgaXMgYWxyZWFkeSB1c2VkJyxcbiAgICAgICAgICBmcjogJ0xlIG5vbSAkMSBlc3QgZMOpasOgIHV0aWxpc8OpJ30sXG5cbiAgICAzMDY6IHtlbjogJ05hbWUgdW5kZWZpbmVkJyxcbiAgICAgICAgICBmcjogJ05vbSBpbmTDqWZpbmlzJ30sXG5cbiAgICAzMDc6IHtlbjogJ1lvdSBjYW5cXCd0IGNoYW5nZSB5b3VyIHJvbGUnLFxuICAgICAgICAgIGZyOiAnVm91cyBuZSBwb3V2ZXogcGFzIGNoYW5nZXIgdm90cmUgcsO0bGUnfSxcblxuICAgIDMwODoge2VuOiAnQSB1c2VyIGV2ZW50IG11c3QgaGF2ZSBhIGxhYmVsIHByb3BlcnR5ICgkMSknLFxuICAgICAgICAgIGZyOiAnVW4gw6l2w6puZW1lbnQgdXRpbGlzYXRldXIgZG9pdCBhdm9pciB1bmUgcHJvcHJpw6l0w6kgXFwnbGFiZWxcXCcgKCQxKSd9LFxuXG4gICAgMzA5OiB7ZW46ICdZb3UgY2FuXFwndCBjaGFuZ2UgdGhlIHJvbGUgb2YgJDEgaWYgeW91IGFyZSBub3QgbW9kZXJhdG9yJyxcbiAgICAgICAgICBmcjogJ1ZvdXMgbmUgcG91dmV6IHBhcyBjaGFuZ2VyIGxlIHJvbGUgZGUgJDEgc2kgdm91cyBuXFwnw6p0ZXMgcGFzIG1vZMOpcmF0ZXVyJ30sXG5cbiAgICAzMTA6IHtlbjogJ1lvdSBkb25cXCd0IGhhdmUgcGVybWlzc2lvbiB0byBjaGFuZ2UgZGF0YSAkMSBvZiAkMicsXG4gICAgICAgICAgZnI6ICdWb3VzIG5cXCdhdmV6IHBhcyBsYSBwZXJtaXNzaW9uIGRlIGNoYW5nZXIgbGEgZG9ubsOpZSAkMSBkZSAkMid9LFxuXG4gICAgMzExOiB7ZW46ICdZb3UgZG9uXFwndCBoYXZlIHBlcm1pc3Npb24gdG8ga2ljayAkMSBmcm9tICQyJyxcbiAgICAgICAgICBmcjogJ1ZvdXMgblxcJ2F2ZXogcGFzIGxhIHBlcm1pc3Npb24gZFxcJ2V4cHVsc2VyICQxIGR1IHNhbG9uICQyJ30sXG5cbiAgICAzMTI6IHtlbjogJyQxIGlzIGFscmVhZHkgJDInLFxuICAgICAgICAgIGZyOiAnJDEgZXN0IGTDqWrDoCAkMid9LFxuXG4gICAgLy8gQ2hhblxuICAgIDQwMToge2VuOiAnWW91IGRvblxcJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGNoYW5nZSB0aGUgcGFzcyBvZiB0aGUgY2hhbicsXG4gICAgICAgICAgZnI6ICdWb3VzIG5cXCdhdmV6IHBhcyBsYSBwZXJtaXNzaW9uIGRlIGNoYW5nZXIgbGUgbW90IGRlIHBhc3NlIGR1IHNhbG9uJ30sXG5cbiAgICA0MDI6IHtlbjogJ1RoZSBuYW1lICQxIGlzIGFscmVhZHkgdXNlZCcsXG4gICAgICAgICAgZnI6ICdMZSBub20gJDEgZXN0IGTDqWrDoCB1dGlsaXPDqSd9LFxuXG4gICAgNDAzOiB7ZW46ICdOYW1lIHVuZGVmaW5lZCcsXG4gICAgICAgICAgZnI6ICdOb20gaW5kw6lmaW5pcyd9LFxuXG4gICAgNDA0OiB7ZW46ICdZb3UgY2FuIG9ubHkgdXNlIGFscGhhbnVtZXJpYywgaHlwaGVuIGFuZCB1bmRlcnNjb3JlIGJldHdlZW4gMyBhbmQgMTAgY2hhcmFjdGVycyBpbiBhIGNoYW4gbmFtZSBidXQgeW91IGhhdmUgd3JpdGUgJDEnLFxuICAgICAgICAgIGZyOiAnUG91ciB1biBub20gZGUgc2Fsb24gdm91cyBuZSBwb3V2ZXogdXRpbGlzZXIgcXVlIGRlcyBjYXJhY3TDqHJlcyBsYXRpbiBzdGFuZGFydHMgKG1pbnVzY3VsZXMsIG1hanVzY3VsZXMpLCBkZXMgY2hpZmZyZXMsIGRlcyB0aXJldHMgZXQgZGVzIHVuZGVyc2NvcmVzIGVudHJlIDMgZXQgMTAgY2FyYWN0w6hyZXMgbWFpcyB2b3VzIGF2ZXogw6ljcmlzICQxJ30sXG5cbiAgICA0MDU6IHtlbjogJ0EgY2hhbiBldmVudCBtdXN0IGhhdmUgYSBsYWJlbCBwcm9wZXJ0eSAoJDEpJyxcbiAgICAgICAgICBmcjogJ1VuIMOpdsOqbmVtZW50IGRlIHNhbG9uIGRvaXQgYXZvaXIgdW5lIHByb3ByacOpdMOpIFxcJ2xhYmVsXFwnICgkMSknfSxcblxuICAgIDQwNjoge2VuOiAnWW91IGNhblxcJ3Qgam9pbiB0aGUgY2hhbiAkMScsXG4gICAgICAgICAgZnI6ICdWb3VzIG5cXCfDqnRlcyBwYXMgYXV0b3Jpc8OpIMOgIHJlam9pbmRyZSBsZSBzYWxvbiAkMSknfSxcblxuICAgIDQwNzoge2VuOiAnWW91IGNhblxcJ3QgY3JlYXRlIHRoZSBjaGFuICQxJyxcbiAgICAgICAgICBmcjogJ0lsIGVzdCBpbXBvc3NpYmxlIGRlIGNyw6llciBsZSBzYWxvbiAkMSknfSxcblxuICAgIC8vIE1lc3NhZ2VzXG4gICAgNTAxOiB7ZW46ICckMSBjaGFuZ2UgaGlzIG5hbWUgdG8gJDInLFxuICAgICAgICAgIGZyOiAnJDEgc1xcJ2FwcGVsZSBkw6lzb3JtYWlzICQyJ30sXG5cbiAgICA1MDI6IHtlbjogJyQxIGhhcyBiZWVuIGtpY2tlZCBieSAkMicsXG4gICAgICAgICAgZnI6ICckMSBhIMOpdMOpIGV4cHVsc8OpIHBhciAkMid9LFxuXG4gICAgNTAzOiB7ZW46ICdZb3UgaGF2ZSBiZWVuIGtpY2tlZCBieSAkMScsXG4gICAgICAgICAgZnI6ICdWb3VzIGF2ZXogw6l0w6kgZXhwdWxzw6kgcGFyICQxJ30sXG5cbiAgICA1MDQ6IHtlbjogJyQxIGxlYXZlIHRoZSBjaGFuICQyJyxcbiAgICAgICAgICBmcjogJyQxIGEgcXVpdHTDqSBsZSBzYWxvbiAkMid9LFxuXG4gICAgNTA1OiB7ZW46ICckMSBqb2luIHRoZSBjaGFuICQyJyxcbiAgICAgICAgICBmcjogJyQxIGEgcmVqb2luZCBsZSBzYWxvbiAkMid9XG59XG5cbmNsYXNzIFRyYW5zbGF0ZSB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoIGxhbmcgKVxuICAgIHtcbiAgICAgICAgdGhpcy5sYW5nID0gbGFuZ1xuICAgIH1cbiAgICBcbiAgICBnZXQoIGlkLCAuLi5kYXRhcyApXG4gICAge1xuICAgICAgICBjb25zdCBsYW5nID0gdGhpcy5sYW5nXG4gICAgICAgIFxuICAgICAgICBpZiAoTUVTU0FHRV9MSVNUW2lkXSA9PSB1bmRlZmluZWQgfHwgTUVTU0FHRV9MSVNUW2lkXVtsYW5nXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlkID0gMTtcbiAgICAgICAgICAgIGRhdGEgPSBbJ2lkOiAnICsgaWRdO1xuXHR9XG4gICAgICAgIFxuICAgICAgICBsZXQgcmF3ID0gTUVTU0FHRV9MSVNUW2lkXVtsYW5nXVxuXHRsZXQgaSA9IGRhdGFzLmxlbmd0aDtcblx0d2hpbGUgKC0taSA+IC0xKVxuICAgICAgICB7XG4gICAgICAgICAgICByYXcgPSByYXcucmVwbGFjZSgnJCcgKyAoaSArIDEpLCBkYXRhc1tpXSlcblx0fVxuXHRcblx0cmV0dXJuIHJhd1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBBZGQgYSBuZXcgbWVzc2FnZSBmb3IgdGhlIGNvZGUuIEV4YW1wbGU6XG4gICAgICogXG4gICAgICogY29uc3QgbWVzc2FnZTEgPSB7XG4gICAgICogIGVuOiAnWW91IGFyZSB0byB5b3VuZyB0byBjb25uZWN0IGhlcmUnLFxuICAgICAqICBmcjogJ1R1IGVzIHRyb3AgamV1bmUgcG91ciB0ZSBjb25uZWN0ZXIgaWNpJ1xuICAgICAqIH1cbiAgICAgKiBhZGQoIDEwMDEsIG1lc3NhZ2UxIH1cbiAgICAgKiBcbiAgICAgKiBjb25zdCBtZXNzYWdlMiA9IHtcbiAgICAgKiAgZW46ICdZb3UgYXJlIGtpbGxlZCBieSAkMSBhc3Npc3RlZCBieSAkMicsXG4gICAgICogIGZyOiAnVHUgYXMgw6l0w6kgdHXDqSBwYXIgJDEgYXNzaXN0w6kgZGUgJDInXG4gICAgICogfVxuICAgICAqIGFkZCggMTAwMiwgbWVzc2FnZTIgfVxuICAgICAqIFxuICAgICAqIFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0gY29kZSAgICAgICAgQ29kZSBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2VzICAgICBPYmplY3QgY29udGFpbiBtZXNzYWdlcyBieSBsYW5ndWFnZVxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgYWRkKCBjb2RlLCBtZXNzYWdlcyApXG4gICAge1xuICAgICAgICBpZiAoTUVTU0FHRV9MSVNUW2NvZGVdICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVGhlIGVycm9yIGNvZGUgJHtjb2RlfSBhbHJlYWR5IGV4aXN0YClcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIE1FU1NBR0VfTElTVFtjb2RlXSA9IG1lc3NhZ2VzXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zbGF0ZVxuIiwiLyogXG4gKiBUaGUgTUlUIExpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNyBEYW1pZW4gRG91c3NhdWQgKG5hbWlkZS5jb20pLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKi9cblxuXG5jbGFzcyBVc2VyIHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpXG4gICAge1xuICAgICAgICB0aGlzLmRhdGEgPSB7fVxuXHRcblx0dGhpcy5vbkRhdGFOYW1lQ2hhbmdlID0gdGVtcCA9PiB7fVxuXHR0aGlzLm9uRGF0YUNoYW5nZSA9IHRlbXAgPT4ge31cbiAgICAgICAgdGhpcy5vbkxlYXZlID0gdGVtcCA9PiB7fVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHJvbGUgb2YgdGhlIHVzZXI6XG4gICAgICogLSAwID4gU2ltcGxlIHVzZXJcbiAgICAgKiAtIDEgPiBNb2RlcmF0b3I6IEl0J3MgdGhlIG1hbmFnZXIgb2YgaGlzIGNoYW5uZWxcbiAgICAgKiAtIDIgPiBBZG1pbjogSXQncyB0aGUgbWFuYWdlciBvZiB0aGUgc2VydmVyXG4gICAgICogXG4gICAgICogQHJldHVybnMge0ludGVnZXJ9XG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldFJvbGUoKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5yb2xlIHx8IDBcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJcblxuIiwiLyogXHJcbiAqIFRoZSBNSVQgTGljZW5zZVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNyBEYW1pZW4gRG91c3NhdWQgKG5hbWlkZS5jb20pLlxyXG4gKlxyXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4gKlxyXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gKiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gKiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuaW1wb3J0IENsaWVudCBmcm9tICcuL2NsaWVudC5qcydcclxuXHJcbndpbmRvdy5zb2NrID0gQ2xpZW50XHJcbiIsIi8qIFxuICogVGhlIE1JVCBMaWNlbnNlXG4gKlxuICogQ29weXJpZ2h0IDIwMTcgRGFtaWVuIERvdXNzYXVkIChuYW1pZGUuY29tKS5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCBDaGFuIGZyb20gJy4vQ2hhbi5qcydcbmltcG9ydCBVc2VyIGZyb20gJy4vVXNlci5qcydcbmltcG9ydCBUcmFuc2xhdGUgZnJvbSAnLi9UcmFuc2xhdGUuanMnXG5pbXBvcnQgUGFyc2VyIGZyb20gJy4vUGFyc2VyLmpzJ1xuXG5cbmNsYXNzIENsaWVudCB7XG4gICAgXG4gICAgY29uc3RydWN0b3IoIFVSSSwgb25Db25uZWN0ZWQgPSBudWxsLCBvbkVycm9yID0gbnVsbCwgbGFuZyA9ICdlbicgKVxuICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFVSSSlcbiAgICAgICAgdGhpcy51c2VycyA9IFtdIC8vIGFsbCwgbWUgdG9vXG5cbiAgICAgICAgdGhpcy5tZSA9IG51bGxcblx0dGhpcy5jaGFuID0gbnVsbFxuXG5cdHRoaXMudXJpID0gVVJJXG5cdHRoaXMudHJhbnNsYXRlID0gbmV3IFRyYW5zbGF0ZShsYW5nKVxuXHRcblx0dGhpcy5saXN0Q2hhbnMgPSBbXVxuICAgICAgICB0aGlzLndlYnNvY2tldCA9IG51bGxcbiAgICAgICAgXG5cdHRoaXMuX2luaXREaXNwYXRjaGVyKG9uQ29ubmVjdGVkLCBvbkVycm9yKVxuICAgICAgICB0aGlzLl9pbml0V2Vic29ja2V0KClcbiAgICAgICAgdGhpcy5faW5pdFBhcnNlcigpXG4gICAgfVxuICAgIFxuICAgIF9pbml0RGlzcGF0Y2hlciggb25Db25uZWN0ZWQsIG9uRXJyb3IgKVxuICAgIHtcblx0dGhpcy5vbkNvbm5lY3RlZCA9IG9uQ29ubmVjdGVkIHx8ICh1c2VyID0+IHsgdGhpcy5vbkxvZygnVXNlciBjb25uZWN0ZWQnKSB9KVxuXHR0aGlzLm9uRXJyb3IgPSBvbkVycm9yIHx8IChtc2cgPT4geyBjb25zb2xlLmVycm9yKG1zZykgfSlcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25Mb2cgPSBtc2cgPT4geyBjb25zb2xlLmxvZyhtc2cpIH1cblx0dGhpcy5vbkNsb3NlID0gbXNnID0+IHsgdGhpcy5vbkxvZygnU29ja2V0IGNsb3NlZCcpIH1cblx0dGhpcy5vbk1zZ1VzZXIgPSAobmFtZSwgbXNnKSA9PiB7IHRoaXMub25Mb2cobmFtZSArIFwiOlwiICsgbXNnKSB9XG5cdHRoaXMub25DaGFuTXNnID0gKG5hbWUsIG1zZykgPT4geyB0aGlzLm9uTG9nKG5hbWUgKyBcIjpcIiArIG1zZykgfVxuXHR0aGlzLm9uU2VydmVyTXNnID0gbXNnID0+IHsgdGhpcy5vbkxvZyhtc2cpIH1cblx0dGhpcy5vbkxpc3RDaGFuID0gbGlzdCA9PiB7IHRoaXMub25Mb2cobGlzdCkgfVxuXHR0aGlzLm9uVXNlckV2dCA9ICh1c2VyLCBsYWJlbCwgZGF0YSkgPT4geyB0aGlzLm9uTG9nKGxhYmVsKSB9XG5cdHRoaXMub25DaGFuRXZ0ID0gKGxhYmVsLCBkYXRhKSA9PiB7IHRoaXMub25Mb2cobGFiZWwpIH1cblx0dGhpcy5vblNlcnZlckV2dCA9IChsYWJlbCwgZGF0YSkgPT4geyB0aGlzLm9uTG9nKGxhYmVsKSB9XG5cdHRoaXMub25DaGFuQ2hhbmdlID0gY2hhbiA9PiB7IHRoaXMub25Mb2coJ0NoYW4gY2hhbmdlZCcpIH1cblx0dGhpcy5vbkNoYW5EYXRhQ2hhbmdlID0gZGF0YSA9PiB7IHRoaXMub25Mb2coJ2RhdGEgY2hhbmdlZCcpIH1cblx0dGhpcy5vbkNoYW5Vc2VyTGlzdCA9IGxpc3QgPT4geyB0aGlzLm9uTG9nKGxpc3QpIH1cbiAgICB9XG4gICAgXG4gICAgX2luaXRQYXJzZXIoKVxuICAgIHtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKClcbiAgICAgICAgdGhpcy5wYXJzZXIub25FcnJvciA9IGVycm9yQ29kZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoIHRoaXMudHJhbnNsYXRlLmdldCggZXJyb3JDb2RlICkgKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLm9uQ2hhbkV2ZW50ID0gKGNoYW5UYXJnZXRJZCwgbGFiZWwsIG1zZykgPT4ge31cbiAgICAgICAgICovXG4gICAgICAgIFxuICAgICAgICAvLyBFVkVOVFNcblxuICAgICAgICB0aGlzLnBhcnNlci5vblVzZXJFdmVudCA9ICggdXNlclRhcmdldElkLCBsYWJlbCwgbXNnICkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5nZXRVc2VyQnlJZCggdXNlclRhcmdldElkIClcbiAgICAgICAgICAgIGlmIChsYWJlbCA9PT0gJ21zZycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1zZ1VzZXIodXNlci5kYXRhLm5hbWUsIG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVXNlckV2dCh1c2VyLCBsYWJlbCwgbXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBhcnNlci5vbkNoYW5FdmVudCA9ICggdXNlclRhcmdldElkLCBsYWJlbCwgbXNnICkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5nZXRVc2VyQnlJZCggdXNlclRhcmdldElkIClcbiAgICAgICAgICAgIGlmIChsYWJlbCA9PT0gJ21zZycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5Nc2codXNlci5kYXRhLm5hbWUsIG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbkV2dChsYWJlbCwgbXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBhcnNlci5vblNlcnZlckV2ZW50ID0gKGxhYmVsLCBtc2cpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGxhYmVsID09PSAnbXNnJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VydmVyTXNnKG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxhYmVsID09PSAnZXJyb3InKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJNc2codGhpcy50cmFuc2xhdGUuZ2V0KG1zZy5pZCwgLi4ubXNnLnZhcnMpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJFdnQobGFiZWwsIG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICB0aGlzLnBhcnNlci5vbkNoYW5MaXN0ID0gKGxpc3QpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgeW91IGhhdmUgbmV3IHBsYXllcnNcbiAgICAgICAgICAgIGNvbnN0IHVzZXJMaXN0ID0gW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgdXNlckRhdGEgaW4gbGlzdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXBkYXRlVXNlcih1c2VyRGF0YSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgdXNlckxpc3QucHVzaCh1c2VyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNoYW4ucmVwbGFjZVVzZXJzKHVzZXJMaXN0KVxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hDaGFuVXNlckxpc3QoKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJzZXIub25TZXJ2ZXJMaXN0ID0gKGxpc3QpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5saXN0Q2hhbnMgPSBsaXN0XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaFNlcnZlckNoYW5MaXN0KClcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLyogVE9ET1xuICAgICAgIFxuICAgICAgICBjYXNlIFwiY2hhbi1hZGRlZFwiIDpcblxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdENoYW5zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdENoYW5zID0gW107XG5cbiAgICAgICAgICAgIHRoaXMubGlzdENoYW5zLnB1c2goZC5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoU2VydmVyQ2hhbkxpc3QoKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImNoYW4tcmVtb3ZlZFwiIDpcblxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdENoYW5zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdENoYW5zID0gW107XG5cbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5saXN0Q2hhbnMuaW5kZXhPZihkLmRhdGEpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0Q2hhbnMuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaFNlcnZlckNoYW5MaXN0KCk7XG5cbiAgICAgICAgICAgIGJyZWFrOyovXG4gICAgXG5cblxuICAgICAgICAvLyBEQVRBU1xuICAgICAgICB0aGlzLnBhcnNlci5vbkNoYW5EYXRhID0gKGNoYW5UYXJnZXRJZCwgbXNnKSA9PiB7XG4gICAgICAgICAgICBtc2cuaWQgPSBjaGFuVGFyZ2V0SWRcbiAgICAgICAgICAgIHRoaXMuX3NldENoYW5EYXRhKG1zZylcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJzZXIub25Vc2VyRGF0YSA9ICh1c2VyVGFyZ2V0SWQsIG1zZykgPT4ge1xuICAgICAgICAgICAgbXNnLmlkID0gdXNlclRhcmdldElkXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVVc2VyKG1zZylcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJzZXIub25TZXJ2ZXJEYXRhID0gKG1zZykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdObyB1cGRhdGUgZm9yIHNlcnZlciBkYXRhJylcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBfaW5pdFdlYnNvY2tldCgpXG4gICAge1xuXHR0cnlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMudXJpKVxuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQub25jbG9zZSA9IGV2dCA9PiB7IHRoaXMub25DbG9zZShldnQuZGF0YSkgfVxuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQub25tZXNzYWdlID0gZXZ0ID0+IHsgdGhpcy5wYXJzZXIuY2hlY2soZXZ0LmRhdGEpIH1cbiAgICAgICAgICAgIHRoaXMud2Vic29ja2V0Lm9uZXJyb3IgPSBldnQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcih0aGlzLnRyYW5zbGF0ZS5nZXQoNSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldnQgPT4geyB0aGlzLmNsb3NlKCkgfSwgZmFsc2UpXG5cdH1cbiAgICAgICAgY2F0Y2ggKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcih0aGlzLnRyYW5zbGF0ZS5nZXQoMCkpXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSlcblx0fVxuICAgIH1cbiAgICBcbiAgICBfc2VuZCggZGF0YSApXG4gICAge1xuICAgICAgICB0aGlzLndlYnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBjaGFuIG9yIHRvIGEgdXNlclxuICAgICpcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtc2dcdFx0WW91ciBtZXNzYWdlXG4gICAgKiBAcGFyYW0ge1VzZXI/fSB1c2VyXHRcdEZhY3VsdGF0aXZlLCBpZiBpdCdzIG51bGw6IHRoZSBtZXNzYWdlIGlzIHNlbmQgdG8gYWxsIHRoZSBjaGFuXG4gICAgKi9cbiAgICBzZW5kTXNnKCBtc2csIHVzZXIgPSBudWxsIClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRVc2VyRXZ0KCAnbXNnJywgbXNnLCB1c2VyIClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGFuIGV2ZW50LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbFx0XHRMYWJlbCBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVx0XHREYXRhcyBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge1VzZXJ9IHVzZXJcdFx0RmFjdWx0YXRpdmUsIHRhcmdldCBvZiB0aGUgZXZlbnQgKGlmIGl0J3MgbnVsbCwgdGhlIHRhcmdldCBpcyB5b3UpXG4gICAgICovXG4gICAgc2VuZFVzZXJFdnQoIGxhYmVsLCBkYXRhLCB1c2VyID0gbnVsbCApXG4gICAge1xuICAgICAgICBpZiAodXNlciA9PT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmQoe1xuICAgICAgICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgICAgICAgbDogbGFiZWwsXG4gICAgICAgICAgICAgICAgdDogeyB5OiAyLCBpOiB0aGlzLmNoYW4uZGF0YS5pZCB9LFxuICAgICAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VuZCh7XG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBsOiBsYWJlbCxcbiAgICAgICAgICAgICAgICB0OiB7IHk6IDEsIGk6IHVzZXIuZGF0YS5pZCB9LFxuICAgICAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgZGF0YShzKSBvZiBhIHVzZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHRcdERhdGEgd2l0aCBuZXcgaW5mb3JtYXRpb25cbiAgICAgKiBAcGFyYW0ge1VzZXI/fSB1c2VyXHRcdEZhY3VsdGF0aXZlLCB0YXJnZXQ6IGlmIG51bGwgdGhlIHRhcmdldCBpcyB5b3VcbiAgICAgKi9cbiAgICBzZW5kVXNlckRhdGEoIGRhdGEsIHVzZXIgPSBudWxsIClcbiAgICB7XG4gICAgICAgIGNvbnN0IHQgPSB7XG4gICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgaTogKHVzZXIgPT09IG51bGwpID8gdGhpcy5tZS5kYXRhLmlkIDogdXNlci5kYXRhLmlkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VuZCh7XG4gICAgICAgICAgICB5OiAyLFxuICAgICAgICAgICAgdCxcbiAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGFuIGV2ZW50IHRvIHRoZSBjaGFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsXHRMYWJlbCBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVx0XHREYXRhcyBvZiB0aGUgZXZlbnRcbiAgICAgKi9cbiAgICBzZW5kQ2hhbkV2dCggbGFiZWwsIGRhdGEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmQoe1xuICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgIGw6IGxhYmVsLFxuICAgICAgICAgICAgdDogeyB5OjIsIGk6dGhpcy5jaGFuLmRhdGEuaWQgfSxcbiAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIGEgZGF0YSBvZiB0aGUgY2hhbiAoeW91IG11c3QgdG8gaGF2ZSB0aGUgbW9kZXJhdG9yIG9mIHRoZSBjaGFuKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcdFx0TmV3IGRhdGEgdG8gY2hhbmdlXG4gICAgICovXG4gICAgc2VuZENoYW5EYXRhKCBkYXRhIClcbiAgICB7XG4gICAgICAgIGNvbnN0IHQgPSB7XG4gICAgICAgICAgICB5OiAyLFxuICAgICAgICAgICAgaTogdGhpcy5jaGFuLmRhdGEuaWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZW5kKHtcbiAgICAgICAgICAgIHk6IDIsXG4gICAgICAgICAgICB0LFxuICAgICAgICAgICAgbTogZGF0YVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICogR2V0IGFsbCB0aGUgY2hhbnMgb2YgdGhlIHNlcnZlciAoYXN5bmNocm9udXMgZnVuY3Rpb24pXG4gICAgKiBcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHRcdEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBsaXN0IGlzIHJldHVybiAobGlrZSBvbkxpc3RDaGFuKVxuICAgICovXG4gICAgbGlzdGVuQ2hhbkxpc3QoIGNhbGxiYWNrIClcbiAgICB7XG4gICAgICAgIHRoaXMub25MaXN0Q2hhbiA9IGNhbGxiYWNrXG4gICAgICAgIHRoaXMubGlzdENoYW5zID0gW10gICAgICAgIFxuICAgICAgICB0aGlzLl9zZW5kKHtcbiAgICAgICAgICAgIHk6IDMsXG4gICAgICAgICAgICB0OiAyLFxuICAgICAgICAgICAgbDogMVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICogU3RvcCBsaXN0ZW4gdGhlIGNoYW4gbGlzdFxuICAgICovXG4gICAgc3RvcExpc3RlbkNoYW5zKClcbiAgICB7XG4gICAgICAgIHRoaXMuX3NlbmQoe1xuICAgICAgICAgICAgeTogMyxcbiAgICAgICAgICAgIHQ6IDIsXG4gICAgICAgICAgICBsOiAwXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMub25MaXN0Q2hhbiA9IG51bGxcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgKiBDaGFuZ2UgdGhlIGNoYW4uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5OYW1lXHRcdE5hbWUgb2YgdGhlIG5ldyBjaGFuXG4gICAgKiBAcGFyYW0ge1N0cmluZz99IGNoYW5QYXNzXHRcdEZhY3VsdGF0aXZlIHBhc3Mgb2YgdGhlIG5ldyBjaGFuXG4gICAgKi9cbiAgICBqb2luQ2hhbiggY2hhbk5hbWUsIGNoYW5QYXNzID0gJycgKVxuICAgIHtcbiAgICAgICAgdGhpcy5zZW5kVXNlckRhdGEoe1xuICAgICAgICAgICAgY2hhbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGNoYW5OYW1lLFxuICAgICAgICAgICAgICAgIHBhc3M6IGNoYW5QYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgLyoqXG4gICAgKiBDaGFuZ2UgeW91ciBuYW1lLlxuICAgICpcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdOYW1lXHRcdFlvdXIgbmV3IG5hbWVcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHRDYWxsZWQgd2hlbiB0aGUgbmFtZSBpcyBjaGFuZ2VkXG4gICAgKi9cbiAgICBjaGFuZ2VVc2VyTmFtZSggbmV3TmFtZSwgY2FsbGJhY2sgKVxuICAgIHtcbiAgICAgICAgdGhpcy5tZS5vbkRhdGFOYW1lQ2hhbmdlID0gY2FsbGJhY2tcbiAgICAgICAgdGhpcy5zZW5kVXNlckRhdGEoe1xuICAgICAgICAgICAgbmFtZTogbmV3TmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgLyoqXG4gICAgKiBDaGFuZ2UgdGhlIG5hbWUgb2YgdGhlIGNoYW4uXG4gICAgKlxuICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld05hbWVcdFx0TmV3IG5hbWUgb2YgdGhlIGNoYW5cbiAgICAqL1xuICAgIGNoYW5nZUNoYW5OYW1lKCBuZXdOYW1lIClcbiAgICB7XG4gICAgICAgIHRoaXMuc2VuZENoYW5EYXRhKHtcbiAgICAgICAgICAgIG5hbWU6IGNoYW5OYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAvKipcbiAgICAqIEtpY2sgYSB1c2VyIG91dCBvZiB0aGUgY2hhbiAob25seSBpZiB5b3UgYXJlIG1vZGVyYXRvcilcbiAgICAqXG4gICAgKiBAcGFyYW0ge1VzZXJ9IHVzZXJcdFx0VXNlciB0byBraWNrXG4gICAgKi9cbiAgICBraWNrVXNlciggdXNlciApXG4gICAge1xuICAgICAgICB0aGlzLnNlbmRVc2VyRGF0YSh7Y2hhbjp7aWQ6IC0xfX0sIHVzZXIpXG4gICAgfVxuXG4gICAvKipcbiAgICAqIFVwIGEgdXNlciB0byBiZSBtb2RlcmF0b3IgKG9ubHkgaWYgeW91IGFyZSBtb2RlcmF0b3IpXG4gICAgKlxuICAgICogQHBhcmFtIHt1c2VyfSB1c2VyXHRcdFVzZXIgdG8gYmUgbW9kZXJhdG9yXG4gICAgKi9cbiAgICB1cFRvTW9kZXJhdG9yKCB1c2VyIClcbiAgICB7XG4gICAgICAgIHRoaXMuc2VuZFVzZXJEYXRhKHtyb2xlOiAxfSwgdXNlcilcbiAgICB9XG5cbiAgICBjbG9zZSgpXG4gICAge1xuICAgICAgICB0aGlzLndlYnNvY2tldC5jbG9zZSgpXG4gICAgfVxuICAgIFxuICAgIHJlbW92ZVVzZXIoIHVzZXIgKVxuICAgIHtcblx0Y29uc3QgaSA9IHRoaXMudXNlcnMuaW5kZXhPZih1c2VyKVxuXHRpZiAodXNlckkgPiAtMSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy51c2Vycy5zcGxpY2UodXNlckksIDEpXG4gICAgICAgICAgICB0aGlzLmNoYW4ucmVtb3ZlVXNlcih1c2VyKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXHR9XG5cdFxuXHRyZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgXG4gICAgZ2V0VXNlckJ5TmFtZSggbmFtZSApXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy51c2Vycy5maW5kKCB1ID0+IHUuZGF0YS5uYW1lID09PSBuYW1lICkgfHwgbnVsbFxuICAgIH1cbiAgICBcbiAgICBnZXRVc2VyQnlJZCggaWQgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcnMuZmluZCggdSA9PiB1LmRhdGEuaWQgPT09IGlkICkgfHwgbnVsbFxuICAgIH1cbiAgICBcbiAgICBfdXBkYXRlVXNlciggZGF0YSwgZGlzcGF0Y2ggPSB0cnVlIClcbiAgICB7XG5cdGlmICh0aGlzLm1lID09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubWUgPSBuZXcgVXNlcigpXG4gICAgICAgICAgICB0aGlzLl9zZXRVc2VyRGF0YShkYXRhLCB0aGlzLm1lLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChkaXNwYXRjaClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaENvbm5lY3RlZCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJNc2codGhpcy50cmFkLmdldCgzKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lXG5cdH1cblx0XG5cdHZhciB1ID0gdGhpcy5nZXRVc2VyQnlJZChkYXRhLmlkKVxuXHRpZiAodSAhPT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fc2V0VXNlckRhdGEoZGF0YSwgdSlcblx0fVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHUgPSBuZXcgVXNlcigpXG4gICAgICAgICAgICB0aGlzLl9zZXRVc2VyRGF0YShkYXRhLCB1KVxuXG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2gpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hDaGFuVXNlckxpc3QoKVxuICAgICAgICAgICAgfVxuXHR9XG5cblx0cmV0dXJuIHVcbiAgICB9XG4gICAgXG4gICAgX2Rpc3BhdGNoVXNlckRhdGFDaGFuZ2UoIHVzZXIsIGRhdGEgKVxuICAgIHtcbiAgICAgICAgaWYgKHVzZXIub25EYXRhQ2hhbmdlICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVzZXIub25EYXRhQ2hhbmdlKGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vblVzZXJEYXRhQ2hhbmdlICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25Vc2VyRGF0YUNoYW5nZSh1c2VyLCBkYXRhKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgX2Rpc3BhdGNoQ2hhblVzZXJMaXN0KClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLm9uQ2hhblVzZXJMaXN0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhblVzZXJMaXN0KHRoaXMuY2hhbi51c2VycylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kaXNwYXRjaFNlcnZlckNoYW5MaXN0KClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLm9uTGlzdENoYW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25MaXN0Q2hhbih0aGlzLmxpc3RDaGFucylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kaXNwYXRjaENvbm5lY3RlZCgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3RlZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RlZCh0aGlzLm1lKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgX2Rpc3BhdGNoQ2hhbkNoYW5nZSgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5vbkNoYW5EYXRhQ2hhbmdlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbkRhdGFDaGFuZ2UodGhpcy5jaGFuLmRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNoYW5DaGFuZ2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuQ2hhbmdlKHRoaXMuY2hhbilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoQ2hhblVzZXJMaXN0KClcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hTZXJ2ZXJDaGFuTGlzdCgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFVzZXJEYXRhKCBkYXRhLCB1c2VyLCBkaXNwYXRjaCA9IHRydWUgKVxuICAgIHtcbiAgICAgICAgaWYgKGRhdGEuaWQgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdXNlci5kYXRhLmlkID0gZGF0YS5pZFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBcIm5hbWVcIilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGROYW1lID0gdXNlci5kYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgdXNlci5kYXRhLm5hbWUgPSBkYXRhLm5hbWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzcGF0Y2gpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlci5vbkRhdGFOYW1lQ2hhbmdlICE9IG51bGwgJiYgZGF0YS5uYW1lICE9IG9sZE5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIub25EYXRhTmFtZUNoYW5nZSgpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkTmFtZSAhPSBudWxsICYmIG9sZE5hbWUgIT0gZGF0YS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VydmVyTXNnKHRoaXMudHJhZC5nZXQoNTAxLCBbb2xkTmFtZSwgZGF0YS5uYW1lXSkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQ2hhblVzZXJMaXN0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwiY2hhblwiKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh1c2VyICE9PSB0aGlzLm1lKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY2hhbi5pZCAhPT0gdGhpcy5jaGFuLmRhdGEuaWQpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbi5yZW1vdmUodXNlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJNc2codGhpcy50cmFkLmdldCg1MDQsIFt1c2VyLmRhdGEubmFtZSwgdGhpcy5jaGFuLmRhdGEubmFtZV0pKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGF0Y2gpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hDaGFuVXNlckxpc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW4uam9pbih1c2VyKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNlcnZlck1zZyh0aGlzLnRyYWQuZ2V0KDUwNSwgW3VzZXIuZGF0YS5uYW1lLCB0aGlzLmNoYW4uZGF0YS5uYW1lXSkpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXNwYXRjaClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaENoYW5Vc2VyTGlzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXNlci5kYXRhW2tleV0gPSBkYXRhW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoVXNlckRhdGFDaGFuZ2UodXNlciwgZGF0YSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q2hhbkRhdGEoIGRhdGEgKVxuICAgIHtcbiAgICAgICAgbGV0IG5ld0NoYW4gPSBmYWxzZVxuICAgICAgICBpZiAodGhpcy5jaGFuID09IG51bGwgfHwgdGhpcy5jaGFuLmRhdGEuaWQgIT09IGRhdGEuaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbiA9IG5ldyBDaGFuKGRhdGEuaWQpXG4gICAgICAgICAgICBuZXdDaGFuID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5jaGFuLmRhdGFba2V5XSA9IGRhdGFba2V5XVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0NoYW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQ2hhbkNoYW5nZSgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vbkNoYW5EYXRhQ2hhbmdlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbkRhdGFDaGFuZ2UoZGF0YSlcbiAgICAgICAgfVxuICAgIH0gIFxufVxuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRcbiJdfQ==
