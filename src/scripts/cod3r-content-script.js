// A organização por módulos não foi feita, já que o content-script não oferece suporte. Soluções alternativas podem quebrar as APIs que o Chrome disponibiliza

const contentScriptHeight = 476;
const contentScriptWidth = 360;
const buttonsToolbarSelector = "div.fr-toolbar"

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

	C3CBDialogElement.addEventListener("click", dialogClickOutsideHandler);

	document.body.appendChild(C3CBDialogElement);
})();

function showC3CBDialog() {
	const C3CBDDialogElement = document.getElementById("C3BC-dialog");
	C3CBDDialogElement.showModal();
}

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