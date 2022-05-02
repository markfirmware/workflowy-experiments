(function () {
    var lostFocus = function(item) {
        var original = item.getName()                
        var modified = original

        // remove all spaces at end of line
        modified = modified.replace(/ +$/, '')

        // put 0 in front of single digit date
        modified = modified.replaceAll(/, (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d), /g, ', $1 0$2, ')

        // put space in front of single digit hour
        modified = modified.replaceAll(/ at (\d):(\d\d)(am|pm)/g, ' at  $1:$2$3')

        if (modified != original) {
            WF.setItemName(item, modified)
        }
    }

    var last_focused_item = WF.focusedItem()
    var is_handler_active = false
    var handler = function (event) {
        if (is_handler_active) {
            // ignored nested event
            return
        }
        is_handler_active = true
        try {
            if (last_focused_item &&
                    (last_focused_item.getUrl() != WF.focusedItem()?.getUrl() ||
                    event == 'operation--bulk_create')) {
                lostFocus(last_focused_item)
            }
        } catch (e) {
            console.log(e)
        }
        last_focused_item = WF.focusedItem()
        is_handler_active = false
    }

    window.WFEventListener = handler.bind(this)
})()
