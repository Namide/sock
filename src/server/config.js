export default {
    connect: {
        host: '0.0.0.0',
        path: '/chat',
        port: 8000
    },

    chan: {
        start: [{
            name: 'home',
            userMin: 0,
            userMax: Infinity,
            modEnabled: false
        }],
        default: {
            userMin: 1,
            userMax: 100,
            modEnabled: true
        },
        valid: {
            name: name => name.match(/^[_A-Za-z0-9-]{3,10}$/)
        }
    },

    user: {
        default: {
            name: 'guest',
            role: 0
        },
        valid: {
            name: name => name.match(/^[_A-Za-z0-9-]{3,10}$/)
        }
    }
}