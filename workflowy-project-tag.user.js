// ==UserScript==
// @name         Workflowy Project Tag
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Set completed-visible within a project. Projects are tagged with #project.
// @author       Mark E Kendrat
// @match        https://*.workflowy.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workflowy.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    const scriptName = GM_info.script.name
    const projectTag = '#project'
    var prevIsInsideProject = false
    function crumbs(cs = [window.WF.currentItem()]) {
        var p = cs[0].getParent()
        return p ? crumbs([p, ...cs]) : cs
    }
    function tags(item) {
        return item.getTagManager().getTagCounts().getTagList().map(x => x.tag)
    }
    const savedWFEventListener = window.WFEventListener
    window.WFEventListener = function(event) {
        savedWFEventListener?.()
        try {
            if (event == 'documentReady' || event == 'locationChanged' || event == 'zoomedOut') {
                const isInsideProject = crumbs().some(item => tags(item).includes(projectTag))
                if (isInsideProject != prevIsInsideProject) {
                    prevIsInsideProject = isInsideProject
                    if (isInsideProject != window.WF.completedVisible()) {
                        window.WF.toggleCompletedVisible()
                    }
                }
            }
        } catch (e) {
            console.log(scriptName, e)
        }
    }
    console.log(scriptName, 'userscript loaded')
})()
