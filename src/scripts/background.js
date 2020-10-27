function sendMessageToTheCurrentTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const currentTabID = tabs[0].id;

        chrome.tabs.sendMessage(currentTabID, message);
    });
}

chrome.commands.onCommand.addListener( command => sendMessageToTheCurrentTab({action: command}) );

chrome.runtime.onMessage.addListener( request => {
    if(request.action === "transfer_to_the_current_tab")
        sendMessageToTheCurrentTab(request.message);
});