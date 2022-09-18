// ==UserScript==
// @name         WorkflowyDatesUpdater
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Update dates and trailing spaces
// @author       Mark E Kendrat
// @match        https://workflowy.com
// @match        https://beta.workflowy.com
// @match        https://dev.workflowy.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workflowy.com
// @grant        none
// ==/UserScript==

(() => {
    'use strict'
    const script_name = 'WorkflowyDatesUpdater'
    const improvedDatesAndSpaces = original => {
        var improved = original
        // remove all spaces at end of line
        improved = improved.replace(/ +$/, '')
        // put 0 in front of all single digit dates
        improved = improved.replaceAll(/, (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d), /g, ', $1 0$2, ')
        // put space in front of all single digit hours
        improved = improved.replaceAll(/ at (\d):(\d\d)(am|pm)/g, ' at  $1:$2$3')
        return improved
    }
    const saved_wfeventlistener = window.WFEventListener
    var is_active = false, last_focused_item = null
    window.WFEventListener = event => {
        try {
            saved_wfeventlistener?.(event)
            if (is_active) {
                console.log(script_name, 'ignored nested event', event)
                return
            } else {
                is_active = true
                if (last_focused_item && (last_focused_item.getId() != window.WF.focusedItem()?.getId()
                                          || event == 'operation--bulk_create')) {
                    var original = last_focused_item.getName()
                    var improved = improvedDatesAndSpaces(original)
                    if (improved != original) {
                        window.WF.setItemName(last_focused_item, improved)
                        console.log(script_name, event, 'item updated', improved)
                    }
                }
                last_focused_item = window.WF.focusedItem()
                is_active = false
            }
        } catch (exception) {
            console.log(script_name, 'WFEventListener', exception)
        }
    }
    console.log(script_name, 'userscript loaded')
})()
