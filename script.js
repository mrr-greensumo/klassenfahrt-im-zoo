// Konfiguration der Tiere
// Jedes Tier hat: id, name, size (Größe für Sortierung), letters (8 Buchstaben), imagePath
const ANIMALS_CONFIG = [
    { id: 0, name: 'Maus', size: 5, letters: ['S', 'V', 'S', 'E', 'T', 'H', 'C', 'A'], imagePath: 'images/Tier1.png' },
    { id: 1, name: 'Hahn', size: 3, letters: ['O', 'U', 'G', 'H', 'E', 'T', 'T', 'V'], imagePath: 'images/Tier2.png' },
    { id: 2, name: 'Fuchs', size: 8, letters: ['E', 'R', 'P', 'E', 'C', 'N', 'F', 'S'], imagePath: 'images/Tier3.png' },
    { id: 3, name: 'Löwe', size: 2, letters: ['J', 'L', 'I', 'E', 'I', 'W', 'T', 'E'], imagePath: 'images/Tier4.png' },
    { id: 4, name: 'Bär', size: 7, letters: ['I', 'O', 'I', 'P', 'R', 'T', 'E', 'C'], imagePath: 'images/Tier5.png' },
    { id: 5, name: 'Elefant', size: 1, letters: ['W', 'N', 'C', 'G', 'U', 'H', 'S', 'M'], imagePath: 'images/Tier6.png' },
    { id: 6, name: 'Giraffe', size: 6, letters: ['L', 'A', 'G', 'T', 'E', 'C', 'S', 'V'], imagePath: 'images/Tier7.png' },
    { id: 7, name: 'Dino', size: 4, letters: ['U', 'Z', 'S', 'H', 'K', 'O', 'R', 'N'], imagePath: 'images/Tier8.png' }
];

// Startreihenfolge (fest vorgegeben): Tier 7, 5, 8, 6, 2, 1, 4, 3
const INITIAL_ORDER = [6, 4, 7, 5, 1, 0, 3, 2];

// Spezielle Zustände mit grünen Buchstaben (Indizes sind 0-basiert)
const SPECIAL_STATES = [
    { order: [6, 4, 7, 5, 1, 0, 3, 2], greenIndices: [0, 1, 2, 3, 4, 5, 6, 7] }, // Start: alle grün
    { order: [4, 6, 5, 1, 0, 3, 2, 7], greenIndices: [1, 2, 3, 4] },              // Durchgang 1: 2-5
    { order: [4, 5, 1, 0, 3, 2, 6, 7], greenIndices: [3, 4, 5, 6] },              // Durchgang 2: 4-7
    { order: [4, 1, 0, 3, 2, 5, 6, 7], greenIndices: [2, 3, 4, 5, 6] },           // Durchgang 3: 3-7
    { order: [1, 0, 3, 2, 4, 5, 6, 7], greenIndices: [1, 2, 3, 4] },              // Durchgang 4: 2-5
    { order: [0, 1, 2, 3, 4, 5, 6, 7], greenIndices: [0, 1, 2, 3, 4] }            // Durchgang 5: 1-5
];

// Spielzustand
let currentOrder = [...INITIAL_ORDER];
let selectedAnimalIndex = null;

// DOM-Elemente
const animalsLayer = document.getElementById('animalsLayer');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const anleitungBtn = document.getElementById('anleitungBtn');
const anleitungModal = document.getElementById('anleitungModal');
const closeModalBtn = document.getElementById('closeModal');

// Initialisierung
function init() {
    resetGame();
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    resetBtn.addEventListener('click', resetGame);

    // Click-Handler für manuelle Tier-Auswahl
    animalsLayer.addEventListener('click', handleAnimalClick);

    // Modal-Handler
    anleitungBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    anleitungModal.addEventListener('click', (e) => {
        if (e.target === anleitungModal) closeModal();
    });
}

// Spiel zurücksetzen
function resetGame() {
    currentOrder = [...INITIAL_ORDER];
    selectedAnimalIndex = null;

    renderAnimals();
    updateSolutionWord();
    updateStatus('Spiel zurückgesetzt. Bereit zum Sortieren!');
}

// Tiere rendern
function renderAnimals() {
    const slots = animalsLayer.querySelectorAll('.animal-slot');

    slots.forEach((slot, position) => {
        const animalId = currentOrder[position];
        const animal = ANIMALS_CONFIG[animalId];

        const img = slot.querySelector('.animal');
        img.src = animal.imagePath;
        img.alt = animal.name;
        img.dataset.animalId = animalId;
        img.dataset.position = position;
        img.classList.remove('selected');
    });
}

// Prüfen, ob die aktuelle Reihenfolge einem speziellen Zustand entspricht
function getGreenIndices() {
    for (const state of SPECIAL_STATES) {
        if (arraysEqual(currentOrder, state.order)) {
            return state.greenIndices;
        }
    }
    return null; // Kein spezieller Zustand → alle rot
}

// Hilfsfunktion: Arrays vergleichen
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Lösungsbuchstaben im Bild aktualisieren
function updateSolutionWord() {
    const greenIndices = getGreenIndices();

    currentOrder.forEach((animalId, position) => {
        const animal = ANIMALS_CONFIG[animalId];
        const letter = animal.letters[position];

        // Die einzelnen Buchstaben unterhalb der Fenster aktualisieren
        const solutionLetterElement = document.getElementById(`solution-letter-${position}`);
        if (solutionLetterElement) {
            solutionLetterElement.textContent = letter;

            const wasGreen = solutionLetterElement.classList.contains('green');
            const isGreen = greenIndices && greenIndices.includes(position);

            // Farbklasse setzen (grün für wichtige Buchstaben, rot für den Rest)
            if (isGreen) {
                solutionLetterElement.classList.add('green');
                solutionLetterElement.classList.remove('red');

                // Pulse-Effekt, wenn der Buchstabe neu grün wird
                if (!wasGreen) {
                    solutionLetterElement.classList.remove('pulse');
                    // Trigger reflow, um Animation neu zu starten
                    void solutionLetterElement.offsetWidth;
                    solutionLetterElement.classList.add('pulse');
                }
            } else {
                solutionLetterElement.classList.add('red');
                solutionLetterElement.classList.remove('green');
                solutionLetterElement.classList.remove('pulse');
            }
        }
    });
}

// Status aktualisieren
function updateStatus(message) {
    statusDisplay.textContent = message;
}

// Manuelles Tier-Klicken
function handleAnimalClick(event) {
    if (!event.target.classList.contains('animal')) return;

    const clickedPosition = parseInt(event.target.dataset.position);

    // Wenn noch kein Tier ausgewählt
    if (selectedAnimalIndex === null) {
        selectedAnimalIndex = clickedPosition;
        event.target.classList.add('selected');
        const animalId = currentOrder[clickedPosition];
        const animalName = ANIMALS_CONFIG[animalId].name;
        updateStatus(`${animalName} ausgewählt. Wähle ein benachbartes Tier zum Tauschen.`);
    } else {
        // Prüfen, ob benachbart
        if (Math.abs(selectedAnimalIndex - clickedPosition) === 1) {
            swapAnimals(selectedAnimalIndex, clickedPosition);
            deselectAllAnimals();
            selectedAnimalIndex = null;
        } else if (selectedAnimalIndex === clickedPosition) {
            // Abwählen
            deselectAllAnimals();
            selectedAnimalIndex = null;
            updateStatus('Auswahl abgebrochen.');
        } else {
            updateStatus('Du kannst nur benachbarte Tiere tauschen!');
        }
    }
}

// Alle Tiere abwählen
function deselectAllAnimals() {
    const animals = animalsLayer.querySelectorAll('.animal');
    animals.forEach(animal => animal.classList.remove('selected'));
}

// Tiere tauschen
function swapAnimals(pos1, pos2) {
    const animal1 = ANIMALS_CONFIG[currentOrder[pos1]];
    const animal2 = ANIMALS_CONFIG[currentOrder[pos2]];

    // Swap im Array
    [currentOrder[pos1], currentOrder[pos2]] = [currentOrder[pos2], currentOrder[pos1]];

    // Visuelle Animation
    const slots = animalsLayer.querySelectorAll('.animal-slot');
    const img1 = slots[pos1].querySelector('.animal');
    const img2 = slots[pos2].querySelector('.animal');

    img1.classList.add('swapping');
    img2.classList.add('swapping');

    setTimeout(() => {
        renderAnimals();
        updateSolutionWord();
        updateStatus(`${animal1.name} und ${animal2.name} getauscht!`);

        // Animation-Klasse entfernen
        setTimeout(() => {
            img1.classList.remove('swapping');
            img2.classList.remove('swapping');
        }, 100);
    }, 300);
}

// Modal öffnen
function openModal() {
    anleitungModal.classList.add('active');
}

// Modal schließen
function closeModal() {
    anleitungModal.classList.remove('active');
}

// Bei Seitenladung initialisieren
document.addEventListener('DOMContentLoaded', init);
