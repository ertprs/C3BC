// A organização por módulos não foi feita, já que o content-script não oferece suporte. Soluções alternativas podem quebrar as APIs que o Chrome disponibiliza

const buttonsToolbarSelector = "div.fr-toolbar"

function checkIfTheButtonsToobarWasLoaded() {
	return document.querySelector(buttonsToolbarSelector);
}

const initialize = setInterval( () => {
	if (document.readyState === "complete" && checkIfTheButtonsToobarWasLoaded()) {
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
	cod3rButton.classList.add("fr-command", "fr-btn", "fr-btn-font_awesome");
	cod3rButton.setAttribute("aria-label", "Adicionar respostas padrões");
	cod3rButton.setAttribute("title", "Adicionar respostas padrões");
	cod3rButton.setAttribute("style", "font-weight: bold; padding: 12px; width: auto;");

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