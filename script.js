let classifier;
let classifierReady = false;
let currentMode = 'writing';
let currentLevel = 1;
let currentTargetItem = null;
let placedItems = new Set();

// ⚠️ Las coordenadas van en POSITIVO, tal como las leés en la imagen (el código
// las convierte a negativo internamente). Para muebles de UN casillero, click simple
// en el inspector. Para muebles GRANDES, click + arrastre desde arriba-izquierda hasta
// abajo-derecha, y copiá spriteX/spriteY/spriteW/spriteH.
const levelFurniture = {
  1: [
    { id: 'sofa',   name: 'Sofa',   spriteX: 144,  spriteY: 112, spriteW: 32, spriteH: 16 },
    { id: 'table',  name: 'Table',  spriteX: 48,   spriteY: 0,   spriteW: 48, spriteH: 32 },
    { id: 'chair',  name: 'Chair',  spriteX: 112,  spriteY: 112, spriteW: 16, spriteH: 16 }
  ],
  2: [
    { id: 'bamboo-rug', name: 'Bamboo rug', spriteX: 128, spriteY: 0,   spriteW: 32, spriteH: 16 },
    { id: 'lamp',       name: 'Lamp',       spriteX: 64,  spriteY: 176, spriteW: 16, spriteH: 16 },
    { id: 'bookshelf',  name: 'Bookshelf',  spriteX: 0,   spriteY: 176, spriteW: 32, spriteH: 32 },
    { id: 'plant',      name: 'Plant',      spriteX: 192, spriteY: 112, spriteW: 16, spriteH: 48 }
  ],
  3: [
    { id: 'carpet-green', name: 'Carpet-green', spriteX: 48,  spriteY: 144, spriteW: 48, spriteH: 32 },
    { id: 'tv',           name: 'TV',           spriteX: 192, spriteY: 48,  spriteW: 32, spriteH: 32 },
    { id: 'plant-stand',  name: 'Plant stand',  spriteX: 160, spriteY: 48,  spriteW: 32, spriteH: 32 },
    { id: 'carpet-cat',   name: 'Carpet-cat',   spriteX: 128, spriteY: 80,  spriteW: 32, spriteH: 16 }
  ]
};

const validVerbs = ['place', 'places', 'put', 'puts', 'set', 'sets', 'move', 'moves', 'position', 'positions', 'add', 'adds'];

// Posición de cada mueble dentro de la habitación (en % del ancho/alto del cuadro
// "room"). El piso ocupa solo el 35% de abajo, y los muebles altos miden hasta 90px,
// así que los "bottom" se mantienen bajos (2%-8%) para que ningún mueble cruce la
// línea de la pared. Los "left" se mantienen entre 15% y 85% para que nada se corte
// contra los bordes. "z" controla la capa: alfombras al fondo, muebles encima.
const roomLayout = {
  // Nivel 1 — sala de estar
  sofa:  { left: '22%', bottom: '6%', z: 2 },
  table: { left: '50%', bottom: '3%', z: 3 },
  chair: { left: '76%', bottom: '6%', z: 2 },

  // Nivel 2 — rincón de lectura
  bookshelf:    { left: '20%', bottom: '5%', z: 2 },
  'bamboo-rug': { left: '50%', bottom: '3%', z: 1 },
  lamp:         { left: '68%', bottom: '6%', z: 2 },
  plant:        { left: '84%', bottom: '5%', z: 3 },

  // Nivel 3 — living completo
  'plant-stand':  { left: '20%', bottom: '6%', z: 3 },
  'carpet-green': { left: '50%', bottom: '2%', z: 1 },
  'tv':           { left: '50%', bottom: '8%', z: 2 },
  'carpet-cat':   { left: '80%', bottom: '4%', z: 1 }
};

// Por si en el futuro agregás un mueble nuevo y te olvidás de definirle una
// posición en roomLayout: lo reparte en fila abajo, en vez de romper el juego.
let fallbackSlotIndex = 0;
function getRoomPosition(itemId) {
  if (roomLayout[itemId]) return roomLayout[itemId];
  const slot = { left: `${10 + (fallbackSlotIndex % 8) * 11}%`, bottom: '4%' };
  fallbackSlotIndex++;
  return slot;
}

// Elementos DOM
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const statusMessage = document.getElementById('status-message');
const writingControls = document.getElementById('writing-controls');
const listeningControls = document.getElementById('listening-controls');
const playAudioBtn = document.getElementById('play-audio-btn');
const submitBtn = document.getElementById('submit-btn');
const userInput = document.getElementById('user-input');
const feedback = document.getElementById('feedback');
const furnitureList = document.getElementById('furniture-list');
const room = document.getElementById('room');
const backBtn = document.getElementById('back-btn');
const levelCompleteOverlay = document.getElementById('level-complete-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBody = document.getElementById('overlay-body');
const overlayActionBtn = document.getElementById('overlay-action-btn');
const MAX_LEVEL = Math.max(...Object.keys(levelFurniture).map(Number));

// Selección de Modo y Nivel
document.querySelectorAll('.mode-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    currentMode = card.dataset.mode;
  });
});

document.querySelectorAll('.level-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    currentLevel = parseInt(card.dataset.level);
  });
});

// Crea el div visual de un mueble a partir de sus coordenadas de sprite.
// Un solo lugar controla el recorte -> si algo se ve mal, se arregla acá,
// no hay que tocar CSS por cada mueble.
// Dimensiones reales de la hoja de sprites, detectadas al cargar la imagen.
// Se usan para poder agrandar cada mueble "de verdad" (cambiando su tamaño de caja
// y el de fondo en la misma proporción), en vez de usar transform: scale(), que
// solo cambia el dibujo visual y no el espacio que el elemento ocupa en el layout
// -> eso era lo que causaba que los muebles se superpusieran en la habitación.
let sheetNaturalW = 0;
let sheetNaturalH = 0;
const sheetPreloadImg = new Image();
sheetPreloadImg.onload = () => {
  sheetNaturalW = sheetPreloadImg.naturalWidth;
  sheetNaturalH = sheetPreloadImg.naturalHeight;
  // Si el jugador ya arrancó el juego antes de que esto terminara de cargar,
  // volvemos a dibujar el inventario para que quede bien escalado.
  if (furnitureList.children.length > 0) {
    renderFurniture();
  }
};
sheetPreloadImg.src = 'assets/furniture03.png';

function createSpriteElement(item, scale) {
  const el = document.createElement('div');
  const w = item.spriteW * scale;
  const h = item.spriteH * scale;
  el.style.width = w + 'px';
  el.style.height = h + 'px';
  el.style.backgroundImage = 'url("assets/furniture03.png")';
  // Si ya sabemos el tamaño real de la hoja, escalamos el fondo entero en la misma
  // proporción que el recorte, para que el recorte siga cayendo en el lugar correcto.
  if (sheetNaturalW && sheetNaturalH) {
    el.style.backgroundSize = `${sheetNaturalW * scale}px ${sheetNaturalH * scale}px`;
  }
  el.style.backgroundPosition = `-${item.spriteX * scale}px -${item.spriteY * scale}px`;
  el.style.backgroundRepeat = 'no-repeat';
  el.style.imageRendering = 'pixelated';
  el.style.display = 'inline-block';
  el.style.flexShrink = '0';
  el.title = item.name;
  return el;
}

// Inicializar la IA (Transformers.js)
// El modelo sst-2 es de ANÁLISIS DE SENTIMIENTO, no de gramática: no puede validar
// estructura de oraciones. Se deja como paso decorativo/opcional y nunca bloquea el juego.
async function loadAI() {
  statusMessage.innerText = "Cargando IA...";
  try {
    classifier = await window.pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    classifierReady = true;
    statusMessage.innerText = `¡IA Lista! - Nivel ${currentLevel}`;
  } catch (err) {
    classifierReady = false;
    statusMessage.innerText = "IA no disponible (el juego funciona igual).";
    console.error(err);
  }
}

// Renderizar inventario
function renderFurniture() {
  furnitureList.innerHTML = '';
  const items = levelFurniture[currentLevel] || [];

  items.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.className = 'furniture-item';
    wrapper.id = `item-${item.id}`;

    // Caja objetivo del panel lateral: todos los muebles, chicos o grandes,
    // se escalan para entrar completos en ~56px sin recortarse.
    const TARGET_BOX = 56;
    const sidebarScale = Math.max(1, TARGET_BOX / Math.max(item.spriteW, item.spriteH));

    const spriteWrap = document.createElement('div');
    spriteWrap.style.width = TARGET_BOX + 'px';
    spriteWrap.style.height = TARGET_BOX + 'px';
    spriteWrap.style.margin = '0 auto';
    spriteWrap.style.display = 'flex';
    spriteWrap.style.alignItems = 'center';
    spriteWrap.style.justifyContent = 'center';
    spriteWrap.appendChild(createSpriteElement(item, sidebarScale));

    const label = document.createElement('strong');
    label.style.display = 'block';
    label.style.marginTop = '5px';
    label.textContent = item.name;

    wrapper.appendChild(spriteWrap);
    wrapper.appendChild(label);

    // En modo escucha, cada mueble es clickeable para responder al audio
    wrapper.addEventListener('click', () => {
      if (currentMode === 'listening') handleListeningGuess(item);
    });

    furnitureList.appendChild(wrapper);
  });
}

function pickNewTarget() {
  const items = levelFurniture[currentLevel];
  const remaining = items.filter(i => !placedItems.has(i.id));
  if (remaining.length === 0) {
    currentTargetItem = null;
    return false;
  }
  currentTargetItem = remaining[Math.floor(Math.random() * remaining.length)];
  return true;
}

// Explicación simple del concepto de inglés que se practica en cada nivel.
// Pensada para que un chico de primer año pueda entenderla sin ayuda.
const levelConcepts = {
  1: {
    title: 'Lo que estás aprendiendo: Órdenes simples (Imperativos)',
    body: 'En inglés, para pedirle algo a alguien, la frase empieza directo con el VERBO (no decís "yo" ni "vos"). Ejemplo: "Put the sofa in the room." = "Poné el sofá en el cuarto."'
  },
  2: {
    title: 'Lo que estás aprendiendo: Descripciones y lugares',
    body: 'Ahora las órdenes tienen más detalles: colores, materiales, y palabras de lugar como "next to" (al lado de). Ejemplo: "Put the orange sofa next to the table."'
  },
  3: {
    title: 'Lo que estás aprendiendo: Dos órdenes juntas',
    body: 'Vas a unir dos instrucciones en una sola frase con la palabra "and" (y). Ejemplo: "Set the table in the center and place the lamp near it."'
  }
};

function updateConceptExplainer() {
  const conceptTitleEl = document.getElementById('concept-title');
  const conceptBodyEl = document.getElementById('concept-body');
  if (!conceptTitleEl || !conceptBodyEl) return; // por si el HTML todavía no tiene la tarjeta

  const concept = levelConcepts[currentLevel] || levelConcepts[1];
  conceptTitleEl.textContent = concept.title;
  conceptBodyEl.textContent = concept.body;
}

function setupGameStage() {
  placedItems = new Set();
  pickNewTarget();
  updateConceptExplainer();

  if (currentMode === 'writing') {
    writingControls.classList.remove('hidden');
    listeningControls.classList.add('hidden');
    feedback.innerText = `Level ${currentLevel}: Write a sentence to place any item in the room.`;
  } else {
    listeningControls.classList.remove('hidden');
    writingControls.classList.add('hidden');
    feedback.innerText = `Level ${currentLevel}: Click the speaker, then click the item you hear.`;
  }
}

// Muestra la pantalla de "nivel completado" o, si era el último nivel,
// la de felicitaciones finales.
function showLevelComplete() {
  const isLastLevel = currentLevel >= MAX_LEVEL;

  if (isLastLevel) {
    overlayTitle.textContent = '¡Felicitaciones!';
    overlayBody.textContent = 'Completaste los 3 niveles del juego. ¡Excelente trabajo con tu inglés!';
    overlayActionBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21V13h6v8M4 10l8-7 8 7v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
      </svg>
      <span>Volver al inicio</span>`;
  } else {
    overlayTitle.textContent = `¡Nivel ${currentLevel} completado!`;
    overlayBody.textContent = 'Estás listo para el siguiente desafío.';
    overlayActionBtn.innerHTML = `
      <span>Siguiente nivel</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  levelCompleteOverlay.dataset.isLast = isLastLevel ? 'true' : 'false';
  levelCompleteOverlay.classList.remove('hidden');
}

function selectLevelCard(level) {
  document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.level-card[data-level="${level}"]`);
  if (card) card.classList.add('selected');
}

overlayActionBtn.addEventListener('click', () => {
  const wasLast = levelCompleteOverlay.dataset.isLast === 'true';
  levelCompleteOverlay.classList.add('hidden');
  room.innerHTML = '';

  if (wasLast) {
    // Terminó el juego: vuelve a la pantalla de inicio, lista para empezar de nuevo.
    currentLevel = 1;
    selectLevelCard(1);
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
  } else {
    // Pasa directo al siguiente nivel sin volver al menú.
    currentLevel += 1;
    selectLevelCard(currentLevel);
    renderFurniture();
    setupGameStage();
  }
});

function checkLevelComplete() {
  const items = levelFurniture[currentLevel];
  if (placedItems.size >= items.length) {
    showLevelComplete();
    return true;
  }
  return false;
}

// Iniciar Juego
startBtn.addEventListener('click', () => {
  setupScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  renderFurniture();
  setupGameStage();
  loadAI();
});

// Volver al menú de selección de modo/nivel
backBtn.addEventListener('click', () => {
  window.speechSynthesis.cancel(); // corta cualquier audio que esté sonando
  room.innerHTML = '';             // vacía la habitación
  placedItems = new Set();
  currentTargetItem = null;
  userInput.value = '';
  feedback.innerText = '';
  levelCompleteOverlay.classList.add('hidden');

  gameScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
});

// Reproducir Voz (modo escucha)
playAudioBtn.addEventListener('click', () => {
  if (!currentTargetItem) return;

  const textToSpeak = `Place the ${currentTargetItem.id} in the room`;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'en-US';

  window.speechSynthesis.speak(utterance);
  feedback.innerText = "Listen carefully, then click the correct item below.";
});

// Evaluar el click del usuario en modo escucha (antes se colocaba solo sin evaluar nada)
function handleListeningGuess(item) {
  if (!currentTargetItem) return;

  if (placedItems.has(item.id)) {
    feedback.innerText = `You already placed the ${item.name}. Listen again and pick a different one.`;
    return;
  }

  if (item.id === currentTargetItem.id) {
    placeFurnitureInRoom(item);
    feedback.innerText = `Correct! You placed the ${item.name}.`;
    if (!checkLevelComplete()) pickNewTarget();
  } else {
    feedback.innerText = `Not quite. That was the ${item.name}. Listen again.`;
  }
}

// Enviar y Validar Orden Escrita
submitBtn.addEventListener('click', async () => {
  const text = userInput.value.trim().toLowerCase();
  if (!text) return;

  const words = text.split(/\s+/).map(w => w.replace(/[^a-záéíóúñ]/g, ''));
  const hasActionVerb = validVerbs.some(verb => words.includes(verb));

  if (!hasActionVerb) {
    feedback.innerText = "Grammar Error: Sentence must include an action verb (e.g., 'place', 'put', 'set').";
    return;
  }

  const currentItems = levelFurniture[currentLevel];
  const matchedItem = currentItems.find(item =>
    words.includes(item.id) || words.includes(item.name.toLowerCase())
  );

  if (!matchedItem) {
    feedback.innerText = `Vocabulary Error: Mention an item from this level (${currentItems.map(i => i.id).join(', ')}).`;
    return;
  }

  if (placedItems.has(matchedItem.id)) {
    feedback.innerText = `You already placed the ${matchedItem.name}. Try a different item.`;
    return;
  }

  feedback.innerText = "Checking...";

  if (classifierReady && classifier) {
    try { await classifier(text); } catch (err) { console.error('Classifier error (ignored):', err); }
  }

  placeFurnitureInRoom(matchedItem);
  feedback.innerText = `Correct! "${text}" validated.`;
  userInput.value = '';

  if (!checkLevelComplete()) pickNewTarget();
});

// Colocar mueble en la habitación, en su posición pensada de decoración
function placeFurnitureInRoom(item) {
  if (placedItems.has(item.id)) return;
  placedItems.add(item.id);

  // 70px de lado máximo: la franja del piso mide ~120px de alto, así que un
  // mueble alto entra cómodo sin cruzar la línea de la pared.
  const ROOM_TARGET_BOX = 70;
  const roomScale = Math.max(1, ROOM_TARGET_BOX / Math.max(item.spriteW, item.spriteH));
  const el = createSpriteElement(item, roomScale);
  el.classList.add('room-item');

  // Posicionamiento absoluto: saca el mueble del flujo lineal del flex y lo
  // manda al punto exacto definido en roomLayout. El translateX(-50%) hace que
  // el valor de "left" apunte al CENTRO del mueble, no a su borde izquierdo.
  const pos = getRoomPosition(item.id);
  el.style.position = 'absolute';
  el.style.left = pos.left;
  el.style.bottom = pos.bottom;
  el.style.transform = 'translateX(-50%)';
  if (pos.z !== undefined) el.style.zIndex = pos.z;

  room.appendChild(el);

  const sidebarItem = document.getElementById(`item-${item.id}`);
  if (sidebarItem) {
    sidebarItem.style.opacity = '0.4';
    sidebarItem.style.pointerEvents = 'none';
  }
}