// A organização por módulos não foi feita, já que o content-script não oferece suporte. Soluções alternativas podem quebrar as APIs que o Chrome disponibiliza

const contentScriptHeight = 476;
const contentScriptWidth = 360;
const buttonsToolbarSelector =	"div.fr-toolbar"
const answerContentSelector = 	"div.fr-wrapper > div.fr-view";

// Observer para lançar evento customizado quando um diálogo abrir, pois o evento "open" para diálogo não existe nativamente
const dialogObserver = new MutationObserver( mutations => {
	mutations.forEach( (mutation) => {
		if(mutation.attributeName !== "open") { return; }

		if(mutation.target.hasAttribute("open"))
			mutation.target.dispatchEvent(new CustomEvent('open'));
	});
});

function checkIfTheButtonsToolbarWasLoaded() {
	return document.querySelector(buttonsToolbarSelector);
}

const initialize = setInterval( () => {
	if (document.readyState === "complete" && checkIfTheButtonsToolbarWasLoaded()) {
		addC3BCButton();
		clearInterval(initialize);
	}
}, 20);

function addC3BCButton() {
	const cod3rButton = document.createElement("button");
	cod3rButton.innerHTML = "Cod3r";
	cod3rButton.setAttribute("id", "cod3r-button");
	cod3rButton.setAttribute("type", "button");
	cod3rButton.setAttribute("tabindex", -1);
	cod3rButton.setAttribute("role", "button");
	cod3rButton.setAttribute("title", "Adicionar respostas padrões");
	cod3rButton.classList.add("fr-command", "fr-btn", "fr-btn-font_awesome");
	cod3rButton.setAttribute("style", "font-weight: bold; padding: 12px; width: auto;");

	cod3rButton.addEventListener("mousedown", clickEvent => {
		if(clickEvent.button !== 0) return;

		clickEvent.preventDefault();
		showC3CBDialog();
	});

	const buttonsToolbarElement = document.querySelector(buttonsToolbarSelector);
	buttonsToolbarElement.insertAdjacentElement("beforeend", cod3rButton);

	// Observer para checar mudanças no toolbar de botões. É necessário, pois, sempre que o usuário redimenciona o browser, o botão adicionado é movido para o ínicio e recebe uma classe
	// que o deixa invisível
	const checkAndMakeSureThatC3BCButtomIsVisibleObserver = new MutationObserver(CheckAndMakeSureThatC3BCButtomIsVisible);
	checkAndMakeSureThatC3BCButtomIsVisibleObserver.observe(cod3rButton, { attributes : true })
}

function CheckAndMakeSureThatC3BCButtomIsVisible(mutations) {
	mutations.forEach( mutationRecord => {
		const mutatedElement = mutationRecord.target
		if(mutatedElement.classList.contains("fr-hidden")) {
			mutatedElement.classList.remove("fr-hidden")
    		mutatedElement.parentNode.appendChild(mutatedElement.parentNode.firstElementChild);
		}
	});
}

(function addC3CBDialog() {
	const C3CBDialogElement = document.createElement("dialog");
	C3CBDialogElement.id = "C3BC-dialog";
	C3CBDialogElement.setAttribute(
		"style",
		`	
			position: fixed;
			height:${contentScriptHeight}px;
			width:${contentScriptWidth}px;
			margin: 0;
			padding: 0;
			border: none;
			border-radius: 10px;
			background-color:white;
			box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
		`
	);

	C3CBDialogElement.innerHTML = `<iframe src=${chrome.extension.getURL("index.html")} style="height:100%; width:100%;" frameBorder="0"></iframe>`;

	// usando o Observer para observar o díalogo C3BC e emitir o evento "open"
	dialogObserver.observe(C3CBDialogElement, {attributes: true});

	C3CBDialogElement.addEventListener("open", () => {
		positionDialog();
	});

	C3CBDialogElement.addEventListener("click", dialogClickOutsideHandler);
	window.addEventListener("resize", positionDialog);

	document.body.appendChild(C3CBDialogElement);
})();

function positionDialog() {
	// Essa checagem é necessária, pois os cálculos a seguir dependem da posição do botão da cod3r, que, por sua vez, só estará disponível se o toolbar-buttons tiver sido carregado
	// e ele só é carregado após o primeiro clique em "escreva uma resposta"
	if( !checkIfTheButtonsToolbarWasLoaded() ) return;

	const C3CBDialogElement = document.getElementById("C3BC-dialog");
	const cod3rButtonElement = document.getElementById("cod3r-button")

	const cod3rButtonRect = cod3rButtonElement.getBoundingClientRect();

	// quando a página tem tamanho menor maior que 767, a visuação é diferente
	if(document.body.getBoundingClientRect().width > 767) {
		C3CBDialogElement.style.top = cod3rButtonRect.top-contentScriptHeight < 0 ? `0px` : `${cod3rButtonRect.top-contentScriptHeight}px`;
		C3CBDialogElement.style.left = `${cod3rButtonRect.right - contentScriptWidth}px`;
	} else {
		C3CBDialogElement.style.top = `${cod3rButtonRect.bottom}px`;

		// 17 é a largura do scroolbar. Usamos aqui para o diálogo não o sobrepor
		if( (cod3rButtonRect.right + contentScriptWidth) < document.body.getBoundingClientRect().width - 17)
			C3CBDialogElement.style.left = `${cod3rButtonRect.right}px`;
		else if( (cod3rButtonRect.right - cod3rButtonRect.width/2 + contentScriptWidth/2) < document.body.getBoundingClientRect().width - 17 )
			C3CBDialogElement.style.left = `${cod3rButtonRect.right - cod3rButtonRect.width/2 - contentScriptWidth/2}px`;
		else
			C3CBDialogElement.style.left = `12px`;
	}
}

function showC3CBDialog() {
	const C3CBDDialogElement = document.getElementById("C3BC-dialog");
	C3CBDDialogElement.showModal();
}

function insertAnswerInDOM(answerHTML) {
	const answerContentElement = document.querySelector(answerContentSelector);

	if(answerContentElement.querySelector("p:first-child > br"))
		answerContentElement.innerHTML = answerHTML;
	else
		answerContentElement.innerHTML += answerHTML;

	const breakRowElement = document.createElement('p');
	breakRowElement.appendChild(document.createElement('br'));

	answerContentElement.appendChild(breakRowElement);
}

function scrollAnswerContentToTheBottom() {
	const answerContentParentElement = document.querySelector(answerContentSelector).parentNode;
	answerContentParentElement.scrollTo(0, answerContentParentElement.scrollHeight);
}

function injectScript(functionToBeExecuted) {
    const scriptCode = '(' + functionToBeExecuted + ')();'
	const scriptElement = document.createElement('script');
	scriptElement.textContent = scriptCode;

	(document.head||document.documentElement).appendChild(scriptElement);
	scriptElement.remove();
}

// É preciso injetar essa função, pois, assim, a instância do JQuery em execução na página será utilizada, então haverá acesso à função froalaEditor
function HidePlaceholderAndEnableReplySendByMarkingRichEditorContentAsChanged() {
	const froalaRichEditorSelector = "div.froala-editor-instance"

	$(froalaRichEditorSelector).froalaEditor('events.trigger', 'contentChanged');
}

function addAnswer(answerHTML) {
	insertAnswerInDOM(answerHTML);
	scrollAnswerContentToTheBottom();
	injectScript(HidePlaceholderAndEnableReplySendByMarkingRichEditorContentAsChanged);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
		addAnswer(request.answerContent);
		sendResponse({farewell: "Resposta adicionada"});
});

// fonte: https://stackoverflow.com/questions/50037663/how-to-close-a-native-html-dialog-when-clicking-outside-with-javascript
function dialogClickOutsideHandler(event) {
    if (event.target.tagName !== 'DIALOG') // previne problema com formulários
        return;

    const rect = event.target.getBoundingClientRect();

    const clickedInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
    );

    if (!clickedInDialog) {
		chrome.runtime.sendMessage({message: "resetar tabGroup"});
		event.target.close();
	}
}