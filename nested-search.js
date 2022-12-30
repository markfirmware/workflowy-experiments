(function () {
    'use strict'
    try {
        const defaultAncestorQuery = '#meeting'
        const defaultDescendantQuery = '@client'
        var ancestorLeaves, descendantLeaves
        const steps = [
            function () {
                search('ancestors', defaultAncestorQuery, true)
            },
            function () {
                ancestorLeaves = getCurrentLeaves()
                search('descendants', defaultDescendantQuery)
            },
            function () {
                descendantLeaves = getCurrentLeaves()
                removeButtonLabeledNext()
                const found = showMatchingAncestorLinks(ancestorLeaves, descendantLeaves)
                if (found) {
                    clearSearch()
                }
            }
        ]
        const wfApi = {
            clearSearch: WF.clearSearch,
            currentItem: WF.currentItem,
            currentSearchQuery: WF.currentSearchQuery,
            hideMessage: WF.hideMessage,
            search: WF.search,
            showMessage: WF.showMessage,
            zoomTo: WF.zoomTo,
        }
        function showMatchingAncestorLinks(ancestorSearch, descendantSearch) {
            prompt(`search for ${ancestorSearch.query} then ${descendantSearch.query}`)
            const ancestorsAsLeafIds = new Set(ancestorSearch.leaves.map(n => n.getId()))
            var table = null
            var count = 0
            for (const descendant of descendantSearch.leaves) {
                const matchingAncestor = descendant.getAncestors().find(ancestor => ancestorsAsLeafIds.has(ancestor.getId()))
                if (matchingAncestor) {
                    count += 1
                    if (count == 1) {
                        table = addElement(scrollingDiv, 'table', tableStyle)
                        const header = addElement(table, 'tr', tableStyle)
                        addElement(header, 'th', tableStyle).innerHTML = 'ancestor'
                        addElement(header, 'th', tableStyle).innerHTML = 'descendant'
                    }
                    const row = addElement(table, 'tr', tableStyle)
                    addCell(row, matchingAncestor, descendant.getNameInPlainText())
                    addCell(row, descendant, '')
                }
            }
            rightSpan.innerHTML = `${count ? count : 'none'} found`
        }
        function addCell(row, node, query) {
            const td = addElement(row, 'td', tableStyle)
            const anchor = addElement(td, 'a')
            anchor.innerHTML = node.getNameInPlainText()
            anchor.addEventListener('click', e => {
                wfApi.hideMessage()
                wfApi.zoomTo(node)
                if (query) {
                    wfApi.search(query)
                }
            })
        }
        function clearSearch() {
            wfApi.clearSearch()
        }
        function runNextStep() {
            steps[nextStepNumber - 1]()
            if (nextStepNumber == 0) {
                wfApi.hideMessage()
            } else {
                nextStepNumber += 1
            }
        }
        function getLeaves(here, l = []) {
            const descendants = here.getVisibleChildren()
            if (descendants.length == 0) {
                l.push(here)
            } else {
                for (const next of descendants) {
                    getLeaves(next, l)
                }
            }
            return l
        }
        function getCurrentLeaves() {
            const node = wfApi.currentItem()
            const leaves = getLeaves(node)
            return { node, query: wfApi.currentSearchQuery(), leaves }
        }
        function addElement(parent, tag, attributes = {}) {
            const element = document.createElement(tag)
            for (const key in attributes) {
                const attr = document.createAttribute(key)
                attr.value = attributes[key]
                element.setAttributeNode(attr)
            }
            parent.appendChild(element)
            return element
        }
        const tableStyle = { style: 'text-align: left; border: 1px solid black' }
        function search(what, q, keepCurrentQuery = false) {
            prompt(`searching for ${what}, change search box as desired`)
            if (!(keepCurrentQuery && wfApi.currentSearchQuery())) {
                wfApi.search(q)
            }
        }
        function prompt(text) {
            promptSpan.innerHTML = text
        }
        function removeButtonLabeledNext() {
            nextButton.remove()
        }
        var nextStepNumber = 1
        const appDivId = `showmessage.div.${Date.now()}${Math.random()}`
        wfApi.showMessage(`<div id=${appDivId}></div>`)
        const appDiv = document.getElementById(appDivId)
        const alignDiv = addElement(appDiv, 'div', { style: 'text-align: left' })
        const promptSpan = addElement(alignDiv, 'span')
        const rightSpan = addElement(alignDiv, 'span',
            { style: 'position: absolute; right: 50px; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%)' })
        const nextButton = addElement(rightSpan, 'input', { type: 'button', value: 'next' })
        const scrollingDiv = addElement(appDiv, 'div', { 'style': 'max-height: 100px; overflow: auto' })
        nextButton.addEventListener('click', e => {
            runNextStep()
        })
        runNextStep()
    } catch (e) {
        console.log(e)
    }
})()
