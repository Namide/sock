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

export default {

    debug: true,
    
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
            name: name =>  name.match(/^[_A-Za-z0-9-]{3,10}$/)
        }
    },

    user: {
        default: {
            name: 'guest',
            role: 0
        },
        valid: {
            name: name =>  name.match(/^[_A-Za-z0-9-]{3,10}$/)
        }
    }
}