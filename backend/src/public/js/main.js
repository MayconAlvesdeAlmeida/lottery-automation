
let contestRef = {};
const urlBase = 'http://localhost:3000/lottery/';
const playerSelectorNumbers = new Set();
const contestNumber = document.getElementById('contest-number');
const tbody = document.getElementById('players-info');
const form = document.getElementById('new-contest-form');
const editRefContestButton = document.getElementById('edit-contest');
const addBetButton = document.getElementById('add-bet');
const alertButton = document.getElementById('close-alert');


async function getContestInfo(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Erro ao buscar informacoes do Sorteio:', error);
        return null;
    }
}

function editPlayer(playerIndex) {
    configBet(playerIndex);
}

function removePlayer(playerIndex) {

    contestRef.players.splice(playerIndex, 1);
    configPlayersInfo();
}

function updatePlayerChosenNumbersDisplay() {
    const playerChosenNumersDisplay = document.getElementById('player-chosen-numbers');
    playerChosenNumersDisplay.textContent = Array.from(playerSelectorNumbers)
        .sort((a, b) => a - b)
        .map(num => num.toString().padStart(2, '0'))
        .join(' ') || 'Nenhum número escolhido';
}

function togglePlayerButtonNumber(event, chosenPlayerNumber, buttonChosenPlayerNumber) {
    event.preventDefault();

    if (playerSelectorNumbers.has(chosenPlayerNumber)) {
        playerSelectorNumbers.delete(chosenPlayerNumber);
        buttonChosenPlayerNumber.classList.remove('selected');

    } else if (playerSelectorNumbers.size < 15) {
        playerSelectorNumbers.add(chosenPlayerNumber);
        buttonChosenPlayerNumber.classList.add('selected');
    }

    updatePlayerChosenNumbersDisplay();
}


function getDefaultButtons(confirmButtonName='') {
    const confirmButton = document.createElement('button');
    confirmButton.textContent = confirmButtonName ? confirmButtonName : 'Confirmar';
    confirmButton.classList.add('confirm-btn');

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.classList.add('cancel-btn');

    return { confirmButton, cancelButton };
}

function getDefaultDivButtons() {
    const divButtons = document.createElement('div');
    divButtons.classList.add('div-buttons');

    return divButtons;
}


function createOrUpdatePlayerBet(event, playerIndex=null) {
    event.preventDefault();
    
    const playerNameInput = document.getElementById('player-name-input').value.trim();

    if (playerNameInput.length === 0) {
        showAlert('Informe o nome do Apostador');
        return;
    }

    if (playerSelectorNumbers.size != 15) {
        showAlert('Escolha 15 números');
        return;
    }

    const updatedInfo = { name: playerNameInput, chosenNumbers: Array.from(playerSelectorNumbers) };

    if (playerIndex != null) {

        contestRef.players[playerIndex] = updatedInfo;

    } else {

        contestRef.players.push(updatedInfo);
    }

    configPlayersInfo();

    const modalOverlay = document.getElementById('modal-ref');
    const modal = document.getElementById('modal-ref-content');

    cancelModal(null, modalOverlay, modal);

}


function configBet(playerIndex=null) {

    const modalOverlay = document.getElementById('modal-ref');
    const modal = document.getElementById('modal-ref-content');
    modal.innerHTML = '';

    const form = document.createElement('form');
    form.setAttribute('id', 'new-bet-form');

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Insira os dados da aposta';
    form.appendChild(formTitle);

    const divPlayerName = document.createElement('div');
    divPlayerName.classList.add('bet__player-name');

    const labelPlayerName = document.createElement('label');
    labelPlayerName.setAttribute('for', 'player-name-input');
    labelPlayerName.textContent = 'Apostador';
    divPlayerName.appendChild(labelPlayerName);

    const inputPlayerName = document.createElement('input');
    inputPlayerName.setAttribute('type', 'text');
    inputPlayerName.setAttribute('id', 'player-name-input');
    inputPlayerName.setAttribute('required', true);
    divPlayerName.appendChild(inputPlayerName);

    const divPlayerNumbers = document.createElement('div');
    divPlayerNumbers.classList.add('bet__player-numbers');

    const divNumbersSelect = document.createElement('div');
    divNumbersSelect.classList.add('bet__player-numbers__select');

    for (let i = 0; i < 25; i++) {
        const button = document.createElement('button');
        const buttonValue = (i + 1).toString().padStart(2, '0');
        button.innerHTML = `<span>${buttonValue}</span>`;
        button.classList.add('bet__player-numbers__select__button');
        button.addEventListener('click', (e) => togglePlayerButtonNumber(e, i + 1, button));
        
        divNumbersSelect.appendChild(button);
    }

    const selectedNumbersDisplay = document.createElement('div');
    selectedNumbersDisplay.setAttribute('id', 'player-chosen-numbers');
    selectedNumbersDisplay.classList.add('bet__player-numbers__selected');
    selectedNumbersDisplay.textContent = 'Nenhum número escolhido';
    
    divPlayerNumbers.appendChild(divNumbersSelect);
    divPlayerNumbers.appendChild(selectedNumbersDisplay);

    const divConfirmationButtons = getDefaultDivButtons();

    const { confirmButton, cancelButton } = getDefaultButtons();

    cancelButton.addEventListener('click', (e) => cancelModal(e, modalOverlay, modal));
    confirmButton.addEventListener('click', (e) => createOrUpdatePlayerBet(e, playerIndex));

    divConfirmationButtons.appendChild(confirmButton);
    divConfirmationButtons.appendChild(cancelButton);

    form.appendChild(divPlayerName);
    form.appendChild(divPlayerNumbers);
    form.appendChild(divConfirmationButtons);

    modal.appendChild(form);

    if (playerIndex != null) {
        const player = contestRef.players[playerIndex];

        inputPlayerName.value = player.name;

        for (let i = 0; i < player.chosenNumbers.length; i++) {
            playerSelectorNumbers.add(player.chosenNumbers[i]);
        }

        const allButtons = divNumbersSelect.querySelectorAll('.bet__player-numbers__select__button');
        allButtons.forEach(button => {
            if (playerSelectorNumbers.has(parseInt(button.querySelector('span').textContent))) {
                button.classList.add('selected');
            }
        })

        updatePlayerChosenNumbersDisplay();
    }
    modalOverlay.classList.toggle('modal-active');
    document.body.classList.toggle('modal-open');

}


function cancelModal(e, modalOverlay, modal) {
    if (e != null) {
        e.preventDefault();
    }

    modalOverlay.classList.toggle('modal-active');
    document.body.classList.toggle('modal-open');
    modal.innerHTML = '';

    playerSelectorNumbers.clear();
}

function showResumeNewContest(contestInfo) {

    const modalOverlay = document.getElementById('modal-ref');
    const modal = document.getElementById('modal-ref-content');
    modal.innerHTML = '';

    const resumeTitle = document.createElement('h2');
    resumeTitle.classList.add('resume-title');
    resumeTitle.textContent = 'Resumo do concurso';

    const resumeConstestNumber = document.createElement('p');
    resumeConstestNumber.classList.add('resume-contest-number');
    resumeConstestNumber.textContent = `Concurso: ${contestInfo.contestNumber}`;

    const resumeTotalPlayers = document.createElement('p');
    resumeTotalPlayers.classList.add('resume-total-players');
    resumeTotalPlayers.textContent = `Total de apostadores: ${contestRef.players.length}`;

    const divTableContainer = document.createElement('div');
    divTableContainer.classList.add('table-container');

    const resumePlayerTable = document.createElement('table');
    resumePlayerTable.setAttribute('id', 'resume-players-info-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Apostador</th>
            <th>Números</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    contestRef.players.forEach( player => {
        let numbers = [];
        player.chosenNumbers.sort((a, b) => a - b);

        for (let i = 0; i < player.chosenNumbers.length; i++) {
            let stringNumber = player.chosenNumbers[i] < 10 ? `0${player.chosenNumbers[i]}` : `${player.chosenNumbers[i]}`;

            numbers.push(stringNumber);
        }

        numbers = numbers.join(' ');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${player.name}</td>
            <td>${numbers}</td>
        `;

        tbody.appendChild(tr);
    });

    resumePlayerTable.appendChild(thead);
    resumePlayerTable.appendChild(tbody);

    divTableContainer.appendChild(resumePlayerTable);

    const divConfirmationButtons = getDefaultDivButtons();

    const { confirmButton, cancelButton } = getDefaultButtons();

    cancelButton.addEventListener('click', (e) => cancelModal(e, modalOverlay, modal));
    confirmButton.addEventListener('click', (e) => createNewConstest(e, modal, contestInfo));

    divConfirmationButtons.appendChild(confirmButton);
    divConfirmationButtons.appendChild(cancelButton);

    modal.appendChild(resumeTitle);
    modal.appendChild(resumeConstestNumber);
    modal.appendChild(resumeTotalPlayers);
    modal.appendChild(divTableContainer);
    modal.appendChild(divConfirmationButtons);

    modalOverlay.classList.toggle('modal-active');
    document.body.classList.toggle('modal-open');
}

function configPlayersInfo() {
    
    tbody.innerHTML = '';

    contestRef.players.forEach((player, index) => {
        
        let numbers = [];
        player.chosenNumbers.sort((a, b) => a - b);

        for (let i = 0; i < player.chosenNumbers.length; i++) {
            let stringNumber = player.chosenNumbers[i] < 10 ? `0${player.chosenNumbers[i]}` : `${player.chosenNumbers[i]}`;

            numbers.push(stringNumber);
        }

        numbers = numbers.join(' ');
        
        const tr = document.createElement('tr');
        tr.setAttribute('id', `p-${index}`);

        const tdName = document.createElement('td');
        tdName.textContent = player.name;

        const tdNumbers = document.createElement('td');
        tdNumbers.textContent = numbers;

        const tdActions = document.createElement('td');
        tdActions.classList.add('bet-player-actions');

        const editButton = document.createElement('button');
        editButton.classList.add('edit-bet-player');
        editButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
        editButton.addEventListener('click', () => {
            editPlayer(index);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-bet-player');
        removeButton.innerHTML = '<i class="fas fa-trash"></i>';
        removeButton.addEventListener('click', () => {
            removePlayer(index);
        });

        tdActions.appendChild(editButton);
        tdActions.appendChild(removeButton);
        
        tr.appendChild(tdName);
        tr.appendChild(tdNumbers);
        tr.appendChild(tdActions);
        
        tbody.appendChild(tr);
    });
}

function waitForAutomation(modal, contestNumber) {
    modal.innerHTML = '';

    const resumeTitle = document.createElement('h2');
    resumeTitle.classList.add('process-title');
    resumeTitle.textContent = 'Processando, aguarde...';

    const resumeConstestNumber = document.createElement('p');
    resumeConstestNumber.classList.add('process-contest-number');
    resumeConstestNumber.textContent = `Concurso: ${contestNumber}`;
    
    modal.appendChild(resumeTitle);
    modal.appendChild(resumeConstestNumber);
}


async function createNewConstest(e, modal, {contestNumber, contestDate}) {

    e.preventDefault();

    const body = {
        contestNumber,
        contestDate,
        players: contestRef.players,
        contestType: 'lotofacil'
    };

    const url = urlBase;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const data = await response.json();

            showAlert(data.error);
            return;
        }
        
        waitForAutomation(modal, contestNumber);

    } catch (error) {
        console.log('error', error);
        showAlert('Erro ao criar concurso! Informe ao Suporte.');
    }
}

function showAlert(message) {
    const alert = document.getElementById('error-alert');
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = message;
    alert.classList.add('alert-active');
}

addBetButton.addEventListener('click', () => {
    configBet();
    
});


editRefContestButton.addEventListener('click', () => {
    const modalOverlay = document.getElementById('modal-ref');
    const modal = document.getElementById('modal-ref-content');
    modal.innerHTML = '';

    const form = document.createElement('form');
    form.setAttribute('id', 'edit-contest-form');

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Insira os dados do concurso';
    form.appendChild(formTitle);

    const divContestNumber = document.createElement('div');
    divContestNumber.classList.add('new-contest__input');

    const labelContestNumber = document.createElement('label');
    labelContestNumber.setAttribute('for', 'find-contest-number-input');
    labelContestNumber.textContent = 'Número';
    divContestNumber.appendChild(labelContestNumber);

    const inputContestNumber = document.createElement('input');
    inputContestNumber.setAttribute('type', 'number');
    inputContestNumber.setAttribute('name', 'contest-number');
    inputContestNumber.setAttribute('id', 'find-contest-number-input');
    inputContestNumber.setAttribute('required', true);
    divContestNumber.appendChild(inputContestNumber);

    const divConfirmationButtons = getDefaultDivButtons();

    const { confirmButton, cancelButton } = getDefaultButtons('Buscar');

    confirmButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const contestNumberInput = document.getElementById('find-contest-number-input').value;
        if (!contestNumberInput) {
            showAlert('Informe o numero do concurso');
            return;
        }
        const url = urlBase + contestNumberInput;

        const constestInfo = await getContestInfo(url);

        if (!constestInfo) {
            showAlert('Concurso não encontrado');
            return;
        }

        contestRef = constestInfo;

        contestNumber.textContent = contestRef.contestNumber;
        configPlayersInfo();

        modalOverlay.classList.toggle('modal-active');
        document.body.classList.toggle('modal-open');
        modal.innerHTML = '';
    })

    cancelButton.addEventListener('click', (e) => cancelModal(e, modalOverlay, modal));

    divConfirmationButtons.appendChild(confirmButton);
    divConfirmationButtons.appendChild(cancelButton);

    form.appendChild(divContestNumber);
    form.appendChild(divConfirmationButtons);

    modal.appendChild(form);
    modalOverlay.classList.toggle('modal-active');
    document.body.classList.toggle('modal-open');
});

document.addEventListener('DOMContentLoaded', async () => {

    const url = urlBase + '?type=lotofacil&quantity=1';
    let contestInfo = await getContestInfo(url);

    if (!contestInfo || contestInfo.length == 0) {
        contestInfo = [{contestNumber: 0, players: [], contestType: 'lotofacil'}];
    }

    contestRef = contestInfo[0];
    contestNumber.textContent = contestRef.contestNumber;

    configPlayersInfo();
});


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contestNumber = document.getElementById('contest-number-input').value;
    const contestDate = document.getElementById('contest-date-input').value;

    if (contestRef.players.length == 0) {
        showAlert('Nenhuma aposta criada');
        return;
    }
    
    showResumeNewContest({contestNumber, contestDate});
});


alertButton.addEventListener('click', () => {
    const alert = document.getElementById('error-alert');
    alert.classList.add('hidden');
    alert.classList.remove('alert-active');
});