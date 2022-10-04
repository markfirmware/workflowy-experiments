// ==UserScript==
// @name         WorkflowyTabClient
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Demo browser tab receiving Workflowy events
// @author       Mark E Kendrat
// @match        https://workflowy.com
// @match        https://beta.workflowy.com
// @match        https://dev.workflowy.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workflowy.com
// @grant        none
// ==/UserScript==

(() => {
    'use strict'
    const script_name = 'WorkflowyTabClient'

    function program(supplied_channel_name) {
        const trap = f => {
            return (...args) => {
                try {
                    return f(...args)
                } catch (e) {
                    console.log('trap', script_name, e)
                }
            }
        }
        const openClientWindow = channel_name => {
            const page = `
            <html>
                <title>${channel_name}</title>
                <head>
                    <script type="module">
                        try {
                            (${program})("${channel_name}")
                        } catch (exception) {
                            console.log("exception", script_name, "${channel_name}", exception)
                        }
                    \x3c/script>
                </head>
                <body>
                    <div>Please open the javascript console with control-shift-i to see received workflowy events.</div>
                    <div>These events are passed through a web browser BroadcastChannel.</div>
                    <div>The channel can also be used to send requests to the workflowy tab and receive responses.</div>
                </body>
            </html>`
            const w = window.open()
            if (w) {
                const d = w.document
                d.open()
                d.write(page)
                d.close()
            } else {
                console.log(script_name, 'could not open window/tab - perhaps enable pop-ups from workflowy.com?')
            }
        }
        const Broadcast = (() => {
            var rx, tx
            const createChannel = name => {
                tx = new BroadcastChannel(name)
                rx = new BroadcastChannel(name)
                rx.addEventListener('message', trap(message => console.log(JSON.stringify(message.data))))
            }
            const post = message => tx.postMessage(message)
            return { createChannel, post }
        })()
        if (supplied_channel_name) {
            Broadcast.createChannel(supplied_channel_name)
            Broadcast.post({ messageName: 'ClientActive' })
        } else {
            if (window.WFEventListener === undefined) {
                const channel_name = script_name + '.' + Date.now()
                Broadcast.createChannel(channel_name)
                openClientWindow(channel_name)
                Broadcast.post({ messageName: 'ServerActive'})
                window.WFEventListener = trap(eventName => Broadcast.post({ messageName: 'WfEvent', eventName }))
                console.log('window.WFEventListener set by', script_name)
            } else {
                console.log('window.WFEventListener unavailable for', script_name)
            }
        }
    }

    program('')

    console.log(script_name, 'userscript loaded')
})()
