const   UdemyURLExp = /www\.udemy\.com\/instructor\/communication\/qa\//,
        Cod3rURLExp = /www\.cod3r\.com\.br\/courses\/take\/.+\/discussions\//,
        showPageActionRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlMatches: UdemyURLExp.source + "|" + Cod3rURLExp.source, schemes: ['https']}
                })
            ],
            actions: [ new chrome.declarativeContent.ShowPageAction() ]
        };

function sendMessageToTheCurrentTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const currentTabID = tabs[0].id;

        chrome.tabs.sendMessage(currentTabID, message);
    });
}

// aqui, aplicamos as regras para pageAction estar disponível somente na Cod3r e Udemy
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([showPageActionRule]);
    });
});

chrome.commands.onCommand.addListener( command => sendMessageToTheCurrentTab({action: command}) );

chrome.runtime.onMessage.addListener( request => {
    if(request.action === "transfer_to_the_current_tab")
        sendMessageToTheCurrentTab(request.message);
});