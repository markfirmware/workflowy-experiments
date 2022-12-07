// ==UserScript==
// @name         Workflowy Project Tag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set completed-visible within a project. Projects are tagged with #project.
// @author       Mark E Kendrat
// @match        https://*.workflowy.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workflowy.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict'
    const scriptName = 'Workflowy Project Tag'
    const projectTag = '#project'
    var lastIsInsideProject = false
    function crumbs(cs = [window.WF.currentItem()]) {
        var p = cs[0].getParent()
        return p ? crumbs([p, ...cs]) : cs
    }
    function tags(item) {
        return item.getTagManager().getTagCounts().getTagList().map(x => x.tag)
    }
    function isItemInsideProject(item) {
        return crumbs().some(item => tags(item).includes(projectTag))
    }
    function setVisibility() {
        const item = window.WF.currentItem()
        const isInside = isItemInsideProject(item)
        if (isInside != lastIsInsideProject) {
            lastIsInsideProject = isInside
            console.log('transition', isInside)
            if (isInside != window.WF.completedVisible()) {
                window.WF.toggleCompletedVisible()
                console.log('toggled')
            }
        }
    }
    var savedWFEventListener = window.WFEventListener
    window.WFEventListener = function(event) {
        savedWFEventListener?.()
        try {
            if (event == 'documentReady' || event == 'locationChanged' || event == 'zoomedOut') {
                setVisibility()
            }
        } catch (e) {
            console.log(scriptName, e)
        }
    }
    console.log(scriptName, 'loaded')
})()
