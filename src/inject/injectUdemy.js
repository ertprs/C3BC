// chrome.extension.sendMessage({}, function(response) {
	const checkIfTheFormWasLoaded = () => document.getElementById('rich-text-editor-anchor-dropdown-1')

	const readyFormCheckInterval = setInterval(function() {
	if ( document.readyState === "complete" && checkIfTheFormWasLoaded() ){
		const cod3rButton = document.createElement('button');
		cod3rButton.innerHTML = 'Cod3r'
		cod3rButton.className = "btn";

		// aqui está sendo capturado um botão e depois pegando o seu pai porque, dentro da div abaixo cuja propriedade data-purpose é igual a "menu-bar",
		// há duas divs que têm como classe btn-group. A que apresenta algum botão dentro é o nosso alvo. 
		const formButtonsGroup = document.querySelector('div[data-purpose="menu-bar"] div.btn-group button').parentNode
		formButtonsGroup.insertAdjacentElement('beforeend', cod3rButton);

		clearInterval(readyFormCheckInterval);
	}
	}, 10);
// });