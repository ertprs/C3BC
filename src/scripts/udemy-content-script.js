// A organização por módulos não foi feita, já que o content-script não oferece suporte. Soluções alternativas podem quebrar as APIs que o Chrome disponibiliza

const 	contentScriptHeight = 476,
		contentScriptWidth = 360,
		formSelector = 							"div.two-pane--container__right-pane--2xMVx > div > div.reply-form--reply-form--GZtNK > form",
		formParentSelector =					"div.two-pane--container__right-pane--2xMVx > div > div.reply-form--reply-form--GZtNK",
		answerContentSelector = 				"div.two-pane--container__right-pane--2xMVx > div > div.reply-form--reply-form--GZtNK > form > div.form-group > div > div.rt-editor.rt-editor--wysiwyg-mode > div.ProseMirror",
		formParentClassForReplyFormOpen = 		"reply-form--reply-form--content--1eWln",
		answerContentClassForReplyFormOpen =	"ProseMirror-focused",
		mainContentElement = 					document.querySelector(".main-content"),
		// Observer para lançar evento customizado quando um diálogo abrir, pois o evento "open" para diálogo não existe nativamente
		dialogObserver = 						new MutationObserver(checkForMutationsToMakeSureTheOpenEventIsDispatchedWhenADialogOpens),
		ReplyFormObserver = 					new MutationObserver(checkForMutationsToMakeSureTheClassesToKeepReplyFormOpenAreApllied),
		mainContentObserver = 					new MutationObserver(checkForMutationsToInitialize);
let 	formParentElement,
		answerContentElement;

mainContentObserver.observe(mainContentElement, { childList: true, subtree: true });

(function addC3BCDialog() {
	const C3BCDialogElement = document.createElement("dialog");
	C3BCDialogElement.id = "C3BC-dialog";
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
		makeSureTheReplyFormIsSetToOpen();
		positionDialog();
    makeSureTheSrollAnswerContentIsAtTheBottomWhenInsertAnswer();
		sendMessageThatC3BCDialogWasOpen();
	});

	C3BCDialogElement.addEventListener('close', () => {
		cancelObserverForReplyFormOpenClassesChangeObserver();
    cancelScrollListennerForAnswerContentElement();
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

function checkIfTheFormWasLoaded() {
	return document.querySelector(formSelector);
}

// o :not(span) é necessário, pois, num primeiro momento, a Udemy carrega o a div.ProseMirror e fica mostrando uma tela de carregamento, isso é caracterizado por um filho span dentro deste
// elemento, mas, quando os dados da resposta chegam de forma assíncrona, este elemento é recriado, fazendo com que percamos a sua referência caso o peguemos de início
function checkIfTheAnswerContentWasLoaded() {
	return document.querySelector(answerContentSelector + ' > :not(span)');
}

function checkForMutationsToInitialize() {
	const formWasLoaded = checkIfTheFormWasLoaded();
	const answerContentWasLoaded = checkIfTheAnswerContentWasLoaded();

	if(formWasLoaded && answerContentWasLoaded) {
		formParentElement = document.querySelector(formParentSelector);
		answerContentElement = document.querySelector(answerContentSelector);

		addC3BCButton();
		mainContentObserver.disconnect();
	}
}

function addC3BCButton() {
	const cod3rButtonElement = document.createElement("button");
	cod3rButtonElement.innerHTML = "COD3R";
	cod3rButtonElement.classList.add("btn");
	cod3rButtonElement.setAttribute("type", "button");
	cod3rButtonElement.setAttribute("id", "cod3r-button");
	cod3rButtonElement.setAttribute("aria-label", "Adicionar respostas padrões");
	cod3rButtonElement.setAttribute("title", "Adicionar respostas padrões");
	cod3rButtonElement.setAttribute("style", "font-family: 'Oxanium', cursive;");

	cod3rButtonElement.addEventListener("mousedown", clickEvent => {
		if(clickEvent.button !== 0) return;

		clickEvent.preventDefault();
		showC3BCDialog();
	});

	// aqui está sendo capturado um botão e depois pegando o seu pai porque, dentro da div abaixo cuja propriedade data-purpose é igual a "menu-bar",
	// há duas divs que têm como classe btn-group. A que apresenta algum botão dentro é o nosso alvo.
	const formButtonsGroup = document.querySelector("div[data-purpose='menu-bar'] > div.btn-group > button").parentNode;
	formButtonsGroup.insertAdjacentElement("beforeend", cod3rButtonElement);
}

function checkForMutationsToMakeSureTheOpenEventIsDispatchedWhenADialogOpens(mutations) {
	mutations.forEach( mutation => {
		if(mutation.attributeName !== "open") return;

		if(mutation.target.hasAttribute("open"))
			mutation.target.dispatchEvent(new CustomEvent('open'));
	});
}

function positionDialog() {
	const C3BCDialogElement = document.getElementById("C3BC-dialog");

	const formParentRect = formParentElement.getBoundingClientRect();
	const cod3rButtonRect = document.getElementById("cod3r-button").getBoundingClientRect();

	C3BCDialogElement.style.top = formParentRect.top-contentScriptHeight < 0 ? `0px` : `${formParentRect.top-contentScriptHeight}px`;

	if( (cod3rButtonRect.right + contentScriptWidth) < document.body.getBoundingClientRect().width)
		C3BCDialogElement.style.left = `${cod3rButtonRect.right}px`;
	else if( (cod3rButtonRect.right - cod3rButtonRect.width/2 + contentScriptWidth/2) < document.body.getBoundingClientRect().width || (cod3rButtonRect.left - contentScriptWidth) < 0 )
		C3BCDialogElement.style.left = `${cod3rButtonRect.right - cod3rButtonRect.width/2 - contentScriptWidth/2}px`;
	else
		C3BCDialogElement.style.left = `${cod3rButtonRect.left - contentScriptWidth}px`;
}

function showC3BCDialog() {
	const C3BCDialogElement = document.getElementById("C3BC-dialog");
	C3BCDialogElement.showModal();
}

// função que garante que o formulário de resposta esteja aberto
function checkForMutationsToMakeSureTheClassesToKeepReplyFormOpenAreApllied(mutations) {
	mutations.forEach( mutationRecord => {
		const mutatedElement = mutationRecord.target
		if(mutatedElement.isSameNode(formParentElement)) {
			if( !mutatedElement.classList.contains(formParentClassForReplyFormOpen) ) {
				formParentElement.classList.add(formParentClassForReplyFormOpen);
			}
		} else

		if(mutatedElement.isSameNode(answerContentElement) && !mutatedElement.classList.contains(answerContentClassForReplyFormOpen)) {
			answerContentElement.classList.add(answerContentClassForReplyFormOpen);
		}
	});
}

function makeSureTheReplyFormIsSetToOpen() {
	formParentElement.classList.add(formParentClassForReplyFormOpen);
	answerContentElement.classList.add(answerContentClassForReplyFormOpen);

	ReplyFormObserver.observe(formParentElement, { attributes : true, attributeFilter : ['class'] });
	ReplyFormObserver.observe(answerContentElement, { attributes : true, attributeFilter : ['class'] });
}

function cancelObserverForReplyFormOpenClassesChangeObserver() {
	ReplyFormObserver.disconnect();
}

function scrollAnswerContentToTheBottom() {
	answerContentElement.scrollTo(0, answerContentElement.scrollHeight);
}

// esse código extra para forçar que a rolagem esteja embaixo é necessário, pois um script da Udemy, quando percebe que há um iframte e que houve mudança no conteúdo da caixa de resposta,
// move a rolagem para cima.
function makeSureTheSrollAnswerContentIsAtTheBottomWhenInsertAnswer() {
	answerContentElement.addEventListener('scroll', scrollAnswerContentToTheBottom);
}

function cancelScrollListennerForAnswerContentElement() {
	answerContentElement.removeEventListener('scroll', scrollAnswerContentToTheBottom);
}

// O editor rico do C3BC adiciona um espaço a mais no final de um bloco de código. Isso não fica bem esteticamente na Udemy
function removeMisplacedLineBreaksInPreCode(answerHTML) {
	return answerHTML.replace(/\s(?=<\/pre>)/gm, '');
}

function insertAnswerInDOM(answerHTML) {
  return new Promise( (resolve, reject) => {
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

function addAnswer(answerHTML, origination) {
	const correctedAnswerHTML = removeMisplacedLineBreaksInPreCode(answerHTML);

  insertAnswerInDOM(correctedAnswerHTML)
    .then(() => {
      scrollAnswerContentToTheBottom();
    })
    .catch( error => {
      if(origination == 'page_action')
        sendMessageToThePageAction({isNotification: true, content: error.message});
      else sendMessageToTheCurrentTab({isNotification: true, content: error.message});
    });
}

// fonte: https://stackoverflow.com/questions/50037663/how-to-close-a-native-html-dialog-when-clicking-outside-with-javascript
function dialogClickOutsideHandler(event) {
    if (event.target.tagName !== 'DIALOG') // previne problema com formulários
        return;

    const dialog = event.target;
    const rect = dialog.getBoundingClientRect();

    const clickedInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
    );

    if (!clickedInDialog) dialog.close();
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
