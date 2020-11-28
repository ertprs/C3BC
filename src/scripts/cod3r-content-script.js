// A organização por módulos não foi feita, já que o content-script não oferece suporte. Soluções alternativas podem quebrar as APIs que o Chrome disponibiliza

const 	contentScriptHeight = 476,
		contentScriptWidth = 360,
		cod3rButtonID = 				"cod3r-button",
		C3BCDialogID = 					"C3BC-dialog",
		buttonsToolbarSelector =		"div.fr-toolbar",
		answerContentSelector = 		"div.fr-wrapper > div.fr-view",
    discussionContentSelector = 	".course-player__course-discussions",
    answerBoxOpenButtonSelector = "button.course-player__course-discussion__reply-add",
		pageContentElement = 			document.getElementById("page-content"),
		// Observer para lançar evento customizado quando um diálogo abrir, pois o evento "open" para diálogo não existe nativamente
		dialogObserver = 				new MutationObserver(checkForMutationsToMakeSureTheOpenEventIsDispatchedWhenADialogOpens),
		pageContentObserver = 			new MutationObserver(checkForMutationsToEnableDiscussionContentObserverIfItWasLoaded),
    discussionContentObserver = 	new MutationObserver(checkForMutationsToMakeSureTheC3BCButtonIsAdded);

pageContentObserver.observe(pageContentElement, { childList: true, subtree: true });

(function addC3BCDialog() {
	const C3BCDialogElement = document.createElement("dialog");
	C3BCDialogElement.id = C3BCDialogID;
	C3BCDialogElement.setAttribute(
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

	C3BCDialogElement.innerHTML = `<iframe src=${chrome.extension.getURL("index.html")} style="height:100%; width:100%;" frameBorder="0"></iframe>`;

	// usando o Observer para observar o díalogo C3BC e emitir o evento "open"
	dialogObserver.observe(C3BCDialogElement, {attributes: true});

	C3BCDialogElement.addEventListener("open", () => {
		positionDialog();
		sendMessageThatC3BCDialogWasOpen();
	});

	C3BCDialogElement.addEventListener("close", () => {
		sendMessageThatC3BCDialogWasClosed();
	});

	C3BCDialogElement.addEventListener("click", dialogClickOutsideHandler);
	window.addEventListener("resize", positionDialog);

	document.body.appendChild(C3BCDialogElement);
})();

(function addCustomFonts() {
	const styleElement = document.createElement('style');
	styleElement.textContent =
	`
		@font-face {
			font-family: 'Oxanium';
			src: url( ${ chrome.extension.getURL('assets/fonts/Oxanium-SemiBold.ttf') } ) format("truetype");
		};
	`
	document.head.appendChild(styleElement);
})();

function checkForMutationsToEnableDiscussionContentObserverIfItWasLoaded() {
	const discussionContentElement = pageContentElement.querySelector(discussionContentSelector);

	if(discussionContentElement) {
		discussionContentObserver.observe(discussionContentElement, { childList: true });
		pageContentObserver.disconnect();
	}
}

function checkForMutationsToMakeSureTheC3BCButtonIsAdded() {
	const buttonsToolbarElement = document.querySelector(buttonsToolbarSelector);
	const cod3rButtonElement = document.getElementById(cod3rButtonID);

	if(buttonsToolbarElement && !cod3rButtonElement) {
    addC3BCButton();

    // reposicionamos o diálogo, já que a posição dele é relativa ao botão
    positionDialog();
  }
}

function addC3BCButton() {
	const cod3rButtonElement = document.createElement("button");
	cod3rButtonElement.innerHTML = "COD3R";
	cod3rButtonElement.setAttribute("id", cod3rButtonID);
	cod3rButtonElement.setAttribute("type", "button");
	cod3rButtonElement.setAttribute("tabindex", -1);
	cod3rButtonElement.setAttribute("role", "button");
	cod3rButtonElement.setAttribute("title", "Adicionar respostas padrões");
	cod3rButtonElement.classList.add("fr-command", "fr-btn", "fr-btn-font_awesome");
	cod3rButtonElement.setAttribute("style", "font-family: 'Oxanium', cursive; font-weight: bold; padding: 12px; width: auto;");

	cod3rButtonElement.addEventListener("mousedown", clickEvent => {
		if(clickEvent.button !== 0) return;

		clickEvent.preventDefault();
		showC3BCDialog();
	});

	const buttonsToolbarElement = document.querySelector(buttonsToolbarSelector);
	buttonsToolbarElement.insertAdjacentElement("beforeend", cod3rButtonElement);

	// Observer para checar mudanças no toolbar de botões. É necessário, pois, sempre que o usuário redimensiona o browser, o botão adicionado é movido para o ínicio e recebe uma classe
	// que o deixa invisível
	const CheckAndMakeSureThatC3BCButtomIsVisibleWhenThePageIsResizedObserver = new MutationObserver(CheckAndMakeSureThatC3BCButtomIsVisibleWhenThePageIsResized);
	CheckAndMakeSureThatC3BCButtomIsVisibleWhenThePageIsResizedObserver.observe(cod3rButtonElement, { attributes : true });
}

function CheckAndMakeSureThatC3BCButtomIsVisibleWhenThePageIsResized(mutations, mutationObserver) {
	mutations.forEach( mutationRecord => {
		const mutatedElement = mutationRecord.target;
		if(mutatedElement.classList.contains("fr-hidden")) {
			mutatedElement.classList.remove("fr-hidden");
			mutationObserver.takeRecords();

			//aqui, movemos o botão novamente para final
    		mutatedElement.parentNode.appendChild(mutatedElement.parentNode.firstElementChild);
		}
	});
}

function checkForMutationsToMakeSureTheOpenEventIsDispatchedWhenADialogOpens(mutations) {
	mutations.forEach( mutation => {
		if(mutation.attributeName !== "open") return;

		if(mutation.target.hasAttribute("open"))
			mutation.target.dispatchEvent(new CustomEvent('open'));
	});
}

// o posicionamento do diálogo será relativo ao posicionamento do botão
function positionDialog() {
	const cod3rButtonElement = document.getElementById(cod3rButtonID);
	if( !cod3rButtonElement ) return;

	const cod3rButtonRect = cod3rButtonElement.getBoundingClientRect();
	const C3BCDialogElement = document.getElementById(C3BCDialogID);

	// quando a página tem tamanho menor maior que 767, a visuação é diferente
	if(document.body.getBoundingClientRect().width > 767) {
		// alinha Diálogo à direita do botão
		C3BCDialogElement.style.left = `${cod3rButtonRect.right - contentScriptWidth}px`;

		if(cod3rButtonRect.top-contentScriptHeight < 0) {
			// alinha Diálogo abaixo ou ao topo da viewport
			C3BCDialogElement.style.top = cod3rButtonRect.bottom + contentScriptHeight < window.innerHeight ? `${cod3rButtonRect.bottom}px` : `0px`;

			if(C3BCDialogElement.style.left = C3BCDialogElement.style.top === `0px`)
				// alinha Diálogo à esquerda do botão
				C3BCDialogElement.style.left = `${cod3rButtonRect.left - contentScriptWidth}px`;
		}
		else
			// alinha Diálogo acima do viewport
			C3BCDialogElement.style.top = `${cod3rButtonRect.top-contentScriptHeight}px`;
	} else {
		const scrollbarWidth = 17;
		const rightLimitInViewport = document.body.getBoundingClientRect().width - scrollbarWidth;
		const leftBorderOfPortView = 0;

		// alinha Diálogo abaixo do botão
		C3BCDialogElement.style.top = `${cod3rButtonRect.bottom}px`;

		// alinha Diálogo à direita do botão
		if( (cod3rButtonRect.right + contentScriptWidth) < rightLimitInViewport)
			C3BCDialogElement.style.left = `${cod3rButtonRect.right}px`;
		else
			if( (cod3rButtonRect.left + cod3rButtonRect.width/2 - contentScriptWidth/2) > leftBorderOfPortView &&
				(cod3rButtonRect.right - cod3rButtonRect.width/2 + contentScriptWidth/2) < rightLimitInViewport)
					// alinha Diálogo ao meio do botão
					C3BCDialogElement.style.left = `${cod3rButtonRect.right - cod3rButtonRect.width/2 - contentScriptWidth/2}px`;
		else
			// alinha Diálogo na borda esquerda da viewport
			C3BCDialogElement.style.left = `12px`;
	}
}

function openAnswerBox() {
  const answerBoxOpenButton = document.querySelector(answerBoxOpenButtonSelector);

  if(answerBoxOpenButton) answerBoxOpenButton.click();
}

function showC3BCDialog() {
  const C3BCDialogElement = document.getElementById(C3BCDialogID);
  openAnswerBox()
	C3BCDialogElement.showModal();
}

function insertAnswerInDOM(answerHTML) {
  return new Promise( (resolve, reject) => {
    const answerContentElement = document.querySelector(answerContentSelector);

    if(!answerContentElement) reject(new Error('Pergunta não adicionada, pois não foi identificada uma caixa de resposta.'));

    if(answerContentElement.querySelector("p:first-child > br"))
      answerContentElement.innerHTML = answerHTML;
    else
      answerContentElement.innerHTML += answerHTML;

    const breakRowElement = document.createElement('p');
    breakRowElement.appendChild(document.createElement('br'));

    answerContentElement.appendChild(breakRowElement);

    resolve();
  });
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

// É preciso injetar essa função, pois, assim, a instância do JQuery em execução na página será utilizada, então haverá acesso à função froalaEditor, pertencente ao editor rico da Cod3r
// é necessário que o seletor do editor rico esteja aqui literalmente, pois, como essa função será injetada, perderá a referência a qualquer variável fora do escopo da própria função
function HidePlaceholderAndEnableReplySendByMarkingRichEditorContentAsChanged() {
	const answerRichEditorSelector = ".froala-editor-instance";

	$(answerRichEditorSelector).froalaEditor('events.trigger', 'contentChanged');
}

function addAnswer(answerHTML, origination) {
  openAnswerBox();
  insertAnswerInDOM(answerHTML)
    .then(() => {
      scrollAnswerContentToTheBottom();
      injectScript(HidePlaceholderAndEnableReplySendByMarkingRichEditorContentAsChanged);
    })
    .catch( error => {
      if(origination == 'page_action')
        sendMessageToThePageAction({isNotification: true, content: error.message});
      else sendMessageToTheCurrentTab({isNotification: true, content: error.message});
    });
}

// inspiração: https://stackoverflow.com/questions/50037663/how-to-close-a-native-html-dialog-when-clicking-outside-with-javascript
function checkIfClickWasInTheC3BCDialog(clickEvent) {
	if (clickEvent.target.tagName !== 'DIALOG') return; // previne problema com formulários

    const C3BCDialogRect = clickEvent.target.getBoundingClientRect();

    const clickedInDialog = (
        C3BCDialogRect.top <= clickEvent.clientY &&
        clickEvent.clientY <= C3BCDialogRect.top + C3BCDialogRect.height &&
        C3BCDialogRect.left <= clickEvent.clientX &&
        clickEvent.clientX <= C3BCDialogRect.left + C3BCDialogRect.width
	);

	return clickedInDialog
}

function dialogClickOutsideHandler(clickEvent) {
	const C3BCDialog = 	clickEvent.target;

	if( !checkIfClickWasInTheC3BCDialog(clickEvent) ) C3BCDialog.close();
}

function toggleC3BCDialog() {
	const C3BCDialogElement = document.getElementById("C3BC-dialog");

	if( C3BCDialogElement.hasAttribute("open") )
		C3BCDialogElement.close();
	else
    showC3BCDialog();
}

function sendMessageToTheCurrentTab(message) {
	chrome.runtime.sendMessage({type: 'to_the_current_tab', ...message});
}

function sendMessageToThePageAction(message) {
	chrome.runtime.sendMessage({type: 'to_the_page_action', ...message});
}

function sendMessageThatC3BCDialogWasClosed() {
	sendMessageToTheCurrentTab({info: "C3BC_closed"});
}

function sendMessageThatC3BCDialogWasOpen() {
	sendMessageToTheCurrentTab({info: "C3BC_open"});
}

chrome.runtime.onMessage.addListener( message => {
  if(message.type !== 'from_the_background') return;

	switch (message.action) {
		case "toggle_dialog":
			toggleC3BCDialog();
			break;
		case "add_answer":
			addAnswer(message.content, message.origination);
	}
});
