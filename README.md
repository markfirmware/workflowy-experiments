# workflowy-experiments
Workflowy Experiments - scripts

# dates-updater.user.js

This will update items in relation to dates.
It will add a leading 0 to single digit dates, and a leading space to single digit hours. It will remove tarailing spaces.

In order to not interfere with data entry, the item will not be updated until the editor loses focus on that item.

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Install this script via this link: [dates-updater.user.js](https://github.com/markfirmware/workflowy-experiments/raw/master/dates-updater.user.js)


# WorkflowyTabClient.user.js

This will open a new tab/window (you must enable pop-ups from workflowy.com) and will print in the console log of the new window any events from the workflowy tab. This is accomplished by using a web browser BroadcastChannel.

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Install this script via this link: [WorkflowyTabClient.user.js](https://github.com/markfirmware/workflowy-experiments/raw/master/WorkflowyTabClient.user.js)

