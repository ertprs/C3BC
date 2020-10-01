const contentScriptHeight = 476;
const contentScriptWidth = 360;
const formSelector = 			"div.two-pane--container__right-pane--2xMVx > div > div.reply-form--reply-form--GZtNK > form";
const formParentSelector =		"div.two-pane--container__right-pane--2xMVx > div > div.reply-form--reply-form--GZtNK";
const answerContentSelector = 	"div.two-pane--container__right-pane--2xMVx > div > div.reply-form--reply-form--GZtNK > form > div.form-group > div > div.rt-editor.rt-editor--wysiwyg-mode > div";

function checkIfTheFormWasLoaded() {
	return document.querySelector(formSelector);
}

function checkIfTheAnswerContentWasLoaded() {
	return document.querySelector(answerContentSelector);
}

function checkIfTheC3BCDialogIsOpen() {
	return document.querySelector("dialog[id='C3BC-dialog'][open]");
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
	
	C3CBDialogElement.addEventListener("click", dialogClickOutsideHandler);
	C3CBDialogElement.addEventListener('close', cancelScrollListennerForAnswerContentElement);
	
	document.body.appendChild(C3CBDialogElement);
})();

function positionDialog() {
	const C3CBDialogElement = document.getElementById("C3BC-dialog");
	
	const formParentRect = document.querySelector(formParentSelector).getBoundingClientRect();
	const cod3rButtonRect = document.getElementById("cod3r-button").getBoundingClientRect();

	C3CBDialogElement.style.top = formParentRect.top-contentScriptHeight < 0 ? `0px` : `${formParentRect.top-contentScriptHeight}px`;

	if( (cod3rButtonRect.right + contentScriptWidth) < document.body.getBoundingClientRect().width)
		C3CBDialogElement.style.left = `${cod3rButtonRect.right}px`;
	else if( (cod3rButtonRect.right - cod3rButtonRect.width/2 + contentScriptWidth/2) < document.body.getBoundingClientRect().width || (cod3rButtonRect.left - contentScriptWidth) < 0 )
		C3CBDialogElement.style.left = `${cod3rButtonRect.right - cod3rButtonRect.width/2 - contentScriptWidth/2}px`;
	else
		C3CBDialogElement.style.left = `${cod3rButtonRect.left - contentScriptWidth}px`;
}

function showC3CBDialog() {
	const C3CBDDialogElement = document.getElementById("C3BC-dialog");
	positionDialog();
	window.addEventListener("resize", positionDialog);
	C3CBDDialogElement.showModal();
	
	const C3BCDialogIsOpenCheckInterval = setInterval( () => {
		if(checkIfTheC3BCDialogIsOpen()){
			makeSureTheSrollAnswerContentIsAtTheBottomWhenInsertAnswer();
			setTimeout(setCSSToReplyFormOpen, 30);
			clearInterval(C3BCDialogIsOpenCheckInterval);
		}
	}, 10)
}

function addC3BCButton() {
	const cod3rButton = document.createElement("button");
	cod3rButton.innerHTML = "Cod3r";
	cod3rButton.classList.add("btn");
	cod3rButton.setAttribute("type", "button");
	cod3rButton.setAttribute("id", "cod3r-button");
	cod3rButton.setAttribute("aria-label", "Adicionar respostas padrões");
	cod3rButton.setAttribute("title", "Adicionar respostas padrões");

	cod3rButton.onclick = clickEvent => {
		clickEvent.preventDefault();
		showC3CBDialog();
	}

	// aqui está sendo capturado um botão e depois pegando o seu pai porque, dentro da div abaixo cuja propriedade data-purpose é igual a "menu-bar",
	// há duas divs que têm como classe btn-group. A que apresenta algum botão dentro é o nosso alvo. 
	const formButtonsGroup = document.querySelector("div[data-purpose='menu-bar'] div.btn-group button").parentNode;
	formButtonsGroup.insertAdjacentElement("beforeend", cod3rButton);
}
	
const addC3CBButtonAndDialogCheckInterval = setInterval( () => {
	if (document.readyState === "complete" && checkIfTheFormWasLoaded()) {
		addC3BCButton();

		clearInterval(addC3CBButtonAndDialogCheckInterval);
	}
}, 20);

// O editor rico do C3BC adiciona um espaço a mais no final de um bloco de código. Isso fica bem esteticamente na Udemy 
function removeMisplacedLineBreaksInPreCode(answerHTML) {
	return answerHTML.replace(/\s(?=<\/pre>)/gm, '');
}

function setCSSToReplyFormOpen() {
	const style1 = "reply-form--reply-form--content--1eWln";
	document.querySelector(formParentSelector).classList.add(style1);

	const style2 = "ProseMirror-focused";
	document.querySelector(answerContentSelector).classList.add(style2);
}

function scrollAnswerContentToTheBottom() {
	const answerContentElement = document.querySelector(answerContentSelector);
	answerContentElement.scrollTo(0, answerContentElement.scrollHeight);
}

// esse código extra para forçar que a rolagem esteja embaixo é necessário, pois um script da Udemy, quando percebe que há um iframte e que houve
// mudança no conteúdo da caixa de resposta, move a rolagem para cima.
function makeSureTheSrollAnswerContentIsAtTheBottomWhenInsertAnswer() {
	const answerContentElement = document.querySelector(answerContentSelector);

	answerContentElement.addEventListener('scroll', scrollAnswerContentToTheBottom);
}

function cancelScrollListennerForAnswerContentElement() {
	const answerContentElement = document.querySelector(answerContentSelector);

	answerContentElement.removeEventListener('scroll', scrollAnswerContentToTheBottom);
}

function insertAnswer(answerHTML) {
	const answerContentElement = document.querySelector(answerContentSelector);
	const correctedAnswerHTML = removeMisplacedLineBreaksInPreCode(answerHTML);

	if(answerContentElement.querySelector("p:first-child > br"))
		answerContentElement.innerHTML = correctedAnswerHTML;
	else
		answerContentElement.innerHTML += correctedAnswerHTML;

	const breakRowElement = document.createElement('p');
	breakRowElement.appendChild(document.createElement('br'));

	answerContentElement.appendChild(breakRowElement);
	
	setCSSToReplyFormOpen();
	scrollAnswerContentToTheBottom();
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
		insertAnswer(request.answerContent);
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