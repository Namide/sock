(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

window.Sock = _client2.default;

},{"./client.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            this.onConnected = onConnected || function (user) {
                console.log('User connected');
            };
            this.onError = onError || function (msg) {
                console.error(msg);
            };

            this.onClose = function (msg) {
                console.log('Socket closed');
            };
            this.onMsgUser = function (name, msg) {
                console.log(name + ":" + msg);
            };
            this.onChanMsg = function (name, msg) {
                console.log(name + ":" + msg);
            };
            this.onServerMsg = function (msg) {
                console.log(msg);
            };
            this.onListChan = function (list) {
                console.log(list);
            };
            this.onUserEvt = function (user, label, data) {
                console.log(label);
            };
            this.onChanEvt = function (label, data) {
                console.log(label);
            };
            this.onServerEvt = function (label, data) {
                console.log(label);
            };
            this.onChanChange = function (chan) {
                console.log('Chan changed');
            };
            this.onChanDataChange = function (data) {
                console.log('data changed');
            };
            this.onChanUserList = function (list) {
                console.log(list);
            };
        }
    }, {
        key: '_initParser',
        value: function _initParser() {
            var _this = this;

            this.parser = new _Parser2.default();
            this.parser.onError = function (errorCode) {
                _this.onError(_this.translate.get(errorCode));
            };

            /*
                this.parser.onChanEvent = (chanTargetId, label, msg) => {}
             */

            // EVENTS

            this.parser.onUserEvent = function (userTargetId, label, msg) {

                var user = _this.getUserById(userTargetId);
                if (label === 'msg') {
                    _this.onMsgUser(user.data.name, msg);
                } else {
                    _this.onUserEvt(user, label, msg);
                }
            };

            this.parser.onChanEvent = function (userTargetId, label, msg) {

                var user = _this.getUserById(userTargetId);
                if (label === 'msg') {
                    _this.onChanMsg(user.data.name, msg);
                } else {
                    _this.onChanEvt(label, msg);
                }
            };

            this.parser.onServerEvent = function (label, msg) {

                if (label === 'msg') {
                    _this.onServerMsg(msg);
                } else if (label === 'error') {
                    var _translate;

                    _this.onServerMsg((_translate = _this.translate).get.apply(_translate, [msg.id].concat(_toConsumableArray(msg.vars))));
                } else {
                    _this.onServerEvt(label, msg);
                }
            };

            this.parser.onChanList = function (list) {

                // Check if you have new players
                var userList = [];
                for (var userData in list) {
                    var user = _this._updateUser(userData, false);
                    userList.push(user);
                }

                _this.chan.replaceUsers(userList);
                _this._dispatchChanUserList();
            };

            this.parser.onServerList = function (list) {

                _this.listChans = list;
                _this._dispatchServerChanList();
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
                _this._setChanData(msg);
            };

            this.parser.onUserData = function (userTargetId, msg) {
                msg.id = userTargetId;
                _this._updateUser(msg);
            };

            this.parser.onServerData = function (msg) {
                console.warn('No update for server data');
            };
        }
    }, {
        key: '_initWebsocket',
        value: function _initWebsocket() {
            var _this2 = this;

            try {
                this.websocket = new WebSocket(this.uri);
                this.websocket.onclose = function (evt) {
                    _this2.onClose(evt.data);
                };
                this.websocket.onmessage = function (evt) {
                    _this2.parser.check(evt.data);
                };
                this.websocket.onerror = function (evt) {
                    _this2.onError(_this2.translate.get(5));
                };

                window.addEventListener('beforeunload', function (evt) {
                    _this2.close();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xpZW50L0NoYW4uanMiLCJzcmMvY2xpZW50L1BhcnNlci5qcyIsInNyYy9jbGllbnQvVHJhbnNsYXRlLmpzIiwic3JjL2NsaWVudC9Vc2VyLmpzIiwic3JjL2NsaWVudC9hcHAuanMiLCJzcmMvY2xpZW50L2NsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBcUIsSTtBQUVqQjs7Ozs7O0FBTUEsa0JBQWEsRUFBYixFQUNBO0FBQUE7O0FBQ0ksYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssSUFBTCxHQUFZLEVBQUUsTUFBRixFQUFaO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7NEJBTUssSSxFQUNMO0FBQ0ksZ0JBQU0sUUFBUSxLQUFLLEtBQW5CO0FBQ1AsZ0JBQUksTUFBTSxPQUFOLENBQWMsSUFBZCxJQUFzQixDQUExQixFQUNPO0FBQ0ksc0JBQU0sSUFBTixDQUFXLElBQVg7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxtQkFBTyxLQUFQO0FBQ0g7OzsrQkFFTyxJLEVBQ1I7QUFDSSxnQkFBTSxRQUFRLEtBQUssS0FBbkI7QUFDUCxnQkFBTSxJQUFJLE1BQU0sT0FBTixDQUFjLElBQWQsQ0FBVjtBQUNPLGdCQUFJLElBQUksQ0FBQyxDQUFULEVBQ0E7QUFDSSxzQkFBTSxNQUFOLENBQWEsQ0FBYixFQUFnQixDQUFoQjtBQUNBLHVCQUFPLElBQVA7QUFDSDtBQUNELG1CQUFPLEtBQVA7QUFDSDs7O3FDQUVhLFEsRUFDZDtBQUNILGlCQUFLLEtBQUwsR0FBYSxRQUFiO0FBQ0k7Ozs7OztrQkE5Q2dCLEk7Ozs7Ozs7Ozs7Ozs7SUNBQSxNO0FBRWpCLHNCQUNBO0FBQUE7O0FBQ0ksYUFBSyxZQUFMLEdBQW9CLFVBQUMsR0FBRCxFQUFTLENBQUUsQ0FBL0I7QUFDQSxhQUFLLFVBQUwsR0FBa0IsVUFBQyxZQUFELEVBQWUsR0FBZixF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Z0JBQUwsQ0FBc0IsSUFBdEI7QUFDSDtBQUNKOzs7Ozs7a0JBamxCZ0IsTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFuXG57XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAgICAgICAgICAgTmFtZSBvZiB0aGUgY2hhbm5lbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzICAgICAgICAgICAgIFBhc3Mgb2YgdGhlIGNoYW5uZWxcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENoYW5EYXRhICBEZWZhdWx0IGRhdGFzIG9mIHRoZSBjaGFubmVsXG4gICAgICogQHJldHVybnMge0NoYW59XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoIGlkIClcbiAgICB7XG4gICAgICAgIHRoaXMudXNlcnMgPSBbXVxuICAgICAgICB0aGlzLmRhdGEgPSB7IGlkIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQWRkIGEgbmV3IHVzZXIgaW4gdGhlIGNoYW5uZWxcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1VzZXJ9IHVzZXJcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgYWRkKCB1c2VyIClcbiAgICB7ICAgICAgICBcbiAgICAgICAgY29uc3QgdXNlcnMgPSB0aGlzLnVzZXJzXG5cdGlmICh1c2Vycy5pbmRleE9mKHVzZXIpIDwgMClcbiAgICAgICAge1xuICAgICAgICAgICAgdXNlcnMucHVzaCh1c2VyKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgXG4gICAgcmVtb3ZlKCB1c2VyIClcbiAgICB7XG4gICAgICAgIGNvbnN0IHVzZXJzID0gdGhpcy51c2Vyc1xuXHRjb25zdCBpID0gdXNlcnMuaW5kZXhPZih1c2VyKVxuICAgICAgICBpZiAoaSA+IC0xKVxuICAgICAgICB7XG4gICAgICAgICAgICB1c2Vycy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIFxuICAgIHJlcGxhY2VVc2VycyggbmV3VXNlcnMgKVxuICAgIHtcblx0dGhpcy51c2VycyA9IG5ld1VzZXJzXG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlclxue1xuICAgIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHRoaXMub25TZXJ2ZXJEYXRhID0gKG1zZykgPT4ge31cbiAgICAgICAgdGhpcy5vbkNoYW5EYXRhID0gKGNoYW5UYXJnZXRJZCwgbXNnKSA9PiB7fVxuICAgICAgICB0aGlzLm9uVXNlckRhdGEgPSAodXNlclRhcmdldElkLCBtc2cpID0+IHt9XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9uU2VydmVyRXZlbnQgPSAobGFiZWwsIG1zZykgPT4ge31cbiAgICAgICAgdGhpcy5vbkNoYW5FdmVudCA9ICh1c2VyVGFyZ2V0SWQsIGxhYmVsLCBtc2cpID0+IHt9XG4gICAgICAgIHRoaXMub25Vc2VyRXZlbnQgPSAodXNlclRhcmdldElkLCBsYWJlbCwgbXNnKSA9PiB7fVxuICAgICAgICBcbiAgICAgICAgdGhpcy5vblNlcnZlckxpc3QgPSAobGlzdCkgPT4ge31cbiAgICAgICAgdGhpcy5vbkNoYW5MaXN0ID0gKGxpc3QpID0+IHt9XG4gICAgICAgIFxuICAgICAgICB0aGlzLm9uRXJyb3IgPSAoY29kZSkgPT4ge31cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHtVc2VyfSBmcm9tXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICAgKi9cbiAgICBjaGVjayggZGF0YSApXG4gICAge1xuICAgICAgICB0cnlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShkYXRhKVxuICAgICAgICAgICAgdGhpcy5fY2hlY2tNc2cobXNnKVxuXHR9XG4gICAgICAgIGNhdGNoKCBldnQgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoMilcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXZ0LCBkYXRhKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9nZXRUeXBlSWRCeURhdGEoIGRhdGEgKVxuICAgIHtcbiAgICAgICAgbGV0IHR5cGUgPSBudWxsXG4gICAgICAgIGxldCBpZCA9IG51bGxcblxuICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihkYXRhKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZSA9IGRhdGFcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGUgPSBkYXRhLnlcbiAgICAgICAgICAgIGlkID0gZGF0YS5pIHx8IG51bGxcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHsgdHlwZSwgaWQgfVxuICAgIH1cbiAgICBcbiAgICBfZGlzcGF0Y2hNc2coIG1zZ1R5cGUsIGZyb21UeXBlLCB0YXJnZXRJZCwgbGFiZWwsIG1zZyApXG4gICAge1xuICAgICAgICBjb25zdCBjb2RlID0gcGFyc2VJbnQobXNnVHlwZSArIDEwICogZnJvbVR5cGUpXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2goIGNvZGUgKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYXNlIDExOiAgICAvLyBldmVudCBmb3IgdXNlclxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25Vc2VyRXZlbnQodGFyZ2V0SWQsIGxhYmVsLCBtc2cpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgMTI6ICAgIC8vIGV2ZW50IGZvciBjaGFuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5FdmVudCh0YXJnZXRJZCwgbGFiZWwsIG1zZylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAxMzogICAgLy8gZXZlbnQgZm9yIHNlcnZlclxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJFdmVudChsYWJlbCwgbXNnKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIDIxOiAgICAvLyBkYXRhIGZvciB1c2VyXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblVzZXJEYXRhKHRhcmdldElkLCBtc2cpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgMjI6ICAgIC8vIGRhdGEgZm9yIGNoYW5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbkRhdGEodGFyZ2V0SWQsIG1zZylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAyMzogICAgLy8gZGF0YSBmb3Igc2VydmVyXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNlcnZlckRhdGEobXNnKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKmNhc2UgMzE6ICAgIC8vIGxpc3QgZm9yIHVzZXJcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfSovXG4gICAgICAgICAgICBjYXNlIDMyOiAgICAvLyBsaXN0IGZvciBjaGFuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5MaXN0KG1zZylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAzMzogICAgLy8gbGlzdCBmb3Igc2VydmVyXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNlcnZlckxpc3QobXNnKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgUGFyc2VyIGVycm9yOiB0aGUgY29tYmluYXRpb24gbWVzc2FnZSB0eXBlOiAke21zZ1R5cGV9IGFuZCBmcm9tIHR5cGU6ICR7ZnJvbVR5cGV9IGRvZXMnbnQgZXhpc3RgKVxuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcigyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIF9jaGVja01zZyggZGF0YSApXG4gICAge1xuICAgICAgICBjb25zdCB7IHk6IHR5cGUsIGw6IGxhYmVsLCB0OiB0YXJnZXQsIG06IG1zZyB9ID0gZGF0YVxuICAgICAgICBcbiAgICAgICAgLy8gR2V0IHRhcmdldCB0eXBlXG4gICAgICAgIGNvbnN0IHsgdHlwZTogdGFyZ2V0VHlwZSwgaWQ6IHRhcmdldElkIH0gPSB0aGlzLl9nZXRUeXBlSWRCeURhdGEodGFyZ2V0KVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcih0eXBlKSB8fCAhTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRUeXBlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdQYXJzZXIgZXJyb3I6IG1lc3NhZ2UgbXVzdCBoYXZlIHR5cGUgYW5kIHRhcmdldCB0eXBlJylcbiAgICAgICAgICAgIHRoaXMub25FcnJvcigyKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPCAxIHx8IHR5cGUgPiAzIHx8IHRhcmdldFR5cGUgPCAxIHx8IHRhcmdldFR5cGUgPiAzKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1BhcnNlciBlcnJvcjogbWVzc2FnZSB0eXBlIGFuZCB0YXJnZXQgdHlwZSBtdXN0IGJlIHNjb3BlZCBiZXR3ZWVuIDAgYW5kIDQnKVxuICAgICAgICAgICAgdGhpcy5vbkVycm9yKDIpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaE1zZyh0eXBlLCB0YXJnZXRUeXBlLCB0YXJnZXRJZCwgbGFiZWwsIG1zZylcbiAgICAgICAgfVxuICAgIH1cbn0iLCJjb25zdCBNRVNTQUdFX0xJU1QgPSB7XG5cbiAgICAwOiB7ZW46ICdDYW4gbm90IGNvbm5lY3QnLFxuICAgICAgICBmcjogJ0Nvbm5leGlvbiBpbXBvc3NpYmxlJ30sXG5cbiAgICAxOiB7ZW46ICdDbGllbnQgdW5kZWZpbmVkIGVycm9yICgkMSknLFxuICAgICAgICBmcjogJ0VycmV1ciBjbGllbnQgaW5kw6lmaW5pZSAoJDEpJ30sXG5cbiAgICAyOiB7ZW46ICdEYXRhIHBhcnNpbmcgc3RvcHBlZDogdHJhbnNmZXJyZWQgZGF0YSBpbmNvbXBsZXRlJyxcbiAgICAgICAgZnI6ICdBbmFseXNlIGRlcyBkb25uw6llcyBzdG9wcMOpLCBkb25uw6llcyB0cmFuc2bDqXLDqWVzIGluY29tcGzDqnRlcyd9LFxuXG4gICAgMzoge2VuOiAnWW91IGFyZSBjb25uZWN0ZWQhJyxcbiAgICAgICAgZnI6ICdWb3VzIMOqdGVzIGNvbm5lY3TDqSAhJ30sXG5cbiAgICA0OiB7ZW46ICdZb3UgYXJlIGRpc2Nvbm5lY3RlZCEnLFxuICAgICAgICBmcjogJ1ZvdXMgw6p0ZXMgZMOpY29ubmVjdMOpICEnfSxcblxuICAgIDU6IHtlbjogJ0Nvbm5lY3Rpb24gc2VydmVyIGVycm9yJyxcbiAgICAgICAgZnI6ICdFcnJldXIgZGUgY29ubmV4aW9uIGF2ZWMgbGUgc2VydmV1cid9LFxuXG4gICAgLy8gQ29tbWFuZHNcbiAgICAxMDE6IHtlbjogJ0NvbW1hbmQgbGFiZWwgdW5kZWZpbmVkICgkMSknLFxuICAgICAgICAgIGZyOiAnQ29tbWFuZGUgaW5kw6lmaW5pZSAoJDEpJ30sXG5cbiAgICAxMDI6IHtlbjogJ1Vua25vd24gY29tbWFuZCAoJDEpJyxcbiAgICAgICAgICBmcjogJ0NvbW1hbmRlIGluY29ubnVlICgkMSknfSxcblxuICAgIDIwMToge2VuOiAnTWVzc2FnZSB0byB1c2VyICQxIGVycm9yICh0ZXh0IG9yIHVzZXIgbmFtZSBlbXB0eSknLFxuICAgICAgICAgIGZyOiAnRXJyZXVyIGRcXCdlbnZvaWUgZGUgbWVzc2FnZSDDoCBsXFwndXRpbGlzYXRldXIgJDEgKHRleHRlIG91IG5vbSBkXFwndXRpbGlzYXRldXIgbWFucXVhbnQpJ30sXG5cbiAgICAvLyBVc2Vyc1xuICAgIDMwMToge2VuOiAnVXNlciBub3QgZm91bmQnLFxuICAgICAgICAgIGZyOiAnTFxcJ3V0aWxpc2F0ZXVyIG5cXCdhIHBhcyDDqXTDqSB0cm91dsOpJ30sXG5cbiAgICAzMDI6IHtlbjogJ1lvdSBkb25cXCd0IGhhdmUgcGVybWlzc2lvbiB0byBjaGFuZ2UgY2hhbiBkYXRhICQxJyxcbiAgICAgICAgICBmcjogJ1ZvdXMgblxcJ2F2ZXogcGFzIGxhIHBlcm1pc3Npb24gZGUgY2hhbmdlciBsZXMgZG9ubsOpZXMgZHUgc2Fsb24gJDEnfSxcblxuICAgIDMwMzoge2VuOiAnWW91IGNhbiBvbmx5IHVzZSBhbHBoYW51bWVyaWMsIGh5cGhlbiBhbmQgdW5kZXJzY29yZSBiZXR3ZWVuIDMgYW5kIDEwIGNoYXJhY3RlcnMgaW4gYW4gdXNlciBuYW1lIGJ1dCB5b3UgaGF2ZSB3cml0ZSAkMScsXG4gICAgICAgICAgZnI6ICdQb3VyIHVuIG5vbSBkXFwndXRpbGlzYXRldXIgdm91cyBuZSBwb3V2ZXogdXRpbGlzZXIgcXVlIGRlcyBjYXJhY3TDqHJlcyBsYXRpbiBzdGFuZGFydHMgKG1pbnVzY3VsZXMsIG1hanVzY3VsZXMpLCBkZXMgY2hpZmZyZXMsIGRlcyB0aXJldHMgZXQgZGVzIHVuZGVyc2NvcmVzIGVudHJlIDMgZXQgMTAgY2FyYWN0w6hyZXMgbWFpcyB2b3VzIGF2ZXogw6ljcmlzICQxJ30sXG5cbiAgICAzMDQ6IHtlbjogJ05hbWUgdW5kZWZpbmVkJyxcbiAgICAgICAgICBmcjogJ05vbSBpbmTDqWZpbmlzJ30sXG5cbiAgICAzMDU6IHtlbjogJ1RoZSBuYW1lICQxIGlzIGFscmVhZHkgdXNlZCcsXG4gICAgICAgICAgZnI6ICdMZSBub20gJDEgZXN0IGTDqWrDoCB1dGlsaXPDqSd9LFxuXG4gICAgMzA2OiB7ZW46ICdOYW1lIHVuZGVmaW5lZCcsXG4gICAgICAgICAgZnI6ICdOb20gaW5kw6lmaW5pcyd9LFxuXG4gICAgMzA3OiB7ZW46ICdZb3UgY2FuXFwndCBjaGFuZ2UgeW91ciByb2xlJyxcbiAgICAgICAgICBmcjogJ1ZvdXMgbmUgcG91dmV6IHBhcyBjaGFuZ2VyIHZvdHJlIHLDtGxlJ30sXG5cbiAgICAzMDg6IHtlbjogJ0EgdXNlciBldmVudCBtdXN0IGhhdmUgYSBsYWJlbCBwcm9wZXJ0eSAoJDEpJyxcbiAgICAgICAgICBmcjogJ1VuIMOpdsOqbmVtZW50IHV0aWxpc2F0ZXVyIGRvaXQgYXZvaXIgdW5lIHByb3ByacOpdMOpIFxcJ2xhYmVsXFwnICgkMSknfSxcblxuICAgIDMwOToge2VuOiAnWW91IGNhblxcJ3QgY2hhbmdlIHRoZSByb2xlIG9mICQxIGlmIHlvdSBhcmUgbm90IG1vZGVyYXRvcicsXG4gICAgICAgICAgZnI6ICdWb3VzIG5lIHBvdXZleiBwYXMgY2hhbmdlciBsZSByb2xlIGRlICQxIHNpIHZvdXMgblxcJ8OqdGVzIHBhcyBtb2TDqXJhdGV1cid9LFxuXG4gICAgMzEwOiB7ZW46ICdZb3UgZG9uXFwndCBoYXZlIHBlcm1pc3Npb24gdG8gY2hhbmdlIGRhdGEgJDEgb2YgJDInLFxuICAgICAgICAgIGZyOiAnVm91cyBuXFwnYXZleiBwYXMgbGEgcGVybWlzc2lvbiBkZSBjaGFuZ2VyIGxhIGRvbm7DqWUgJDEgZGUgJDInfSxcblxuICAgIDMxMToge2VuOiAnWW91IGRvblxcJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGtpY2sgJDEgZnJvbSAkMicsXG4gICAgICAgICAgZnI6ICdWb3VzIG5cXCdhdmV6IHBhcyBsYSBwZXJtaXNzaW9uIGRcXCdleHB1bHNlciAkMSBkdSBzYWxvbiAkMid9LFxuXG4gICAgMzEyOiB7ZW46ICckMSBpcyBhbHJlYWR5ICQyJyxcbiAgICAgICAgICBmcjogJyQxIGVzdCBkw6lqw6AgJDInfSxcblxuICAgIC8vIENoYW5cbiAgICA0MDE6IHtlbjogJ1lvdSBkb25cXCd0IGhhdmUgcGVybWlzc2lvbiB0byBjaGFuZ2UgdGhlIHBhc3Mgb2YgdGhlIGNoYW4nLFxuICAgICAgICAgIGZyOiAnVm91cyBuXFwnYXZleiBwYXMgbGEgcGVybWlzc2lvbiBkZSBjaGFuZ2VyIGxlIG1vdCBkZSBwYXNzZSBkdSBzYWxvbid9LFxuXG4gICAgNDAyOiB7ZW46ICdUaGUgbmFtZSAkMSBpcyBhbHJlYWR5IHVzZWQnLFxuICAgICAgICAgIGZyOiAnTGUgbm9tICQxIGVzdCBkw6lqw6AgdXRpbGlzw6knfSxcblxuICAgIDQwMzoge2VuOiAnTmFtZSB1bmRlZmluZWQnLFxuICAgICAgICAgIGZyOiAnTm9tIGluZMOpZmluaXMnfSxcblxuICAgIDQwNDoge2VuOiAnWW91IGNhbiBvbmx5IHVzZSBhbHBoYW51bWVyaWMsIGh5cGhlbiBhbmQgdW5kZXJzY29yZSBiZXR3ZWVuIDMgYW5kIDEwIGNoYXJhY3RlcnMgaW4gYSBjaGFuIG5hbWUgYnV0IHlvdSBoYXZlIHdyaXRlICQxJyxcbiAgICAgICAgICBmcjogJ1BvdXIgdW4gbm9tIGRlIHNhbG9uIHZvdXMgbmUgcG91dmV6IHV0aWxpc2VyIHF1ZSBkZXMgY2FyYWN0w6hyZXMgbGF0aW4gc3RhbmRhcnRzIChtaW51c2N1bGVzLCBtYWp1c2N1bGVzKSwgZGVzIGNoaWZmcmVzLCBkZXMgdGlyZXRzIGV0IGRlcyB1bmRlcnNjb3JlcyBlbnRyZSAzIGV0IDEwIGNhcmFjdMOocmVzIG1haXMgdm91cyBhdmV6IMOpY3JpcyAkMSd9LFxuXG4gICAgNDA1OiB7ZW46ICdBIGNoYW4gZXZlbnQgbXVzdCBoYXZlIGEgbGFiZWwgcHJvcGVydHkgKCQxKScsXG4gICAgICAgICAgZnI6ICdVbiDDqXbDqm5lbWVudCBkZSBzYWxvbiBkb2l0IGF2b2lyIHVuZSBwcm9wcmnDqXTDqSBcXCdsYWJlbFxcJyAoJDEpJ30sXG5cbiAgICA0MDY6IHtlbjogJ1lvdSBjYW5cXCd0IGpvaW4gdGhlIGNoYW4gJDEnLFxuICAgICAgICAgIGZyOiAnVm91cyBuXFwnw6p0ZXMgcGFzIGF1dG9yaXPDqSDDoCByZWpvaW5kcmUgbGUgc2Fsb24gJDEpJ30sXG5cbiAgICA0MDc6IHtlbjogJ1lvdSBjYW5cXCd0IGNyZWF0ZSB0aGUgY2hhbiAkMScsXG4gICAgICAgICAgZnI6ICdJbCBlc3QgaW1wb3NzaWJsZSBkZSBjcsOpZXIgbGUgc2Fsb24gJDEpJ30sXG5cbiAgICAvLyBNZXNzYWdlc1xuICAgIDUwMToge2VuOiAnJDEgY2hhbmdlIGhpcyBuYW1lIHRvICQyJyxcbiAgICAgICAgICBmcjogJyQxIHNcXCdhcHBlbGUgZMOpc29ybWFpcyAkMid9LFxuXG4gICAgNTAyOiB7ZW46ICckMSBoYXMgYmVlbiBraWNrZWQgYnkgJDInLFxuICAgICAgICAgIGZyOiAnJDEgYSDDqXTDqSBleHB1bHPDqSBwYXIgJDInfSxcblxuICAgIDUwMzoge2VuOiAnWW91IGhhdmUgYmVlbiBraWNrZWQgYnkgJDEnLFxuICAgICAgICAgIGZyOiAnVm91cyBhdmV6IMOpdMOpIGV4cHVsc8OpIHBhciAkMSd9LFxuXG4gICAgNTA0OiB7ZW46ICckMSBsZWF2ZSB0aGUgY2hhbiAkMicsXG4gICAgICAgICAgZnI6ICckMSBhIHF1aXR0w6kgbGUgc2Fsb24gJDInfSxcblxuICAgIDUwNToge2VuOiAnJDEgam9pbiB0aGUgY2hhbiAkMicsXG4gICAgICAgICAgZnI6ICckMSBhIHJlam9pbmQgbGUgc2Fsb24gJDInfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFuc2xhdGVcbntcbiAgICBjb25zdHJ1Y3RvciggbGFuZyApXG4gICAge1xuICAgICAgICB0aGlzLmxhbmcgPSBsYW5nXG4gICAgfVxuICAgIFxuICAgIGdldCggaWQsIC4uLmRhdGFzIClcbiAgICB7XG4gICAgICAgIGNvbnN0IGxhbmcgPSB0aGlzLmxhbmdcbiAgICAgICAgXG4gICAgICAgIGlmIChNRVNTQUdFX0xJU1RbaWRdID09IHVuZGVmaW5lZCB8fCBNRVNTQUdFX0xJU1RbaWRdW2xhbmddID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWQgPSAxO1xuICAgICAgICAgICAgZGF0YSA9IFsnaWQ6ICcgKyBpZF07XG5cdH1cbiAgICAgICAgXG4gICAgICAgIGxldCByYXcgPSBNRVNTQUdFX0xJU1RbaWRdW2xhbmddXG5cdGxldCBpID0gZGF0YXMubGVuZ3RoO1xuXHR3aGlsZSAoLS1pID4gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdyA9IHJhdy5yZXBsYWNlKCckJyArIChpICsgMSksIGRhdGFzW2ldKVxuXHR9XG5cdFxuXHRyZXR1cm4gcmF3XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBtZXNzYWdlIGZvciB0aGUgY29kZS4gRXhhbXBsZTpcbiAgICAgKiBcbiAgICAgKiBjb25zdCBtZXNzYWdlMSA9IHtcbiAgICAgKiAgZW46ICdZb3UgYXJlIHRvIHlvdW5nIHRvIGNvbm5lY3QgaGVyZScsXG4gICAgICogIGZyOiAnVHUgZXMgdHJvcCBqZXVuZSBwb3VyIHRlIGNvbm5lY3RlciBpY2knXG4gICAgICogfVxuICAgICAqIGFkZCggMTAwMSwgbWVzc2FnZTEgfVxuICAgICAqIFxuICAgICAqIGNvbnN0IG1lc3NhZ2UyID0ge1xuICAgICAqICBlbjogJ1lvdSBhcmUga2lsbGVkIGJ5ICQxIGFzc2lzdGVkIGJ5ICQyJyxcbiAgICAgKiAgZnI6ICdUdSBhcyDDqXTDqSB0dcOpIHBhciAkMSBhc3Npc3TDqSBkZSAkMidcbiAgICAgKiB9XG4gICAgICogYWRkKCAxMDAyLCBtZXNzYWdlMiB9XG4gICAgICogXG4gICAgICogXG4gICAgICogXG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSBjb2RlICAgICAgICBDb2RlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWVzc2FnZXMgICAgIE9iamVjdCBjb250YWluIG1lc3NhZ2VzIGJ5IGxhbmd1YWdlXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICBhZGQoIGNvZGUsIG1lc3NhZ2VzIClcbiAgICB7XG4gICAgICAgIGlmIChNRVNTQUdFX0xJU1RbY29kZV0gIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBUaGUgZXJyb3IgY29kZSAke2NvZGV9IGFscmVhZHkgZXhpc3RgKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgTUVTU0FHRV9MSVNUW2NvZGVdID0gbWVzc2FnZXNcbiAgICAgICAgfVxuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyXG57XG4gICAgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge31cblx0XG5cdHRoaXMub25EYXRhTmFtZUNoYW5nZSA9IHRlbXAgPT4ge31cblx0dGhpcy5vbkRhdGFDaGFuZ2UgPSB0ZW1wID0+IHt9XG4gICAgICAgIHRoaXMub25MZWF2ZSA9IHRlbXAgPT4ge31cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSByb2xlIG9mIHRoZSB1c2VyOlxuICAgICAqIC0gMCA+IFNpbXBsZSB1c2VyXG4gICAgICogLSAxID4gTW9kZXJhdG9yOiBJdCdzIHRoZSBtYW5hZ2VyIG9mIGhpcyBjaGFubmVsXG4gICAgICogLSAyID4gQWRtaW46IEl0J3MgdGhlIG1hbmFnZXIgb2YgdGhlIHNlcnZlclxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtJbnRlZ2VyfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBnZXRSb2xlKClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEucm9sZSB8fCAwXG4gICAgfVxufSIsImltcG9ydCBDbGllbnQgZnJvbSAnLi9jbGllbnQuanMnXG5cbndpbmRvdy5Tb2NrID0gQ2xpZW50IiwiaW1wb3J0IENoYW4gZnJvbSAnLi9DaGFuLmpzJ1xuaW1wb3J0IFVzZXIgZnJvbSAnLi9Vc2VyLmpzJ1xuaW1wb3J0IFRyYW5zbGF0ZSBmcm9tICcuL1RyYW5zbGF0ZS5qcydcbmltcG9ydCBQYXJzZXIgZnJvbSAnLi9QYXJzZXIuanMnXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50XG57XG4gICAgY29uc3RydWN0b3IoIFVSSSwgb25Db25uZWN0ZWQgPSBudWxsLCBvbkVycm9yID0gbnVsbCwgbGFuZyA9ICdlbicgKVxuICAgIHtcbiAgICAgICAgdGhpcy51c2VycyA9IFtdIC8vIGFsbCwgbWUgdG9vXG5cbiAgICAgICAgdGhpcy5tZSA9IG51bGxcbiAgICAgICAgdGhpcy5jaGFuID0gbnVsbFxuXG4gICAgICAgIHRoaXMudXJpID0gVVJJXG4gICAgICAgIHRoaXMudHJhbnNsYXRlID0gbmV3IFRyYW5zbGF0ZShsYW5nKVxuXG4gICAgICAgIHRoaXMubGlzdENoYW5zID0gW11cbiAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBudWxsXG5cbiAgICAgICAgdGhpcy5faW5pdERpc3BhdGNoZXIob25Db25uZWN0ZWQsIG9uRXJyb3IpXG4gICAgICAgIHRoaXMuX2luaXRXZWJzb2NrZXQoKVxuICAgICAgICB0aGlzLl9pbml0UGFyc2VyKClcbiAgICB9XG4gICAgXG4gICAgX2luaXREaXNwYXRjaGVyKCBvbkNvbm5lY3RlZCwgb25FcnJvciApXG4gICAge1xuICAgICAgICB0aGlzLm9uQ29ubmVjdGVkID0gb25Db25uZWN0ZWQgfHwgKHVzZXIgPT4geyBjb25zb2xlLmxvZygnVXNlciBjb25uZWN0ZWQnKSB9KVxuICAgICAgICB0aGlzLm9uRXJyb3IgPSBvbkVycm9yIHx8IChtc2cgPT4geyBjb25zb2xlLmVycm9yKG1zZykgfSlcbiAgICAgICAgXG4gICAgICAgIHRoaXMub25DbG9zZSA9IG1zZyA9PiB7IGNvbnNvbGUubG9nKCdTb2NrZXQgY2xvc2VkJykgfVxuICAgICAgICB0aGlzLm9uTXNnVXNlciA9IChuYW1lLCBtc2cpID0+IHsgY29uc29sZS5sb2cobmFtZSArIFwiOlwiICsgbXNnKSB9XG4gICAgICAgIHRoaXMub25DaGFuTXNnID0gKG5hbWUsIG1zZykgPT4geyBjb25zb2xlLmxvZyhuYW1lICsgXCI6XCIgKyBtc2cpIH1cbiAgICAgICAgdGhpcy5vblNlcnZlck1zZyA9IG1zZyA9PiB7IGNvbnNvbGUubG9nKG1zZykgfVxuICAgICAgICB0aGlzLm9uTGlzdENoYW4gPSBsaXN0ID0+IHsgY29uc29sZS5sb2cobGlzdCkgfVxuICAgICAgICB0aGlzLm9uVXNlckV2dCA9ICh1c2VyLCBsYWJlbCwgZGF0YSkgPT4geyBjb25zb2xlLmxvZyhsYWJlbCkgfVxuICAgICAgICB0aGlzLm9uQ2hhbkV2dCA9IChsYWJlbCwgZGF0YSkgPT4geyBjb25zb2xlLmxvZyhsYWJlbCkgfVxuICAgICAgICB0aGlzLm9uU2VydmVyRXZ0ID0gKGxhYmVsLCBkYXRhKSA9PiB7IGNvbnNvbGUubG9nKGxhYmVsKSB9XG4gICAgICAgIHRoaXMub25DaGFuQ2hhbmdlID0gY2hhbiA9PiB7IGNvbnNvbGUubG9nKCdDaGFuIGNoYW5nZWQnKSB9XG4gICAgICAgIHRoaXMub25DaGFuRGF0YUNoYW5nZSA9IGRhdGEgPT4geyBjb25zb2xlLmxvZygnZGF0YSBjaGFuZ2VkJykgfVxuICAgICAgICB0aGlzLm9uQ2hhblVzZXJMaXN0ID0gbGlzdCA9PiB7IGNvbnNvbGUubG9nKGxpc3QpIH1cbiAgICB9XG4gICAgXG4gICAgX2luaXRQYXJzZXIoKVxuICAgIHtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBuZXcgUGFyc2VyKClcbiAgICAgICAgdGhpcy5wYXJzZXIub25FcnJvciA9IGVycm9yQ29kZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoIHRoaXMudHJhbnNsYXRlLmdldCggZXJyb3JDb2RlICkgKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLypcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLm9uQ2hhbkV2ZW50ID0gKGNoYW5UYXJnZXRJZCwgbGFiZWwsIG1zZykgPT4ge31cbiAgICAgICAgICovXG4gICAgICAgIFxuICAgICAgICAvLyBFVkVOVFNcblxuICAgICAgICB0aGlzLnBhcnNlci5vblVzZXJFdmVudCA9ICggdXNlclRhcmdldElkLCBsYWJlbCwgbXNnICkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5nZXRVc2VyQnlJZCggdXNlclRhcmdldElkIClcbiAgICAgICAgICAgIGlmIChsYWJlbCA9PT0gJ21zZycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1zZ1VzZXIodXNlci5kYXRhLm5hbWUsIG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVXNlckV2dCh1c2VyLCBsYWJlbCwgbXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBhcnNlci5vbkNoYW5FdmVudCA9ICggdXNlclRhcmdldElkLCBsYWJlbCwgbXNnICkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5nZXRVc2VyQnlJZCggdXNlclRhcmdldElkIClcbiAgICAgICAgICAgIGlmIChsYWJlbCA9PT0gJ21zZycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNoYW5Nc2codXNlci5kYXRhLm5hbWUsIG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hhbkV2dChsYWJlbCwgbXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnBhcnNlci5vblNlcnZlckV2ZW50ID0gKGxhYmVsLCBtc2cpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGxhYmVsID09PSAnbXNnJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VydmVyTXNnKG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxhYmVsID09PSAnZXJyb3InKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJNc2codGhpcy50cmFuc2xhdGUuZ2V0KG1zZy5pZCwgLi4ubXNnLnZhcnMpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJFdnQobGFiZWwsIG1zZylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICB0aGlzLnBhcnNlci5vbkNoYW5MaXN0ID0gKGxpc3QpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgeW91IGhhdmUgbmV3IHBsYXllcnNcbiAgICAgICAgICAgIGNvbnN0IHVzZXJMaXN0ID0gW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgdXNlckRhdGEgaW4gbGlzdClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5fdXBkYXRlVXNlcih1c2VyRGF0YSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgdXNlckxpc3QucHVzaCh1c2VyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNoYW4ucmVwbGFjZVVzZXJzKHVzZXJMaXN0KVxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hDaGFuVXNlckxpc3QoKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJzZXIub25TZXJ2ZXJMaXN0ID0gKGxpc3QpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5saXN0Q2hhbnMgPSBsaXN0XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaFNlcnZlckNoYW5MaXN0KClcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLyogVE9ET1xuICAgICAgIFxuICAgICAgICBjYXNlIFwiY2hhbi1hZGRlZFwiIDpcblxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdENoYW5zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdENoYW5zID0gW107XG5cbiAgICAgICAgICAgIHRoaXMubGlzdENoYW5zLnB1c2goZC5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoU2VydmVyQ2hhbkxpc3QoKTtcblxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImNoYW4tcmVtb3ZlZFwiIDpcblxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdENoYW5zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdENoYW5zID0gW107XG5cbiAgICAgICAgICAgIHZhciBpID0gdGhpcy5saXN0Q2hhbnMuaW5kZXhPZihkLmRhdGEpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0Q2hhbnMuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaFNlcnZlckNoYW5MaXN0KCk7XG5cbiAgICAgICAgICAgIGJyZWFrOyovXG4gICAgXG5cblxuICAgICAgICAvLyBEQVRBU1xuICAgICAgICB0aGlzLnBhcnNlci5vbkNoYW5EYXRhID0gKGNoYW5UYXJnZXRJZCwgbXNnKSA9PiB7XG4gICAgICAgICAgICBtc2cuaWQgPSBjaGFuVGFyZ2V0SWRcbiAgICAgICAgICAgIHRoaXMuX3NldENoYW5EYXRhKG1zZylcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJzZXIub25Vc2VyRGF0YSA9ICh1c2VyVGFyZ2V0SWQsIG1zZykgPT4ge1xuICAgICAgICAgICAgbXNnLmlkID0gdXNlclRhcmdldElkXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVVc2VyKG1zZylcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5wYXJzZXIub25TZXJ2ZXJEYXRhID0gKG1zZykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdObyB1cGRhdGUgZm9yIHNlcnZlciBkYXRhJylcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBfaW5pdFdlYnNvY2tldCgpXG4gICAge1xuXHR0cnlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMudXJpKVxuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQub25jbG9zZSA9IGV2dCA9PiB7IHRoaXMub25DbG9zZShldnQuZGF0YSkgfVxuICAgICAgICAgICAgdGhpcy53ZWJzb2NrZXQub25tZXNzYWdlID0gZXZ0ID0+IHsgdGhpcy5wYXJzZXIuY2hlY2soZXZ0LmRhdGEpIH1cbiAgICAgICAgICAgIHRoaXMud2Vic29ja2V0Lm9uZXJyb3IgPSBldnQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcih0aGlzLnRyYW5zbGF0ZS5nZXQoNSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBldnQgPT4geyB0aGlzLmNsb3NlKCkgfSwgZmFsc2UpXG5cdH1cbiAgICAgICAgY2F0Y2ggKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcih0aGlzLnRyYW5zbGF0ZS5nZXQoMCkpXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSlcblx0fVxuICAgIH1cbiAgICBcbiAgICBfc2VuZCggZGF0YSApXG4gICAge1xuICAgICAgICB0aGlzLndlYnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBjaGFuIG9yIHRvIGEgdXNlclxuICAgICpcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtc2dcdFx0WW91ciBtZXNzYWdlXG4gICAgKiBAcGFyYW0ge1VzZXI/fSB1c2VyXHRcdEZhY3VsdGF0aXZlLCBpZiBpdCdzIG51bGw6IHRoZSBtZXNzYWdlIGlzIHNlbmQgdG8gYWxsIHRoZSBjaGFuXG4gICAgKi9cbiAgICBzZW5kTXNnKCBtc2csIHVzZXIgPSBudWxsIClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRVc2VyRXZ0KCAnbXNnJywgbXNnLCB1c2VyIClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGFuIGV2ZW50LlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbFx0XHRMYWJlbCBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVx0XHREYXRhcyBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge1VzZXJ9IHVzZXJcdFx0RmFjdWx0YXRpdmUsIHRhcmdldCBvZiB0aGUgZXZlbnQgKGlmIGl0J3MgbnVsbCwgdGhlIHRhcmdldCBpcyB5b3UpXG4gICAgICovXG4gICAgc2VuZFVzZXJFdnQoIGxhYmVsLCBkYXRhLCB1c2VyID0gbnVsbCApXG4gICAge1xuICAgICAgICBpZiAodXNlciA9PT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmQoe1xuICAgICAgICAgICAgICAgIHk6IDEsXG4gICAgICAgICAgICAgICAgbDogbGFiZWwsXG4gICAgICAgICAgICAgICAgdDogeyB5OiAyLCBpOiB0aGlzLmNoYW4uZGF0YS5pZCB9LFxuICAgICAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2VuZCh7XG4gICAgICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgICAgICBsOiBsYWJlbCxcbiAgICAgICAgICAgICAgICB0OiB7IHk6IDEsIGk6IHVzZXIuZGF0YS5pZCB9LFxuICAgICAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgZGF0YShzKSBvZiBhIHVzZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXHRcdERhdGEgd2l0aCBuZXcgaW5mb3JtYXRpb25cbiAgICAgKiBAcGFyYW0ge1VzZXI/fSB1c2VyXHRcdEZhY3VsdGF0aXZlLCB0YXJnZXQ6IGlmIG51bGwgdGhlIHRhcmdldCBpcyB5b3VcbiAgICAgKi9cbiAgICBzZW5kVXNlckRhdGEoIGRhdGEsIHVzZXIgPSBudWxsIClcbiAgICB7XG4gICAgICAgIGNvbnN0IHQgPSB7XG4gICAgICAgICAgICB5OiAxLFxuICAgICAgICAgICAgaTogKHVzZXIgPT09IG51bGwpID8gdGhpcy5tZS5kYXRhLmlkIDogdXNlci5kYXRhLmlkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fc2VuZCh7XG4gICAgICAgICAgICB5OiAyLFxuICAgICAgICAgICAgdCxcbiAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGFuIGV2ZW50IHRvIHRoZSBjaGFuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsXHRMYWJlbCBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVx0XHREYXRhcyBvZiB0aGUgZXZlbnRcbiAgICAgKi9cbiAgICBzZW5kQ2hhbkV2dCggbGFiZWwsIGRhdGEgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbmQoe1xuICAgICAgICAgICAgeTogMSxcbiAgICAgICAgICAgIGw6IGxhYmVsLFxuICAgICAgICAgICAgdDogeyB5OjIsIGk6dGhpcy5jaGFuLmRhdGEuaWQgfSxcbiAgICAgICAgICAgIG06IGRhdGFcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIGEgZGF0YSBvZiB0aGUgY2hhbiAoeW91IG11c3QgdG8gaGF2ZSB0aGUgbW9kZXJhdG9yIG9mIHRoZSBjaGFuKVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcdFx0TmV3IGRhdGEgdG8gY2hhbmdlXG4gICAgICovXG4gICAgc2VuZENoYW5EYXRhKCBkYXRhIClcbiAgICB7XG4gICAgICAgIGNvbnN0IHQgPSB7XG4gICAgICAgICAgICB5OiAyLFxuICAgICAgICAgICAgaTogdGhpcy5jaGFuLmRhdGEuaWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zZW5kKHtcbiAgICAgICAgICAgIHk6IDIsXG4gICAgICAgICAgICB0LFxuICAgICAgICAgICAgbTogZGF0YVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICogR2V0IGFsbCB0aGUgY2hhbnMgb2YgdGhlIHNlcnZlciAoYXN5bmNocm9udXMgZnVuY3Rpb24pXG4gICAgKiBcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHRcdEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBsaXN0IGlzIHJldHVybiAobGlrZSBvbkxpc3RDaGFuKVxuICAgICovXG4gICAgbGlzdGVuQ2hhbkxpc3QoIGNhbGxiYWNrIClcbiAgICB7XG4gICAgICAgIHRoaXMub25MaXN0Q2hhbiA9IGNhbGxiYWNrXG4gICAgICAgIHRoaXMubGlzdENoYW5zID0gW10gICAgICAgIFxuICAgICAgICB0aGlzLl9zZW5kKHtcbiAgICAgICAgICAgIHk6IDMsXG4gICAgICAgICAgICB0OiAyLFxuICAgICAgICAgICAgbDogMVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICogU3RvcCBsaXN0ZW4gdGhlIGNoYW4gbGlzdFxuICAgICovXG4gICAgc3RvcExpc3RlbkNoYW5zKClcbiAgICB7XG4gICAgICAgIHRoaXMuX3NlbmQoe1xuICAgICAgICAgICAgeTogMyxcbiAgICAgICAgICAgIHQ6IDIsXG4gICAgICAgICAgICBsOiAwXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMub25MaXN0Q2hhbiA9IG51bGxcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgKiBDaGFuZ2UgdGhlIGNoYW4uXG4gICAgKlxuICAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5OYW1lXHRcdE5hbWUgb2YgdGhlIG5ldyBjaGFuXG4gICAgKiBAcGFyYW0ge1N0cmluZz99IGNoYW5QYXNzXHRcdEZhY3VsdGF0aXZlIHBhc3Mgb2YgdGhlIG5ldyBjaGFuXG4gICAgKi9cbiAgICBqb2luQ2hhbiggY2hhbk5hbWUsIGNoYW5QYXNzID0gJycgKVxuICAgIHtcbiAgICAgICAgdGhpcy5zZW5kVXNlckRhdGEoe1xuICAgICAgICAgICAgY2hhbjoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGNoYW5OYW1lLFxuICAgICAgICAgICAgICAgIHBhc3M6IGNoYW5QYXNzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgLyoqXG4gICAgKiBDaGFuZ2UgeW91ciBuYW1lLlxuICAgICpcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdOYW1lXHRcdFlvdXIgbmV3IG5hbWVcbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHRDYWxsZWQgd2hlbiB0aGUgbmFtZSBpcyBjaGFuZ2VkXG4gICAgKi9cbiAgICBjaGFuZ2VVc2VyTmFtZSggbmV3TmFtZSwgY2FsbGJhY2sgKVxuICAgIHtcbiAgICAgICAgdGhpcy5tZS5vbkRhdGFOYW1lQ2hhbmdlID0gY2FsbGJhY2tcbiAgICAgICAgdGhpcy5zZW5kVXNlckRhdGEoe1xuICAgICAgICAgICAgbmFtZTogbmV3TmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgLyoqXG4gICAgKiBDaGFuZ2UgdGhlIG5hbWUgb2YgdGhlIGNoYW4uXG4gICAgKlxuICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld05hbWVcdFx0TmV3IG5hbWUgb2YgdGhlIGNoYW5cbiAgICAqL1xuICAgIGNoYW5nZUNoYW5OYW1lKCBuZXdOYW1lIClcbiAgICB7XG4gICAgICAgIHRoaXMuc2VuZENoYW5EYXRhKHtcbiAgICAgICAgICAgIG5hbWU6IGNoYW5OYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAvKipcbiAgICAqIEtpY2sgYSB1c2VyIG91dCBvZiB0aGUgY2hhbiAob25seSBpZiB5b3UgYXJlIG1vZGVyYXRvcilcbiAgICAqXG4gICAgKiBAcGFyYW0ge1VzZXJ9IHVzZXJcdFx0VXNlciB0byBraWNrXG4gICAgKi9cbiAgICBraWNrVXNlciggdXNlciApXG4gICAge1xuICAgICAgICB0aGlzLnNlbmRVc2VyRGF0YSh7Y2hhbjp7aWQ6IC0xfX0sIHVzZXIpXG4gICAgfVxuXG4gICAvKipcbiAgICAqIFVwIGEgdXNlciB0byBiZSBtb2RlcmF0b3IgKG9ubHkgaWYgeW91IGFyZSBtb2RlcmF0b3IpXG4gICAgKlxuICAgICogQHBhcmFtIHt1c2VyfSB1c2VyXHRcdFVzZXIgdG8gYmUgbW9kZXJhdG9yXG4gICAgKi9cbiAgICB1cFRvTW9kZXJhdG9yKCB1c2VyIClcbiAgICB7XG4gICAgICAgIHRoaXMuc2VuZFVzZXJEYXRhKHtyb2xlOiAxfSwgdXNlcilcbiAgICB9XG5cbiAgICBjbG9zZSgpXG4gICAge1xuICAgICAgICB0aGlzLndlYnNvY2tldC5jbG9zZSgpXG4gICAgfVxuICAgIFxuICAgIHJlbW92ZVVzZXIoIHVzZXIgKVxuICAgIHtcblx0Y29uc3QgaSA9IHRoaXMudXNlcnMuaW5kZXhPZih1c2VyKVxuXHRpZiAodXNlckkgPiAtMSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy51c2Vycy5zcGxpY2UodXNlckksIDEpXG4gICAgICAgICAgICB0aGlzLmNoYW4ucmVtb3ZlVXNlcih1c2VyKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXHR9XG5cdFxuXHRyZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgXG4gICAgZ2V0VXNlckJ5TmFtZSggbmFtZSApXG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy51c2Vycy5maW5kKCB1ID0+IHUuZGF0YS5uYW1lID09PSBuYW1lICkgfHwgbnVsbFxuICAgIH1cbiAgICBcbiAgICBnZXRVc2VyQnlJZCggaWQgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNlcnMuZmluZCggdSA9PiB1LmRhdGEuaWQgPT09IGlkICkgfHwgbnVsbFxuICAgIH1cbiAgICBcbiAgICBfdXBkYXRlVXNlciggZGF0YSwgZGlzcGF0Y2ggPSB0cnVlIClcbiAgICB7XG5cdGlmICh0aGlzLm1lID09IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubWUgPSBuZXcgVXNlcigpXG4gICAgICAgICAgICB0aGlzLl9zZXRVc2VyRGF0YShkYXRhLCB0aGlzLm1lLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChkaXNwYXRjaClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaENvbm5lY3RlZCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJNc2codGhpcy50cmFkLmdldCgzKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lXG5cdH1cblx0XG5cdHZhciB1ID0gdGhpcy5nZXRVc2VyQnlJZChkYXRhLmlkKVxuXHRpZiAodSAhPT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fc2V0VXNlckRhdGEoZGF0YSwgdSlcblx0fVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHUgPSBuZXcgVXNlcigpXG4gICAgICAgICAgICB0aGlzLl9zZXRVc2VyRGF0YShkYXRhLCB1KVxuXG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2gpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hDaGFuVXNlckxpc3QoKVxuICAgICAgICAgICAgfVxuXHR9XG5cblx0cmV0dXJuIHVcbiAgICB9XG4gICAgXG4gICAgX2Rpc3BhdGNoVXNlckRhdGFDaGFuZ2UoIHVzZXIsIGRhdGEgKVxuICAgIHtcbiAgICAgICAgaWYgKHVzZXIub25EYXRhQ2hhbmdlICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVzZXIub25EYXRhQ2hhbmdlKGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vblVzZXJEYXRhQ2hhbmdlICE9IG51bGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25Vc2VyRGF0YUNoYW5nZSh1c2VyLCBkYXRhKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgX2Rpc3BhdGNoQ2hhblVzZXJMaXN0KClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLm9uQ2hhblVzZXJMaXN0KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhblVzZXJMaXN0KHRoaXMuY2hhbi51c2VycylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kaXNwYXRjaFNlcnZlckNoYW5MaXN0KClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLm9uTGlzdENoYW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25MaXN0Q2hhbih0aGlzLmxpc3RDaGFucylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIF9kaXNwYXRjaENvbm5lY3RlZCgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3RlZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RlZCh0aGlzLm1lKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgX2Rpc3BhdGNoQ2hhbkNoYW5nZSgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy5vbkNoYW5EYXRhQ2hhbmdlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbkRhdGFDaGFuZ2UodGhpcy5jaGFuLmRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vbkNoYW5DaGFuZ2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuQ2hhbmdlKHRoaXMuY2hhbilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoQ2hhblVzZXJMaXN0KClcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hTZXJ2ZXJDaGFuTGlzdCgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFVzZXJEYXRhKCBkYXRhLCB1c2VyLCBkaXNwYXRjaCA9IHRydWUgKVxuICAgIHtcbiAgICAgICAgaWYgKGRhdGEuaWQgIT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgdXNlci5kYXRhLmlkID0gZGF0YS5pZFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBcIm5hbWVcIilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvbGROYW1lID0gdXNlci5kYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgdXNlci5kYXRhLm5hbWUgPSBkYXRhLm5hbWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzcGF0Y2gpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlci5vbkRhdGFOYW1lQ2hhbmdlICE9IG51bGwgJiYgZGF0YS5uYW1lICE9IG9sZE5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIub25EYXRhTmFtZUNoYW5nZSgpXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkTmFtZSAhPSBudWxsICYmIG9sZE5hbWUgIT0gZGF0YS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VydmVyTXNnKHRoaXMudHJhZC5nZXQoNTAxLCBbb2xkTmFtZSwgZGF0YS5uYW1lXSkpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQ2hhblVzZXJMaXN0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgPT09IFwiY2hhblwiKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh1c2VyICE9PSB0aGlzLm1lKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY2hhbi5pZCAhPT0gdGhpcy5jaGFuLmRhdGEuaWQpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbi5yZW1vdmUodXNlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25TZXJ2ZXJNc2codGhpcy50cmFkLmdldCg1MDQsIFt1c2VyLmRhdGEubmFtZSwgdGhpcy5jaGFuLmRhdGEubmFtZV0pKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGF0Y2gpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hDaGFuVXNlckxpc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW4uam9pbih1c2VyKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNlcnZlck1zZyh0aGlzLnRyYWQuZ2V0KDUwNSwgW3VzZXIuZGF0YS5uYW1lLCB0aGlzLmNoYW4uZGF0YS5uYW1lXSkpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXNwYXRjaClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaENoYW5Vc2VyTGlzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXNlci5kYXRhW2tleV0gPSBkYXRhW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoVXNlckRhdGFDaGFuZ2UodXNlciwgZGF0YSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q2hhbkRhdGEoIGRhdGEgKVxuICAgIHtcbiAgICAgICAgbGV0IG5ld0NoYW4gPSBmYWxzZVxuICAgICAgICBpZiAodGhpcy5jaGFuID09IG51bGwgfHwgdGhpcy5jaGFuLmRhdGEuaWQgIT09IGRhdGEuaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbiA9IG5ldyBDaGFuKGRhdGEuaWQpXG4gICAgICAgICAgICBuZXdDaGFuID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5jaGFuLmRhdGFba2V5XSA9IGRhdGFba2V5XVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0NoYW4pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQ2hhbkNoYW5nZSgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vbkNoYW5EYXRhQ2hhbmdlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbkRhdGFDaGFuZ2UoZGF0YSlcbiAgICAgICAgfVxuICAgIH0gIFxufSJdfQ==
