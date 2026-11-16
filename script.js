'use strict';
/* =====================================================================
   Cozy Grammar Room - script.js
   - Cada mueble es un PNG individual (assets/furniture, assets/small-items)
     => ya no hay recortes de spritesheet ni imágenes desfasadas.
   - Cada habitación = pared + piso (assets/rooms/roomN_wall.png / _floor.png)
   - Los objetos se ubican según la preposición del comando.
   ===================================================================== */

/* ---------- 1. CATÁLOGO DE OBJETOS (tamaños reales en píxeles) ---------- */
const ITEMS = {
  table: { id: 'table', name: 'Table', word: 'table', file: 'furniture/brown_cloth_table_front', w: 42, h: 30, role: 'surface', top: 17, flat: false, underRef: true, fitsUnder: false, onSurface: false },
  counter: { id: 'counter', name: 'Counter', word: 'counter', file: 'furniture/brown_desk_with_drawers_front', w: 48, h: 28, role: 'surface', top: 17, flat: false, underRef: true, fitsUnder: false, onSurface: false },
  desk: { id: 'desk', name: 'Desk', word: 'desk', file: 'furniture/brown_desk_with_drawers_front', w: 48, h: 28, role: 'surface', top: 17, flat: false, underRef: true, fitsUnder: false, onSurface: false },
  dining: { id: 'dining', name: 'Long table', word: 'long table', file: 'furniture/diamond_cloth_table_light_wood_front', w: 28, h: 46, role: 'surface', top: 30, flat: false, underRef: true, fitsUnder: false, onSurface: false },
  tv: { id: 'tv', name: 'TV', word: 'tv', file: 'furniture/orange_tv_with_stand_front', w: 31, h: 33, role: 'surface', top: 15, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  bookshelf: { id: 'bookshelf', name: 'Bookshelf', word: 'bookshelf', file: 'furniture/dark_wood_bookshelf_stack_front', w: 30, h: 30, role: 'surface', top: 26, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  nightstand: { id: 'nightstand', name: 'Nightstand', word: 'nightstand', file: 'furniture/dark_wood_nightstand_door_front', w: 14, h: 23, role: 'surface', top: 20, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  dside: { id: 'dside', name: 'Dark table', word: 'dark table', file: 'furniture/dark_wood_side_table_closed_front', w: 15, h: 23, role: 'surface', top: 20, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  lside: { id: 'lside', name: 'Counter', word: 'counter', file: 'furniture/light_wood_side_table_closed_front', w: 15, h: 23, role: 'surface', top: 20, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  sside: { id: 'sside', name: 'Small table', word: 'small table', file: 'furniture/light_wood_side_table_open_legs_front', w: 14, h: 23, role: 'surface', top: 20, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  aquarium: { id: 'aquarium', name: 'Aquarium', word: 'aquarium', file: 'furniture/fish_aquarium_front', w: 47, h: 28, role: 'surface', top: 22, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  bed: { id: 'bed', name: 'Bed', word: 'bed', file: 'furniture/green_bed_single_front', w: 28, h: 46, role: 'surface', top: 18, flat: false, underRef: true, fitsUnder: false, onSurface: false },
  dbed: { id: 'dbed', name: 'Double bed', word: 'double bed', file: 'furniture/plaid_double_bed_front', w: 43, h: 50, role: 'surface', top: 20, flat: false, underRef: true, fitsUnder: false, onSurface: false },
  lamp: { id: 'lamp', name: 'Lamp', word: 'lamp', file: 'furniture/tan_pouf_front', w: 12, h: 14, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  tlamp: { id: 'tlamp', name: 'Lamp', word: 'lamp', file: 'furniture/tan_tall_stool_front', w: 8, h: 15, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  chesst: { id: 'chesst', name: 'Chess table', word: 'chess table', file: 'furniture/brown_floor_lamp_checkered_shade_front', w: 14, h: 30, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  sink: { id: 'sink', name: 'Sink', word: 'sink', file: 'furniture/brown_wall_mirror_front', w: 13, h: 27, role: 'wall', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  tub: { id: 'tub', name: 'Bathtub', word: 'bathtub', file: 'furniture/blue_bathtub_water_top_view', w: 20, h: 43, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  armchair: { id: 'armchair', name: 'Armchair', word: 'armchair', file: 'furniture/green_small_armchair_front', w: 14, h: 16, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  chair: { id: 'chair', name: 'Chair', word: 'chair', file: 'furniture/orange_cushion_chair_front', w: 12, h: 27, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: true, onSurface: false },
  stool: { id: 'stool', name: 'Stool', word: 'stool', file: 'furniture/orange_cushion_stool_front_1', w: 13, h: 16, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: true, onSurface: false },
  stool2: { id: 'stool2', name: 'Brown stool', word: 'brown stool', file: 'furniture/orange_cushion_stool_front_2', w: 13, h: 16, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: true, onSurface: false },
  gstool: { id: 'gstool', name: 'Green bar stool', word: 'green bar stool', file: 'furniture/green_bar_stool_front', w: 13, h: 25, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  rstool: { id: 'rstool', name: 'Red bar stool', word: 'red bar stool', file: 'furniture/red_bar_stool_front', w: 13, h: 25, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  basket: { id: 'basket', name: 'Basket', word: 'basket', file: 'furniture/yellow_round_basket_front', w: 15, h: 15, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: true, onSurface: false },
  gbasket: { id: 'gbasket', name: 'Green basket', word: 'green basket', file: 'furniture/green_plant_round_basket_front', w: 16, h: 15, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: true, onSurface: false },
  pbasket: { id: 'pbasket', name: 'Pink basket', word: 'pink basket', file: 'furniture/pink_flower_round_basket_front', w: 16, h: 15, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: true, onSurface: false },
  plant: { id: 'plant', name: 'Plant', word: 'plant', file: 'furniture/green_potted_tall_plant_front', w: 15, h: 47, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  pshelf: { id: 'pshelf', name: 'Shelf', word: 'shelf', file: 'furniture/white_plant_shelf_front', w: 23, h: 31, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  globe: { id: 'globe', name: 'Globe', word: 'globe', file: 'furniture/gold_globe_on_stand_front', w: 16, h: 26, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: true },
  bglobe: { id: 'bglobe', name: 'Blue globe', word: 'blue globe', file: 'furniture/blue_globe_on_stand_front', w: 16, h: 26, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: true },
  easel: { id: 'easel', name: 'Easel', word: 'easel', file: 'furniture/easel_with_painting_front', w: 16, h: 29, role: 'floor', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  mat: { id: 'mat', name: 'Doormat', word: 'doormat', file: 'furniture/yellow_doormat_horizontal', w: 24, h: 14, role: 'rug', top: 3, flat: true, underRef: false, fitsUnder: false, onSurface: false },
  rug: { id: 'rug', name: 'Rug', word: 'rug', file: 'furniture/red_large_rug_rectangular', w: 64, h: 32, role: 'rug', top: 3, flat: true, underRef: false, fitsUnder: false, onSurface: false },
  grug: { id: 'grug', name: 'Green rug', word: 'green rug', file: 'furniture/olive_green_rug_horizontal', w: 46, h: 28, role: 'rug', top: 3, flat: true, underRef: false, fitsUnder: false, onSurface: false },
  lrug: { id: 'lrug', name: 'Long rug', word: 'long rug', file: 'furniture/olive_green_rug_vertical', w: 28, h: 44, role: 'rug', top: 3, flat: true, underRef: false, fitsUnder: false, onSurface: false },
  catrug: { id: 'catrug', name: 'Cat rug', word: 'cat rug', file: 'furniture/yellow_oval_rug_cat_face', w: 24, h: 16, role: 'rug', top: 3, flat: true, underRef: false, fitsUnder: false, onSurface: false },
  book: { id: 'book', name: 'Book', word: 'book', file: 'small-items/cream_closed_book_front', w: 10, h: 13, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  obook: { id: 'obook', name: 'Open book', word: 'open book', file: 'small-items/open_book_cream_front', w: 14, h: 11, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  teapot: { id: 'teapot', name: 'Teapot', word: 'teapot', file: 'small-items/golden_teapot_facing_left', w: 15, h: 14, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  pcake: { id: 'pcake', name: 'Pink cake', word: 'pink cake', file: 'small-items/pink_cake_slice_on_plate_front', w: 12, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  ccake: { id: 'ccake', name: 'Chocolate cake', word: 'chocolate cake', file: 'small-items/chocolate_cake_slice_on_plate_front', w: 12, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  rpot: { id: 'rpot', name: 'Red pot', word: 'red pot', file: 'small-items/red_round_pot_front', w: 12, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  bpot: { id: 'bpot', name: 'Blue pot', word: 'blue pot', file: 'small-items/blue_round_pot_front', w: 12, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  ojar: { id: 'ojar', name: 'Orange jar', word: 'orange jar', file: 'small-items/orange_spice_jar_front', w: 7, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  pjar: { id: 'pjar', name: 'Purple jar', word: 'purple jar', file: 'small-items/purple_spice_jar_front', w: 7, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  gbottle: { id: 'gbottle', name: 'Green bottle', word: 'green bottle', file: 'small-items/green_spray_bottle_front', w: 9, h: 15, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  bbottle: { id: 'bbottle', name: 'Blue bottle', word: 'blue bottle', file: 'small-items/blue_spray_bottle_front', w: 9, h: 15, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  pbag: { id: 'pbag', name: 'Pink bag', word: 'pink bag', file: 'small-items/pink_handbag_front', w: 12, h: 15, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  gbag: { id: 'gbag', name: 'Green bag', word: 'green bag', file: 'small-items/green_flower_handbag_front', w: 12, h: 15, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  calendar: { id: 'calendar', name: 'Calendar', word: 'calendar', file: 'small-items/cream_desk_calendar_front', w: 11, h: 12, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  notepad: { id: 'notepad', name: 'Notepad', word: 'notepad', file: 'small-items/cream_plant_notepaper_front', w: 10, h: 14, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  fpot: { id: 'fpot', name: 'Flower pot', word: 'flower pot', file: 'small-items/yellow_flower_potted_plant_front', w: 14, h: 24, role: 'small', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  clock: { id: 'clock', name: 'Clock', word: 'clock', file: 'small-items/brown_wall_clock_front', w: 12, h: 14, role: 'wall', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  planner: { id: 'planner', name: 'Planner', word: 'planner', file: 'small-items/cream_weekly_planner_board_front', w: 16, h: 14, role: 'wall', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
  poster: { id: 'poster', name: 'Poster', word: 'poster', file: 'small-items/cream_framed_flower_poster_front', w: 10, h: 14, role: 'wall', top: 0, flat: false, underRef: false, fitsUnder: false, onSurface: false },
};

/* ---------- 2. NIVELES ---------- */
/* Cada nivel es una habitación DISEÑADA: los muebles base ya están puestos y
   cada objeto del jugador tiene su lugar exacto ("plan").
   x = px nativos desde el CENTRO de la habitación, b = altura de la base (0 = abajo).
   En "plan": dx / db ajustan la posición respecto al mueble de referencia. */
const levelConfig = {
  1: { theme: 1, room: 'Bedroom', prepositions: ['on', 'under'],
       base: [ { id: 'bed', x: -52, b: 28 }, { id: 'nightstand', x: -29, b: 28 }, { id: 'desk', x: 44, b: 14 } ],
       plan: [
         { id: 'lamp',     prep: 'on',    refs: ['nightstand'] },
         { id: 'obook',    prep: 'on',    refs: ['bed'], dx: 0 },
         { id: 'notepad',  prep: 'on',    refs: ['desk'], dx: -14 },
         { id: 'rpot',     prep: 'on',    refs: ['desk'], dx: 0 },
         { id: 'calendar', prep: 'on',    refs: ['desk'], dx: 14 },
         { id: 'stool',    prep: 'under', refs: ['desk'], dx: 0, db: -10 },
         { id: 'rug',      prep: 'under', refs: ['bed'],  dx: 0, db: -26 },
         { id: 'basket',   prep: 'under', refs: ['bed'],  dx: -19, db: -9 }
       ],
       example: 'Place the lamp on the nightstand.' },
  2: { theme: 2, room: 'Kitchen', prepositions: ['on', 'under', 'next to'],
       base: [ { id: 'counter', x: -44, b: 38 }, { id: 'table', x: 40, b: 12 } ],
       plan: [
         { id: 'teapot', prep: 'on',      refs: ['counter'], dx: -12 },
         { id: 'ojar',   prep: 'on',      refs: ['counter'], dx: 10 },
         { id: 'pcake',  prep: 'on',      refs: ['table'],   dx: -10 },
         { id: 'ccake',  prep: 'on',      refs: ['table'],   dx: 10 },
         { id: 'grug',   prep: 'under',   refs: ['table'],   dx: 0, db: -9 },
         { id: 'chair',  prep: 'next to', refs: ['table'],   dx: -31, db: 0 },
         { id: 'gstool', prep: 'next to', refs: ['counter'], dx: 31, db: -6 },
         { id: 'rstool', prep: 'next to', refs: ['counter'], dx: -37, db: -6 }
       ],
       example: 'Place the teapot on the counter.' },
  3: { theme: 3, room: 'Living room', prepositions: ['next to', 'behind', 'in front of'],
       base: [ { id: 'tv', x: -56, b: 36 }, { id: 'desk', x: 56, b: 34 }, { id: 'aquarium', x: 56, b: 51, z: 'desk+1' } ],
       plan: [
         { id: 'armchair', prep: 'in front of', refs: ['tv'],       dx: 0,   db: -22 },
         { id: 'chesst',   prep: 'next to',     refs: ['armchair'], dx: 17,  db: 0 },
         { id: 'chair',    prep: 'next to',     refs: ['chesst'],   dx: 16,  db: 0 },
         { id: 'plant',    prep: 'behind',      refs: ['chair'],    dx: 0,   db: 12 },
         { id: 'gbasket',  prep: 'next to',     refs: ['tv'],       dx: -26, db: 0 },
         { id: 'pshelf',    prep: 'next to',     refs: ['desk'],     dx: 38,  db: 0 },
         { id: 'pbasket',  prep: 'in front of', refs: ['desk'],     dx: 0,   db: -14 },
         { id: 'stool',    prep: 'next to',     refs: ['desk'],     dx: -33, db: 0 }
       ],
       example: 'Place the armchair in front of the TV.' },
  4: { theme: 4, room: 'Study', prepositions: ['on top of', 'under', 'next to'],
       base: [ { id: 'bookshelf', x: -80, b: 38 }, { id: 'desk', x: 0, b: 36 }, { id: 'dside', x: 70, b: 34 } ],
       plan: [
         { id: 'obook',    prep: 'on top of', refs: ['desk'], dx: -15 },
         { id: 'globe',    prep: 'on top of', refs: ['desk'], dx: 3 },
         { id: 'tlamp',    prep: 'on top of', refs: ['desk'], dx: 18 },
         { id: 'fpot',     prep: 'on top of', refs: ['dside'], dx: 0 },
         { id: 'grug',     prep: 'under',     refs: ['desk'], dx: 0, db: -28 },
         { id: 'stool2',   prep: 'under',     refs: ['desk'], dx: -8, db: -10 },
         { id: 'easel',    prep: 'next to',   refs: ['desk'], dx: -36, db: -4 },
         { id: 'armchair', prep: 'next to',   refs: ['desk'], dx: 34, db: -6 }
       ],
       example: 'Place the globe on top of the desk.' },
  5: { theme: 2, room: 'Bathroom', prepositions: ['between', 'to the left of', 'to the right of'],
       base: [ { id: 'sink', x: 0, b: 54 }, { id: 'tub', x: -66, b: 2 } ],
       plan: [
         { id: 'pshelf',   prep: 'to the left of',  refs: ['sink'],         dx: -23, db: -16 },
         { id: 'dside',   prep: 'to the right of', refs: ['sink'],         dx: 17,  db: -16 },
         { id: 'gbasket', prep: 'to the right of', refs: ['dside'],        dx: 36,  db: -2 },
         { id: 'plant',   prep: 'between',         refs: ['dside', 'gbasket'], dx: 0, db: -3 },
         { id: 'lside',   prep: 'to the right of', refs: ['gbasket'],      dx: 18,  db: 2 },
         { id: 'stool',   prep: 'between',         refs: ['tub', 'pshelf'], dx: 0,   db: 0 },
         { id: 'mat',     prep: 'to the right of', refs: ['tub'],          dx: 25,  db: 2 },
         { id: 'pbasket', prep: 'to the left of',  refs: ['tub'],          dx: -20, db: 2 }
       ],
       example: 'Place the shelf to the left of the sink.' },
  6: { theme: 3, room: 'Guest room', prepositions: ['above', 'under', 'next to', 'on top of'],
       base: [ { id: 'dbed', x: -10, b: 30 }, { id: 'nightstand', x: -39, b: 30 }, { id: 'dside', x: 20, b: 30 } ],
       plan: [
         { id: 'clock',   prep: 'on top of', refs: ['nightstand'], dx: 0 },
         { id: 'lamp',    prep: 'on top of', refs: ['dside'], dx: 0 },
         { id: 'obook',   prep: 'on top of', refs: ['dbed'], dx: -8 },
         { id: 'gbag',    prep: 'on top of', refs: ['dbed'], dx: 8 },
         { id: 'poster',  prep: 'above',     refs: ['dbed'], dx: 0, db: 2 },
         { id: 'planner', prep: 'above',     refs: ['nightstand'], dx: 0, db: 13 },
         { id: 'catrug',  prep: 'under',     refs: ['dbed'], dx: 0, db: -14 },
         { id: 'basket',  prep: 'next to',   refs: ['nightstand'], dx: -18, db: 0 }
       ],
       example: 'Place the clock on top of the nightstand.' }
};
Object.values(levelConfig).forEach(cfg => {
  cfg.furnitureIds = cfg.plan.map(p => p.id);
  cfg.entry = Object.fromEntries(cfg.plan.map(p => [p.id, p]));
});
const TOTAL_LEVELS = 6;

/* Cómo cambia cada dificultad
   writing:   blanks = completar huecos · tiles = banco de palabras (tipo Duolingo) · free = escribir todo
   listening: transcript = se ve el texto · ghostAfter / transcriptAfter = errores antes de recibir ayuda
   Toda ayuda (botón Help, ayuda automática, fantasma, texto) = 0 puntos para ese mueble. */
const difficultyRules = {
  easy:   { writing: 'blanks', needVerbAndArticles: false, exactSentence: false,
            showTranscript: true,  maxPlays: Infinity, ghostAfter: 2, transcriptAfter: Infinity, helpAfter: 3, rate: 0.85 },
  normal: { writing: 'tiles',  needVerbAndArticles: true,  exactSentence: false,
            showTranscript: false, maxPlays: Infinity, ghostAfter: Infinity, transcriptAfter: 3, helpAfter: 3, rate: 0.95 },
  hard:   { writing: 'free',   needVerbAndArticles: true,  exactSentence: true,
            showTranscript: false, maxPlays: 2, ghostAfter: Infinity, transcriptAfter: Infinity, helpAfter: 3, rate: 1.05 }
};

/* ---------- 3. DECORACIÓN DE FONDO (solo para dar vida, no se usa en el juego) ----------
   sill   = altura del zócalo de la pared (la ventana se apoya ahí)
   wall   = cuadros/relojes colgados: x = % del ancho, r = altura sobre el zócalo
   shelf  = repisa con objetos encima
   floor  = muebles decorativos en la zona izquierda: left = px nativos desde la izquierda
   rug    = alfombra decorativa (solo si el nivel no trae una alfombra propia) */
/* sill = altura del zócalo de cada pared (la ventana se apoya ahí) */
const THEME_SILL = { 1: 54, 2: 64, 3: 57, 4: 64 };

/* x = px nativos desde el centro de la habitación, b = altura de la base.
   Cada habitación está compuesta como un ambiente real (sin objetos sueltos al azar). */
const roomDecor = {
  /* 1 · DORMITORIO */
  1: { windows: [2, 44],
       items: [
         { file: 'furniture/green_potted_tall_plant_front',                    x: -96, b: 30, w: 15, h: 47 },
         { file: 'small-items/gray_blue_wall_clock_front',                     x: -92, b: 80, w: 12, h: 14 },
         { file: 'small-items/orange_sunset_framed_painting_horizontal_front', x: -52, b: 82, w: 14, h: 10 },
         { file: 'small-items/cream_framed_flower_poster_front',               x: 90,  b: 62, w: 10, h: 14 },
         { file: 'small-items/cream_weekly_planner_board_front',               x: 90,  b: 82, w: 16, h: 14 }
       ], rug: null },
  /* 2 · COCINA */
  2: { windows: [40],
       items: [
         { file: 'furniture/green_potted_tall_plant_front',                    x: -98, b: 36, w: 15, h: 47 },
         { file: 'small-items/green_chalkboard_with_clock_wall_front',         x: -44, b: 72, w: 30, h: 19 },
         { file: 'furniture/dark_wood_wall_shelf_plank',                       x: -2,  b: 84, w: 16, h: 5 },
         { file: 'small-items/blue_round_pot_front',                           x: -6,  b: 89, w: 12, h: 12 },
         { file: 'small-items/purple_spice_jar_front',                         x: 3,   b: 89, w: 7, h: 12 },
         { file: 'furniture/dark_wood_wall_coat_rack_front',                   x: 74,  b: 86, w: 16, h: 10 },
         { file: 'small-items/blue_green_landscape_handbag_front',             x: 74,  b: 71, w: 12, h: 15 },
         { file: 'furniture/white_plant_shelf_front',                          x: 94,  b: 38, w: 23, h: 31 }
       ], rug: null },
  /* 3 · LIVING */
  3: { windows: [-4],
       items: [
         { file: 'small-items/brown_wall_clock_front',                         x: -92, b: 80, w: 12, h: 14 },
         { file: 'small-items/green_landscape_framed_painting_vertical_front', x: -56, b: 73, w: 14, h: 26 },
         { file: 'small-items/orange_sunset_framed_painting_horizontal_front', x: 56,  b: 84, w: 14, h: 10 }
       ], rug: { file: 'furniture/olive_green_rug_horizontal', x: -38, b: 2, w: 46, h: 28 } },
  /* 4 · ESTUDIO */
  4: { windows: [-38, 38],
       items: [
         { file: 'small-items/blue_cityscape_framed_painting_vertical_front',  x: -80, b: 72, w: 14, h: 26 },
         { file: 'small-items/green_chalkboard_with_clock_wall_front',         x: 0,   b: 76, w: 30, h: 19 },
         { file: 'small-items/cream_weekly_planner_board_front',               x: 70,  b: 70, w: 16, h: 14 },
         { file: 'furniture/green_potted_tall_plant_front',                    x: 97,  b: 34, w: 15, h: 47 }
       ], rug: null },
  /* 5 · BAÑO */
  5: { windows: [-62, 62],
       items: [
         { file: 'furniture/light_wood_wall_shelf_plank',                      x: 0,   b: 86, w: 16, h: 5 },
         { file: 'small-items/green_spray_bottle_front',                       x: -5,  b: 91, w: 9, h: 15 },
         { file: 'small-items/blue_spray_bottle_front',                        x: 5,   b: 91, w: 9, h: 15 },
         { file: 'small-items/gray_blue_wall_clock_front',                     x: -23, b: 76, w: 12, h: 14 },
         { file: 'furniture/dark_wood_wall_coat_rack_front',                   x: 94,  b: 84, w: 16, h: 10 },
         { file: 'small-items/pink_handbag_front',                             x: 94,  b: 69, w: 12, h: 15 }
       ], rug: null },
  /* 6 · CUARTO DE INVITADOS */
  6: { windows: [-70, 66],
       items: [
         { file: 'furniture/green_potted_tall_plant_front',                    x: -98, b: 30, w: 15, h: 47 },
         { file: 'furniture/white_plant_shelf_front',                          x: 94,  b: 38, w: 23, h: 31 }
       ], rug: null }
};
const CURTAINS = { file: 'furniture/cream_curtains_front', w: 31, h: 30 };
const WINDOW_W = 30, WINDOW_H = 34;

/* decoración de la pantalla de inicio */
const startProps = [
  { file: 'furniture/green_small_armchair_front',  left: 6,  w: 14, h: 16 },
  { file: 'furniture/brown_cloth_table_front',     left: 17, w: 42, h: 30 },
  { file: 'small-items/golden_teapot_facing_left', left: 22, lift: 22, w: 15, h: 14 },
  { file: 'furniture/brown_floor_lamp_checkered_shade_front', left: 33, w: 14, h: 30 },
  { file: 'furniture/green_potted_tall_plant_front', left: 72, w: 15, h: 47 },
  { file: 'furniture/dark_wood_bookshelf_stack_front', left: 82, w: 30, h: 30 }
];
const startFloaters = [
  { file: 'small-items/cream_closed_book_front',       x: 10, y: 16, d: 0,   w: 10, h: 13 },
  { file: 'small-items/pink_cake_slice_on_plate_front', x: 86, y: 14, d: 0.6, w: 12, h: 12 },
  { file: 'small-items/brown_wall_clock_front',         x: 18, y: 56, d: 1.1, w: 12, h: 14 },
  { file: 'small-items/yellow_flower_potted_plant_front', x: 80, y: 52, d: 0.3, w: 14, h: 24 },
  { file: 'small-items/cream_framed_flower_poster_front', x: 92, y: 36, d: 0.9, w: 10, h: 14 }
];

/* ---------- 4. DISTRIBUCIÓN DE LA HABITACIÓN (puro, sin DOM) ----------
   Todo se mide en "píxeles nativos" del arte (1 px = S px en pantalla).
   Las posiciones salen del diseño de cada nivel, no se calculan al azar. */
const ROOM_H = 111;
const FLOOR_H = 47;
const DESIGN_W = 215;      // ancho para el que está pensada la composición

/* devuelve {id: {x (desde la izquierda), b, z, w, h}} de los muebles base + los
   objetos de `placed`. W = ancho de la habitación en px nativos. */
function layoutFor(level, placed, W) {
  const cfg = levelConfig[level];
  const cx = W / 2;
  const out = {};
  cfg.base.forEach(b => {
    out[b.id] = { x: cx + b.x, b: b.b, z: 100 - Math.round(b.b), w: ITEMS[b.id].w, h: ITEMS[b.id].h };
  });
  // algunos muebles base van apoyados sobre otro (ej. pecera sobre el escritorio)
  cfg.base.forEach(b => {
    if (typeof b.z === 'string') out[b.id].z = out[b.z.split('+')[0]].z + Number(b.z.split('+')[1] || 0);
  });
  const need = new Set(placed);
  function boxOf(id) {
    if (out[id]) return out[id];
    const e = cfg.entry[id];
    const it = ITEMS[id];
    const R = boxOf(e.refs[0]);
    const R2 = e.refs[1] ? boxOf(e.refs[1]) : null;
    const r1 = ITEMS[e.refs[0]];
    const dx = e.dx || 0;
    let x = R.x + dx, b = R.b + (e.db || 0), z;
    switch (e.prep) {
      case 'on':
      case 'on top of':
        b = R.b + r1.top + (e.db || 0); z = R.z + 1; break;
      case 'above':
        b = R.b + r1.h + (e.db !== undefined ? e.db : 3); z = R.z + 1; break;
      case 'under':
        z = it.flat ? 2 : R.z + 1; break;
      case 'behind':
        z = R.z - 1; break;
      case 'in front of':
        z = R.z + 1; break;
      case 'between':
        x = (R.x + R2.x) / 2 + dx; b = (R.b + R2.b) / 2 + (e.db || 0);
        z = Math.max(R.z, R2.z) + 1; break;
      default:
        z = 100 - Math.round(b);
    }
    if (e.zd !== undefined) z = R.z + e.zd;
    out[id] = { x, b, z, w: it.w, h: it.h };
    return out[id];
  }
  need.forEach(id => { if (cfg.entry[id]) boxOf(id); });
  return out;
}

/* ---------- 5. ANÁLISIS DE LA ORACIÓN (puro, sin DOM) ---------- */
function normalizeText(t) {
  return ' ' + t.toLowerCase().replace(/[.,!?;:"]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
}
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const normPrep = p => (p === 'on top of' ? 'on' : p);

/* ids de objetos en el orden en que aparecen en el texto (se prefieren los nombres más largos) */
function findItems(text, ids) {
  const found = [];
  let rest = text;
  ids.slice().sort((a, b) => ITEMS[b].word.length - ITEMS[a].word.length).forEach(id => {
    const re = new RegExp('\\b' + escapeRegExp(ITEMS[id].word) + '\\b');
    const m = re.exec(rest);
    if (m) {
      found.push({ id, index: m.index });
      rest = rest.slice(0, m.index) + ' '.repeat(m[0].length) + rest.slice(m.index + m[0].length);
    }
  });
  return found.sort((a, b) => a.index - b.index).map(f => f.id);
}

/* inRoom: Set con lo que ya está en la habitación (base + colocados) */
function parseCommand(rawText, level, difficulty, inRoom) {
  const cfg = levelConfig[level];
  const baseIds = cfg.base.map(b => b.id);
  const room = inRoom || new Set(baseIds);
  const rules = difficultyRules[difficulty] || difficultyRules.easy;
  const text = normalizeText(rawText);
  if (text.trim() === '') return { ok: false, error: 'empty' };

  const preps = [...cfg.prepositions].sort((a, b) => b.length - a.length);
  let prep = null, prepIdx = -1;
  for (const p of preps) {
    const idx = text.indexOf(' ' + p + ' ');
    if (idx >= 0) { prep = p; prepIdx = idx; break; }
  }
  if (!prep) return { ok: false, error: 'no-prep' };

  const all = cfg.furnitureIds.concat(baseIds);
  const before = text.slice(0, prepIdx + 1);
  const after = text.slice(prepIdx + prep.length + 1);

  const subjList = findItems(before, all);
  if (subjList.length === 0) return { ok: false, error: 'no-subject' };
  const subject = subjList[subjList.length - 1];
  if (baseIds.includes(subject)) return { ok: false, error: 'base-fixed', subject };

  const refsAll = findItems(after, all);
  if (refsAll.length === 0) return { ok: false, error: 'no-ref', prep, subject };
  const refs = refsAll.filter(r => r !== subject);
  if (refs.length === 0) return { ok: false, error: 'same-item', prep, subject };
  if (prep === 'between' && refs.length < 2) return { ok: false, error: 'between-two', prep, subject };

  const usedRefs = prep === 'between' ? refs.slice(0, 2) : refs.slice(0, 1);
  const missing = usedRefs.find(r => !room.has(r));
  if (missing) return { ok: false, error: 'ref-missing', prep, subject, ref: missing };

  // ¿coincide con el lugar que tiene este objeto en la habitación?
  const e = cfg.entry[subject];
  const samePrep = normPrep(prep) === normPrep(e.prep);
  const sameRefs = [...usedRefs].sort().join() === [...e.refs].sort().join();
  if (!samePrep || !sameRefs) return { ok: false, error: 'wrong-spot', subject, samePrep, sameRefs };

  if (rules.needVerbAndArticles) {
    const hasVerb = /^ (place|put) /.test(text);
    const hasThe = text.indexOf(' the ' + ITEMS[subject].word + ' ') >= 0 &&
      usedRefs.every(r => after.indexOf('the ' + ITEMS[r].word) >= 0);
    if (!hasVerb || !hasThe) return { ok: false, error: 'grammar', subject, prep: e.prep, refs: e.refs };
  }
  if (rules.exactSentence) {
    const refPart = usedRefs.map(r => 'the ' + ITEMS[r].word).join(' and ');
    const exact = new RegExp('^ (place|put) the ' + escapeRegExp(ITEMS[subject].word) + ' ' +
      escapeRegExp(prep) + ' ' + escapeRegExp(refPart) + ' $');
    if (!exact.test(text)) return { ok: false, error: 'grammar', subject, prep: e.prep, refs: e.refs };
  }
  return { ok: true, subject, prep: e.prep, refs: e.refs };
}

function sentenceFor(subject, prep, refs) {
  const refPart = refs.map(r => 'the ' + ITEMS[r].word).join(' and ');
  return `Place the ${ITEMS[subject].word} ${prep} ${refPart}.`;
}

/* ---------- 6. ESTADO ---------- */
let currentMode = 'writing';
let currentDifficulty = 'easy';
let currentLevel = 1;
let unlockedLevels = { writing: [1], listening: [1] };
let selectedMascot = 'bunny';
let darkMode = false;

let placedItems = new Set();   // objetos que el jugador colocó con un comando
let currentTarget = null;      // modo listening: { id, prep, refs }
let hasListenedAudio = false;
let playsLeft = Infinity;
let score = 0;                 // puntos del nivel
let itemState = {};            // id -> { mistakes, assisted, attempts }
let activeItem = null;         // Writing: mueble elegido
let sentenceDone = new Set();  // Writing: muebles cuya oración ya está lista
let tileState = {};            // Writing (normal): id -> { order, picks }
let listenMisses = 0;          // Listening: errores en el mueble actual

const mascotImages = {
  bunny: 'assets/bunny.png',
  cat: 'assets/cat.png',
  bear: 'assets/bear.png'
};

/* ---------- 7. UTILIDADES DE DOM ---------- */
const $ = id => (typeof document !== 'undefined' ? document.getElementById(id) : null);

function getScale() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--s'));
  return v > 0 ? v : 4;
}
/* ajusta el zoom del arte para que la habitación siempre entre completa */
function fitScale() {
  const vw = window.innerWidth || 1366, vh = window.innerHeight || 700;
  let sW;
  if (vw >= 1150) sW = (vw - 712) / DESIGN_W;          // 3 columnas: muebles | habitación | panel
  else if (vw >= 900) sW = (vw - 350) / DESIGN_W;      // muebles | habitación (controles abajo)
  else sW = (vw - 90) / DESIGN_W;                      // todo en una columna
  // alto: cabecera + barra superior + habitación (+ controles si no hay 3 columnas)
  const reserved = vw >= 1150 ? 178 : 400;
  const sH = (vh - reserved) / ROOM_H;
  let s = Math.floor(Math.min(sW, sH) * 2) / 2;
  s = Math.max(2, Math.min(5, s));
  document.documentElement.style.setProperty('--s', String(s));
}
function saveState() {
  try {
    localStorage.setItem('cozy-unlocked', JSON.stringify(unlockedLevels));
    localStorage.setItem('cozy-mascot', selectedMascot);
    localStorage.setItem('cozy-dark', darkMode ? '1' : '0');
    localStorage.setItem('cozy-voice', voiceOn ? '1' : '0');
  } catch (e) { /* sin almacenamiento: no pasa nada */ }
}
function loadState() {
  try {
    const u = JSON.parse(localStorage.getItem('cozy-unlocked'));
    if (u && Array.isArray(u.writing) && Array.isArray(u.listening)) unlockedLevels = u;
    const m = localStorage.getItem('cozy-mascot');
    if (m && mascotImages[m]) selectedMascot = m;
    darkMode = localStorage.getItem('cozy-dark') === '1';
    voiceOn = localStorage.getItem('cozy-voice') !== '0';
  } catch (e) { /* ignorar */ }
}

function makeSprite(file, w, h, alt) {
  const img = document.createElement('img');
  img.src = `assets/${file}.png`;
  img.alt = alt || '';
  img.draggable = false;
  img.style.imageRendering = 'pixelated';
  if (w) img.style.width = `calc(var(--s) * ${w}px)`;
  if (h) img.style.height = `calc(var(--s) * ${h}px)`;
  return img;
}

/* ---------- 8. MODO NOCHE ---------- */
function applyTheme() {
  document.body.classList.toggle('dark-mode', darkMode);
  const icon = $('theme-icon');
  if (icon) {
    icon.onerror = () => { icon.onerror = null; icon.src = 'assets/luna.png'; };
    icon.src = darkMode ? 'assets/sol.png' : 'assets/luna.png';
  }
}
function setupThemeToggle() {
  $('theme-toggle-btn')?.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
    saveState();
  });
}

/* ---------- 9. MASCOTA ---------- */
function updateMascotDisplay() {
  const path = mascotImages[selectedMascot] || mascotImages.bunny;
  ['menu-mascot', 'game-mascot-sprite', 'win-mascot', 'start-mascot'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.style.backgroundImage = `url("${path}")`;
    el.style.backgroundPosition = 'center bottom';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
  });
  document.querySelectorAll('.mascot-opt').forEach(b =>
    b.classList.toggle('selected', b.dataset.mascot === selectedMascot));
  document.querySelectorAll('.char-card').forEach(b =>
    b.classList.toggle('selected', b.dataset.char === selectedMascot));
}
function setMascotText(txt) {
  const box = $('game-mascot-dialog');
  if (box) box.innerText = txt;
}
function triggerMascotReaction(txt, animClass) {
  setMascotText(txt);
  const mascot = $('game-mascot-sprite');
  if (!mascot) return;
  mascot.classList.remove('jump-anim', 'shake-anim');
  void mascot.offsetWidth;
  mascot.classList.add(`${animClass}-anim`);
}

/* ---------- 10. MENÚ PRINCIPAL ---------- */
function renderLevelGrid() {
  const grid = $('level-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const active = unlockedLevels[currentMode];
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const unlocked = active.includes(i);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `level-card ${i === currentLevel ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`;
    if (unlocked) {
      btn.innerText = i;
    } else {
      btn.innerHTML = '<img src="assets/candado.png" class="icon-lock" alt="Locked" width="24" height="24">';
    }
    btn.addEventListener('click', () => {
      if (!unlocked) return;
      currentLevel = i;
      renderLevelGrid();
    });
    grid.appendChild(btn);
  }
}

function setupMenu() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentMode = btn.dataset.mode;
      if (!unlockedLevels[currentMode].includes(currentLevel)) currentLevel = 1;
      renderLevelGrid();
    });
  });
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentDifficulty = btn.dataset.diff;
    });
  });

  // Ajustes
  $('settings-btn')?.addEventListener('click', () => $('settings-modal')?.classList.remove('hidden'));
  $('close-settings-btn')?.addEventListener('click', () => $('settings-modal')?.classList.add('hidden'));
  document.querySelectorAll('.mascot-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMascot = btn.dataset.mascot;
      updateMascotDisplay();
      saveState();
    });
  });
  $('reset-progress-btn')?.addEventListener('click', () => {
    unlockedLevels = { writing: [1], listening: [1] };
    currentLevel = 1;
    saveState();
    renderLevelGrid();
    $('settings-modal')?.classList.add('hidden');
  });

  $('menu-mascot')?.addEventListener('click', openCharacterModal);
  if ($('menu-mascot')) $('menu-mascot').style.cursor = 'pointer';

  // Pantalla previa al nivel
  $('prepare-btn')?.addEventListener('click', () => {
    const cfg = levelConfig[currentLevel];
    $('loading-title').innerText = `Level ${currentLevel}`;
    $('level-preps-list').innerText = cfg.prepositions.join('  ·  ');
    let ex = $('level-example');
    if (!ex) {
      ex = document.createElement('p');
      ex.id = 'level-example';
      ex.className = 'level-example';
      $('level-preps-list').after(ex);
    }
    ex.innerText = `Example: ${cfg.example}`;
    let tut = $('level-tutorial');
    if (!tut) {
      tut = document.createElement('div');
      tut.id = 'level-tutorial';
      tut.className = 'tutorial';
      ex.after(tut);
    }
    renderTutorial(tut);
    $('loading-screen')?.classList.remove('hidden');
  });
  $('start-level-btn')?.addEventListener('click', () => {
    $('loading-screen')?.classList.add('hidden');
    $('setup-screen')?.classList.add('hidden');
    $('game-screen')?.classList.remove('hidden');
    loadStage();
  });
}

/* ---------- 10b. TUTORIAL ANTES DE CADA NIVEL ---------- */
const TUTORIALS = {
  'writing-easy': { title: 'Writing · Easy — Fill in the blanks', steps: [
    'Tap a furniture card. A glowing ghost shows where it goes.',
    'Complete the sentence: type the missing words in the blanks. Your buddy shows the Word box with the words you need.',
    'Press Check ✔. If it is right, DRAG the furniture into the room, to the glowing spot.',
    'Stuck? Press Help and your buddy says the sentence (0 points for that furniture).' ] },
  'writing-normal': { title: 'Writing · Medium — Word bank', steps: [
    'Tap a furniture card. A glowing ghost shows where it goes.',
    'Build the sentence by tapping the words in the right order. Careful: there are extra words you do not need!',
    'Press Check ✔. If it is right, DRAG the furniture into the room, to the glowing spot.',
    'Stuck? Press Help and your buddy says the sentence (0 points for that furniture).' ] },
  'writing-hard': { title: 'Writing · Hard — Write it yourself', steps: [
    'Tap a furniture card and look at the glowing spot.',
    'Write the whole sentence yourself: "Place the ... (preposition) the ...".',
    'If it is right, DRAG the furniture into the room, to the glowing spot.',
    'Having trouble? Your buddy gives you hints and, after 3 tries, says the sentence (0 points).' ] },
  'listening-easy': { title: 'Listening · Easy', steps: [
    'Press Listen Command. You will HEAR the sentence and also SEE it.',
    'Find the furniture you heard in the list and DRAG it to the right place in the room.',
    'You can listen as many times as you want.',
    'After 2 mistakes a glowing spot shows the place (0 points for that furniture).' ] },
  'listening-normal': { title: 'Listening · Medium', steps: [
    'Press Listen Command. You will only HEAR the sentence (no text!).',
    'Find the furniture you heard and DRAG it to the right place in the room.',
    'You can listen as many times as you want.',
    'After 3 mistakes your buddy shows you the sentence (0 points for that furniture).' ] },
  'listening-hard': { title: 'Listening · Hard', steps: [
    'Press Listen Command. You can only listen TWICE for each furniture.',
    'Find the furniture you heard and DRAG it to the right place in the room.',
    'There are no hints. Listen carefully to the preposition!' ] }
};
function renderTutorial(box) {
  box.innerHTML = '';
  const t = TUTORIALS[`${currentMode}-${currentDifficulty}`];
  if (!t) return;
  box.appendChild(el('h3', 'tut-title', `How to play: ${t.title}`));
  const ol = el('ol', 'tut-steps');
  t.steps.forEach(txt => ol.appendChild(el('li', null, txt)));
  box.appendChild(ol);
  box.appendChild(el('p', 'tut-score', '★ 10 points = perfect · 5 points = with mistakes · 0 points = with help'));
}

/* ---------- 11. HABITACIÓN ---------- */
function roomWorldWidth() {
  const room = $('room');
  return room ? room.clientWidth / getScale() : DESIGN_W;
}

function renderDecor() {
  const room = $('room');
  if (!room) return;
  room.querySelectorAll('.room-decor').forEach(el => el.remove());
  const cfg = levelConfig[currentLevel];
  const d = roomDecor[currentLevel];
  const sill = THEME_SILL[cfg.theme];
  const hasRug = cfg.furnitureIds.some(id => ITEMS[id].role === 'rug');

  const put = (it, z) => {
    const img = makeSprite(it.file, it.w, it.h, '');
    img.className = 'room-decor room-decor-sprite';
    img.style.left = `calc(50% + var(--s) * ${it.x - it.w / 2}px)`;
    img.style.bottom = `calc(var(--s) * ${it.b}px)`;
    img.style.zIndex = z;
    room.appendChild(img);
  };

  if (d.rug && !hasRug) put(d.rug, 1);

  // ventanas apoyadas en el zócalo + cortinas
  d.windows.forEach(wx => {
    const win = document.createElement('div');
    win.className = 'room-decor room-window';
    win.style.left = `calc(50% + var(--s) * ${wx - WINDOW_W / 2}px)`;
    win.style.bottom = `calc(var(--s) * ${sill}px)`;
    room.appendChild(win);
    put({ ...CURTAINS, x: wx, b: sill + WINDOW_H - CURTAINS.h + 2 }, 2);
  });

  // muebles de fondo y objetos de pared
  d.items.forEach(it => put(it, it.b >= FLOOR_H + 10 ? (it.b >= 80 ? 3 : 2) : 1));
}

/* dibuja (o redibuja) todos los objetos de la habitación */
function renderRoomItems() {
  const room = $('room');
  if (!room) return;
  const S = getScale();
  const layout = layoutFor(currentLevel, [...placedItems], roomWorldWidth());
  Object.keys(layout).forEach(id => {
    const box = layout[id];
    const it = ITEMS[id];
    let el = room.querySelector(`.room-item[data-id="${id}"]`);
    if (!el) {
      el = makeSprite(it.file, it.w, it.h, it.name);
      el.classList.add('room-item');
      if (placedItems.has(id)) el.classList.add('pop-in');
      el.dataset.id = id;
      room.appendChild(el);
    }
    el.style.left = `${Math.round((box.x - it.w / 2) * S)}px`;
    el.style.bottom = `${Math.round(box.b * S)}px`;
    el.style.zIndex = Math.round(box.z) + 10;
  });
  if (ghostId) showGhost(ghostId);
}

/* "fantasma": muestra dónde va el objeto elegido (en modo Writing) */
let ghostId = null;
function hideGhost() {
  ghostId = null;
  $('room')?.querySelectorAll('.room-ghost').forEach(el => el.remove());
  document.querySelectorAll('.furniture-item-card.picked').forEach(c => c.classList.remove('picked'));
}
function showGhost(id) {
  const room = $('room');
  if (!room || placedItems.has(id)) return;
  room.querySelectorAll('.room-ghost').forEach(el => el.remove());
  ghostId = id;
  const S = getScale();
  const box = layoutFor(currentLevel, [id], roomWorldWidth())[id];
  const it = ITEMS[id];
  const g = makeSprite(it.file, it.w, it.h, '');
  g.className = 'room-ghost';
  g.style.left = `${Math.round((box.x - it.w / 2) * S)}px`;
  g.style.bottom = `${Math.round(box.b * S)}px`;
  g.style.zIndex = Math.round(box.z) + 10;
  room.appendChild(g);
  if ($(`shelf-${id}`)?.classList.contains('danger')) g.classList.add('red');
  document.querySelectorAll('.furniture-item-card').forEach(c =>
    c.classList.toggle('picked', c.id === `shelf-${id}`));
}

function setRoomTheme() {
  const room = $('room');
  if (!room) return;
  room.className = `cozy-room theme-${levelConfig[currentLevel].theme}`;
}

/* coloca `subject` con la preposición indicada (los objetos de referencia
   que todavía no están en la habitación aparecen en su lugar por defecto) */
function applyPlacement(subject) {
  hideGhost();
  markDanger(null, false);
  const pts = pointsFor(subject);
  score += pts;
  placedItems.add(subject);
  sentenceDone.delete(subject);
  $(`shelf-${subject}`)?.classList.add('disabled');
  $(`shelf-${subject}`)?.classList.remove('ready');
  updateProgress();
  renderRoomItems();
  floatPoints(subject, pts);
  return pts;
}
/* "+10" flotando sobre el mueble recién puesto */
function floatPoints(id, pts) {
  const room = $('room');
  if (!room) return;
  const box = layoutFor(currentLevel, [id], roomWorldWidth())[id];
  const S = getScale();
  const t = document.createElement('div');
  t.className = 'float-points' + (pts === 0 ? ' zero' : '');
  t.innerText = `+${pts}`;
  t.style.left = `${Math.round(box.x * S)}px`;
  t.style.bottom = `${Math.round((box.b + ITEMS[id].h) * S)}px`;
  room.appendChild(t);
  setTimeout(() => t.remove(), 1300);
}

/* ---------- 12. NIVEL ---------- */
function st(id) { return itemState[id] || (itemState[id] = { mistakes: 0, assisted: false, attempts: 0 }); }
/* 10 = perfecto · 5 = con errores · 0 = con ayuda */
function pointsFor(id) { const s = st(id); return s.assisted ? 0 : (s.mistakes > 0 ? 5 : 10); }
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.innerText = text;
  return e;
}
const maxScore = () => levelConfig[currentLevel].furnitureIds.length * 10;

function updateProgress() {
  let badge = $('progress-badge');
  if (!badge) {
    badge = el('span', 'badge badge-soft');
    badge.id = 'progress-badge';
    $('diff-badge')?.after(badge);
  }
  badge.innerText = `Placed ${placedItems.size}/${levelConfig[currentLevel].furnitureIds.length}`;
  let sb = $('score-badge');
  if (!sb) {
    sb = el('span', 'badge badge-gold');
    sb.id = 'score-badge';
    badge.after(sb);
  }
  sb.innerText = `★ ${score} pts`;
}

function loadStage() {
  placedItems.clear();
  ghostId = null;
  fitScale();
  currentTarget = null;
  hasListenedAudio = false;
  score = 0;
  itemState = {};
  activeItem = null;
  sentenceDone = new Set();
  tileState = {};
  listenMisses = 0;
  const cfg = levelConfig[currentLevel];

  const room = $('room');
  if (room) { room.innerHTML = ''; setRoomTheme(); renderDecor(); renderRoomItems(); }

  $('status-badge').innerText = `Level ${currentLevel}`;
  $('diff-badge').innerText = currentDifficulty.toUpperCase();
  updateProgress();

  const shelf = $('furniture-list');
  if (shelf) shelf.innerHTML = '';
  // los objetos del nivel, en un orden mezclado y fijo
  const shelfIds = cfg.furnitureIds.slice();
  const rank = id => (id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 7 + currentLevel * 13) % 17;
  shelfIds.sort((a, b) => rank(a) - rank(b));
  shelfIds.forEach(id => {
    const it = ITEMS[id];
    const card = el('div', 'furniture-item-card');
    card.id = `shelf-${id}`;
    card.title = it.name;
    card.style.touchAction = 'none';

    const box = el('div', 'card-img');
    const maxSide = 52;
    const scale = Math.min(maxSide / it.w, maxSide / it.h);
    const k = scale >= 1 ? Math.floor(scale) : scale;
    const img = makeSprite(it.file, 0, 0, it.name);
    img.style.width = `${Math.round(it.w * k)}px`;
    img.style.height = `${Math.round(it.h * k)}px`;
    box.appendChild(img);

    card.append(box, el('span', 'card-name', it.name));
    card.addEventListener('pointerdown', e => startPress(e, id, card));
    shelf?.appendChild(card);
  });

  if (currentMode === 'writing') {
    $('writing-controls')?.classList.remove('hidden');
    $('listening-controls')?.classList.add('hidden');
    $('user-input').value = '';
    renderWritingPanel();
    setMascotText('Tap a furniture card to start!');
  } else {
    $('listening-controls')?.classList.remove('hidden');
    $('writing-controls')?.classList.add('hidden');
    pickListeningTarget();
  }
  updateMascotDisplay();
}

/* ---------- 13. MODO WRITING ---------- */
function roomSet() {
  return new Set(levelConfig[currentLevel].base.map(b => b.id).concat([...placedItems]));
}

function describeError(res, cfg) {
  const w = id => ITEMS[id].word;
  switch (res.error) {
    case 'no-prep': return `Use a preposition like: ${cfg.prepositions.join(', ')}`;
    case 'no-subject': return `I can't find that item. Try: ${cfg.furnitureIds.map(i => ITEMS[i].name).join(', ')}`;
    case 'base-fixed': return `The ${w(res.subject)} is already in the room! Pick an item from the list.`;
    case 'no-ref': return `The ${w(res.subject)} ${res.prep} what? Name another object.`;
    case 'ref-missing': return `The ${w(res.ref)} isn't in the room yet. Place it first!`;
    case 'wrong-spot':
      if (res.samePrep) return `Good preposition, but that's not the right object. Look at the glowing spot!`;
      if (res.sameRefs) return `Right object, but check the preposition. Look at the glowing spot!`;
      return `That's not where the ${w(res.subject)} goes. Look at the glowing spot!`;
    case 'same-item': return "An object can't be next to itself! Use two different objects.";
    case 'between-two': return 'Use two objects: between the ___ and the ___';
    case 'grammar': return `Almost! Write it like this: Place the ${w(res.subject)} ${res.prep} the ${w(res.refs[0])}${res.refs[1] ? ' and the ' + w(res.refs[1]) : ''}.`;
    default: return 'Type a sentence first!';
  }
}

/* oración correcta y sus piezas para el mueble `id` */
function expectedFor(id) {
  const e = levelConfig[currentLevel].entry[id];
  return { e, subj: ITEMS[id].word, prep: e.prep, refs: e.refs.map(r => ITEMS[r].word), sentence: sentenceFor(id, e.prep, e.refs) };
}
/* palabras que el amigo le muestra al jugador (preposiciones + muebles que hay en la habitación) */
function wordBoxFor(id) {
  const cfg = levelConfig[currentLevel];
  const words = new Set(cfg.prepositions);
  roomSet().forEach(r => words.add(ITEMS[r].word));
  words.add(ITEMS[id].word);
  return [...words].sort();
}

/* el jugador toca (sin arrastrar) una tarjeta */
function handleCardTap(id) {
  if (placedItems.has(id)) return;
  if (currentMode === 'listening') {
    triggerMascotReaction(hasListenedAudio ? 'Drag the furniture you heard into the room!' : 'Press Listen Command first! 🔊', 'jump');
    return;
  }
  selectItem(id);
}

function selectItem(id) {
  const e = levelConfig[currentLevel].entry[id];
  const missing = e.refs.find(r => !roomSet().has(r));
  hideGhost();
  if (id !== activeItem) markDanger(null, false);
  if (missing) {
    activeItem = null;
    renderWritingPanel();
    triggerMascotReaction(`Place the ${ITEMS[missing].word} first, then the ${ITEMS[id].word}!`, 'shake');
    return;
  }
  activeItem = id;
  showGhost(id);
  renderWritingPanel();
  if (sentenceDone.has(id)) setMascotText(`Drag the ${ITEMS[id].word} to the glowing spot!`);
  else setMascotText(`Where does the ${ITEMS[id].word} go? Look at the glowing spot and write it!`);
}

function ensureWritingPanel() {
  let p = $('writing-panel');
  if (!p) {
    p = el('div', 'writing-panel');
    p.id = 'writing-panel';
    $('writing-controls').prepend(p);
  }
  return p;
}

/* pista con la manito (assets/hand.png); si falta la imagen se usa el emoji */
function handHint(text) {
  const box = el('div', 'w-hint hand-hint');
  const img = document.createElement('img');
  img.src = 'assets/hand.png';
  img.alt = '';
  img.className = 'hand-icon';
  img.onerror = () => { img.onerror = null; img.replaceWith(document.createTextNode('👆 ')); };
  box.append(img, el('span', null, text));
  return box;
}

/* pequeño sprite + nombre del mueble elegido */
function itemHeader(id) {
  const it = ITEMS[id];
  const head = el('div', 'w-head');
  const k = Math.max(1, Math.floor(Math.min(30 / it.w, 30 / it.h)));
  const img = makeSprite(it.file, 0, 0, it.name);
  img.style.width = `${it.w * k}px`;
  img.style.height = `${it.h * k}px`;
  head.append(img, el('b', null, it.name));
  return head;
}

function renderWritingPanel() {
  const p = ensureWritingPanel();
  p.innerHTML = '';
  const input = $('user-input'), submit = $('submit-btn');
  const rules = difficultyRules[currentDifficulty];
  const free = rules.writing === 'free';
  input.classList.add('hidden');
  submit.classList.add('hidden');

  if (!activeItem) {
    p.appendChild(handHint('Tap a furniture card to start.'));
    return;
  }
  const id = activeItem;
  const x = expectedFor(id);
  p.appendChild(itemHeader(id));

  if (sentenceDone.has(id)) {
    p.appendChild(el('div', 'w-done', `✔ ${x.sentence}`));
    p.appendChild(el('div', 'w-hint', `Now drag the ${ITEMS[id].name} into the room, to the glowing spot ✨`));
    return;
  }

  if (rules.writing === 'blanks') {
    /* FÁCIL: completar los huecos */
    const row = el('div', 'w-sentence');
    const blank = k => { const i = document.createElement('input'); i.type = 'text'; i.className = 'blank'; i.dataset.k = k; i.placeholder = '___'; i.autocomplete = 'off'; return i; };
    row.append(el('span', null, 'Place the '), el('b', 'w-subj', x.subj), el('span', null, ' '));
    const bp = blank('prep'); row.append(bp, el('span', null, ' the '));
    const b0 = blank('r0'); row.append(b0);
    let b1 = null;
    if (x.refs[1]) { b1 = blank('r1'); row.append(el('span', null, ' and the '), b1); }
    row.append(el('span', null, '.'));
    p.appendChild(row);

    const box = el('div', 'w-words');
    box.append(el('span', 'w-label', 'Word box:'));
    wordBoxFor(id).forEach(w => box.appendChild(el('span', 'chip', w)));
    p.appendChild(box);

    const actions = el('div', 'w-actions');
    const check = el('button', 'small-btn primary', 'Check ✔');
    check.type = 'button';
    check.addEventListener('click', () => checkBlanks(bp, b0, b1));
    actions.append(check, helpButton());
    p.appendChild(actions);
    return;
  }

  if (rules.writing === 'tiles') {
    /* NORMAL: banco de palabras (tipo Duolingo) */
    const ts = tilesFor(id);
    p.appendChild(el('div', 'w-hint', 'Tap the words in order. Some are extra!'));
    const answer = el('div', 'w-answer');
    if (ts.picks.length === 0) answer.appendChild(el('span', 'w-placeholder', 'Your sentence...'));
    ts.picks.forEach(k => {
      const t = ts.order.find(o => o.k === k);
      const b = el('button', 'tile', t.text);
      b.type = 'button';
      b.addEventListener('click', () => { ts.picks = ts.picks.filter(q => q !== k); renderWritingPanel(); });
      answer.appendChild(b);
    });
    p.appendChild(answer);
    const bank = el('div', 'w-bank');
    ts.order.filter(t => !ts.picks.includes(t.k)).forEach(t => {
      const b = el('button', 'tile', t.text);
      b.type = 'button';
      b.addEventListener('click', () => { ts.picks.push(t.k); renderWritingPanel(); });
      bank.appendChild(b);
    });
    p.appendChild(bank);
    const actions = el('div', 'w-actions');
    const check = el('button', 'small-btn primary', 'Check ✔');
    check.type = 'button';
    check.addEventListener('click', checkTiles);
    const clear = el('button', 'small-btn', 'Clear');
    clear.type = 'button';
    clear.addEventListener('click', () => { ts.picks = []; renderWritingPanel(); });
    actions.append(check, clear, helpButton());
    p.appendChild(actions);
    return;
  }

  /* DIFÍCIL: escribir todo solo */
  p.appendChild(el('div', 'w-hint', `Write the whole sentence for the ${ITEMS[id].name}, describing the glowing spot.`));
  input.classList.remove('hidden');
  submit.classList.remove('hidden');
  const actions = el('div', 'w-actions');
  actions.appendChild(helpButton());
  p.appendChild(actions);
}

function helpButton() {
  const b = el('button', 'small-btn help', 'Help (0 pts)');
  b.type = 'button';
  b.addEventListener('click', () => revealSentence(false));
  return b;
}

/* mezcla estable para que las fichas no cambien de lugar al redibujar */
function tilesFor(id) {
  if (tileState[id]) return tileState[id];
  const x = expectedFor(id);
  const cfg = levelConfig[currentLevel];
  const tokens = ['Place', 'the', x.subj, x.prep, 'the', x.refs[0]];
  if (x.refs[1]) tokens.push('and', 'the', x.refs[1]);
  const order = tokens.map((t, i) => ({ k: 't' + i, text: t }));
  // palabras de más
  const wrongPrep = cfg.prepositions.find(p => normPrep(p) !== normPrep(x.prep));
  const used = new Set([x.subj, ...x.refs]);
  const wrongObj = [...roomSet()].map(r => ITEMS[r].word).find(w => !used.has(w));
  [wrongPrep, wrongObj, 'a'].filter(Boolean).forEach((t, i) => order.push({ k: 'd' + i, text: t }));
  let seed = id.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7) + currentLevel;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  tileState[id] = { order, picks: [], tokens };
  return tileState[id];
}

function checkBlanks(bp, b0, b1) {
  const id = activeItem;
  const x = expectedFor(id);
  const norm = v => v.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
  const okPrep = normPrep(norm(bp.value)) === normPrep(x.prep);
  let okRefs;
  if (b1) {
    const got = [norm(b0.value), norm(b1.value)].sort().join('|');
    okRefs = got === [...x.refs].sort().join('|');
  } else okRefs = norm(b0.value) === x.refs[0];
  bp.classList.toggle('ok', okPrep); bp.classList.toggle('bad', !okPrep);
  [b0, b1].filter(Boolean).forEach(b => { b.classList.toggle('ok', okRefs); b.classList.toggle('bad', !okRefs); });
  if (okPrep && okRefs) { markSentenceDone(id, false); return; }
  sentenceFail(!okPrep ? 'Check the preposition. Which word describes the glowing spot?' : 'Check the object. Which furniture is it next to?');
}

function checkTiles() {
  const id = activeItem;
  const ts = tilesFor(id);
  const got = ts.picks.map(k => ts.order.find(o => o.k === k).text.toLowerCase()).join(' ');
  const exp = ts.tokens.map(t => t.toLowerCase()).join(' ');
  if (got === exp) { markSentenceDone(id, false); return; }
  sentenceFail(ts.picks.length === 0 ? 'Tap some words first!' : 'Not yet! Check the order and the extra words.');
}

function submitHard() {
  if (!activeItem) { triggerMascotReaction('Tap a furniture card first!', 'shake'); return; }
  if (sentenceDone.has(activeItem)) return;
  const input = $('user-input');
  const raw = input.value.trim();
  if (!raw) return;
  const cfg = levelConfig[currentLevel];
  const id = activeItem;
  const res = parseCommand(raw, currentLevel, 'hard', roomSet());
  if (res.ok && res.subject === id) { input.value = ''; markSentenceDone(id, false); return; }
  if (res.ok) { triggerMascotReaction(`That sentence is about the ${ITEMS[res.subject].word}. Write about the ${ITEMS[id].word}!`, 'shake'); return; }
  const x = expectedFor(id);
  let msg = describeError(res, cfg);
  const s = st(id);
  if (s.attempts === 1) msg += `  Hint: Place the ${x.subj} ___ the ___ (words: ${cfg.prepositions.join(', ')})`;
  sentenceFail(msg);
}

/* mueble (tarjeta y fantasma) en rojo: avisa que queda un solo intento */
function markDanger(id, on) {
  document.querySelectorAll('.furniture-item-card.danger').forEach(c => c.classList.remove('danger'));
  if (on && id) $(`shelf-${id}`)?.classList.add('danger');
  $('room')?.querySelectorAll('.room-ghost').forEach(g => g.classList.toggle('red', !!on));
}
const LAST_TRY = '⚠ You have 1 try left!';

/* una oración incorrecta: el amigo ayuda, y después de varios intentos la completa (sin puntos) */
function sentenceFail(msg) {
  const id = activeItem;
  const s = st(id);
  s.attempts++; s.mistakes++;
  const left = difficultyRules[currentDifficulty].helpAfter - s.attempts;
  if (left === 1) {
    markDanger(id, true);
    triggerMascotReaction(`${msg}  ${LAST_TRY}`, 'shake');
  } else {
    triggerMascotReaction(msg, 'shake');
  }
  if (left <= 0) revealSentence(true);
}

/* muestra la oración correcta (ayuda): ese mueble ya no da puntos */
function revealSentence(auto) {
  if (!activeItem) { triggerMascotReaction('Tap a furniture card first!', 'shake'); return; }
  const id = activeItem;
  st(id).assisted = true;
  const x = expectedFor(id);
  markDanger(id, true);
  markSentenceDone(id, true);
  triggerMascotReaction(`${auto ? "Let me help you! " : ''}${x.sentence}  (No points for this one, but now you know!)`, 'jump');
}

function markSentenceDone(id, assisted) {
  sentenceDone.add(id);
  $(`shelf-${id}`)?.classList.add('ready');
  renderWritingPanel();
  if (!assisted) triggerMascotReaction(`Great sentence! Now drag the ${ITEMS[id].word} to the glowing spot.`, 'jump');
}

/* ---------- 14. MODO LISTENING ---------- */
function pickListeningTarget() {
  const cfg = levelConfig[currentLevel];
  const inRoom = roomSet();
  // solo objetos cuya referencia ya está en la habitación
  const ready = cfg.plan.filter(e => !placedItems.has(e.id) && e.refs.every(r => inRoom.has(r)));
  if (ready.length === 0) return;
  const e = ready[Math.floor(Math.random() * ready.length)];
  currentTarget = { id: e.id, prep: e.prep, refs: e.refs };
  hasListenedAudio = false;
  listenMisses = 0;
  hideGhost();
  markDanger(null, false);
  playsLeft = difficultyRules[currentDifficulty].maxPlays;
  setMascotText("Press 'Listen Command' to hear the instruction!");
}

function playCommandAudio() {
  if (!currentTarget) return;
  const rules = difficultyRules[currentDifficulty];
  if (playsLeft <= 0) {
    triggerMascotReaction('No more plays for this one. Pick the furniture and drag it!', 'shake');
    return;
  }
  playsLeft--;
  hasListenedAudio = true;
  const sentence = sentenceFor(currentTarget.id, currentTarget.prep, currentTarget.refs);
  if (voiceOn && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(sentence);
    msg.lang = 'en-US';
    msg.rate = rules.rate;
    window.speechSynthesis.speak(msg);
  }
  const extra = isFinite(playsLeft) ? ` (${playsLeft} plays left)` : '';
  const shown = rules.showTranscript || listenMisses >= rules.transcriptAfter;
  setMascotText(shown ? `"${sentence}"` : `Now drag the furniture you heard into the room!${extra}`);
}

function listenMiss(msg) {
  const rules = difficultyRules[currentDifficulty];
  listenMisses++;
  const t = currentTarget;
  st(t.id).mistakes++;
  const limit = Math.min(rules.ghostAfter, rules.transcriptAfter);   // errores hasta recibir ayuda
  const left = limit - listenMisses;
  let extra = '';
  if (isFinite(limit) && left === 1) {
    // último intento: la tarjeta del mueble se pone roja
    markDanger(t.id, true);
    extra = `  ${LAST_TRY}`;
  }
  if (listenMisses >= rules.ghostAfter) {
    st(t.id).assisted = true;
    showGhost(t.id);
    markDanger(t.id, true);
    extra = ' Follow the red spot! (0 points)';
  }
  if (listenMisses >= rules.transcriptAfter) {
    st(t.id).assisted = true;
    extra = ` "${sentenceFor(t.id, t.prep, t.refs)}" (0 points)`;
  }
  triggerMascotReaction(msg + extra, 'shake');
}

/* ---------- 14b. ARRASTRAR MUEBLES (el jugador los mueve) ---------- */
let press = null;
let dragEl = null;
const TOL_B = 12;
const tolX = it => 10 + it.w * 0.35;

function startPress(e, id, card) {
  if (e.button !== undefined && e.button !== 0) return;
  if (placedItems.has(id)) return;
  press = { id, card, x: e.clientX, y: e.clientY, dragging: false };
  window.addEventListener('pointermove', onPressMove);
  window.addEventListener('pointerup', onPressUp);
  window.addEventListener('pointercancel', onPressUp);
}

function canDrag(id) {
  if (currentMode === 'writing') {
    if (activeItem === id && sentenceDone.has(id)) return true;
    selectItem(id);
    if (activeItem === id && !sentenceDone.has(id)) triggerMascotReaction(`First write where the ${ITEMS[id].word} goes, then drag it!`, 'shake');
    return false;
  }
  if (!hasListenedAudio) { triggerMascotReaction('Press Listen Command first! 🔊', 'shake'); return false; }
  return true;
}

function onPressMove(e) {
  if (!press) return;
  if (!press.dragging) {
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < 8) return;
    if (!canDrag(press.id)) { endPress(); return; }
    press.dragging = true;
    press.card.classList.add('dragging');
    const it = ITEMS[press.id], S = getScale();
    dragEl = makeSprite(it.file, it.w, it.h, '');
    dragEl.className = 'drag-sprite';
    dragEl.style.width = `${it.w * S}px`;
    dragEl.style.height = `${it.h * S}px`;
    document.body.appendChild(dragEl);
  }
  moveDragSprite(e.clientX, e.clientY);
  // el fantasma se ilumina cuando estás cerca del lugar correcto
  const d = dropPoint(e.clientX, e.clientY, press.id);
  const ghost = $('room')?.querySelector('.room-ghost');
  if (ghost) ghost.classList.toggle('near', !!d && isNearTarget(press.id, d));
}

function moveDragSprite(cx, cy) {
  if (!dragEl) return;
  dragEl.style.left = `${cx}px`;
  dragEl.style.top = `${cy}px`;
}

function endPress() {
  window.removeEventListener('pointermove', onPressMove);
  window.removeEventListener('pointerup', onPressUp);
  window.removeEventListener('pointercancel', onPressUp);
  dragEl?.remove();
  dragEl = null;
  press?.card.classList.remove('dragging');
  $('room')?.querySelector('.room-ghost')?.classList.remove('near');
  const p = press;
  press = null;
  return p;
}

function onPressUp(e) {
  const p = endPress();
  if (!p) return;
  if (!p.dragging) { handleCardTap(p.id); return; }
  const drop = dropPoint(e.clientX, e.clientY, p.id);
  if (!drop) { triggerMascotReaction('Drop it inside the room!', 'shake'); return; }
  evaluateDrop(p.id, drop);
}

/* posición (en px nativos) de la base del mueble soltado, o null si cayó fuera de la habitación */
function dropPoint(cx, cy, id) {
  const room = $('room');
  if (!room) return null;
  const r = room.getBoundingClientRect();
  if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
  const S = getScale();
  return { x: (cx - r.left) / S, b: (r.bottom - cy) / S - ITEMS[id].h / 2 };
}
function isNearTarget(id, drop) {
  const t = layoutFor(currentLevel, [id], roomWorldWidth())[id];
  return Math.abs(drop.x - t.x) <= tolX(ITEMS[id]) && Math.abs(drop.b - t.b) <= TOL_B;
}

function evaluateDrop(id, drop) {
  const it = ITEMS[id];
  if (currentMode === 'listening') {
    if (!currentTarget) return;
    if (id !== currentTarget.id) { listenMiss(`That's not the furniture you heard. Listen again!`); return; }
    if (!isNearTarget(id, drop)) { listenMiss(`Not there! Listen again and think about the preposition.`); return; }
    const t = currentTarget;
    const pts = applyPlacement(t.id);
    triggerMascotReaction(`Great job! ${sentenceFor(t.id, t.prep, t.refs)} +${pts}`, 'jump');
    currentTarget = null;
    hasListenedAudio = false;
    if (!checkCompletion()) pickListeningTarget();
    return;
  }
  // Writing
  if (!isNearTarget(id, drop)) {
    st(id).mistakes++;
    triggerMascotReaction(`Not quite! Read your sentence again: "${expectedFor(id).sentence}" Drag it to the glowing spot.`, 'shake');
    return;
  }
  const pts = applyPlacement(id);
  activeItem = null;
  renderWritingPanel();
  triggerMascotReaction(`Awesome! ${it.name} placed! +${pts}`, 'jump');
  checkCompletion();
}

/* ---------- 15. FINAL DE NIVEL ---------- */
function checkCompletion() {
  if (placedItems.size < levelConfig[currentLevel].furnitureIds.length) return false;
  const active = unlockedLevels[currentMode];
  if (currentLevel < TOTAL_LEVELS && !active.includes(currentLevel + 1)) {
    active.push(currentLevel + 1);
    saveState();
    renderLevelGrid();
  }
  const pct = score / maxScore();
  const stars = pct >= 0.9 ? 3 : (pct >= 0.55 ? 2 : 1);
  let ws = $('win-score');
  if (!ws) {
    ws = el('p', 'win-score');
    ws.id = 'win-score';
    $('overlay-action-btn')?.before(ws);
  }
  ws.innerText = `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}  Score: ${score} / ${maxScore()}`;
  setTimeout(() => $('level-complete-overlay')?.classList.remove('hidden'), 700);
  return true;
}

function setupGameButtons() {
  $('submit-btn')?.addEventListener('click', submitHard);
  $('user-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') submitHard(); });
  $('play-audio-btn')?.addEventListener('click', playCommandAudio);

  $('overlay-action-btn')?.addEventListener('click', () => {
    $('level-complete-overlay')?.classList.add('hidden');
    if (currentLevel < TOTAL_LEVELS) {
      currentLevel++;
      loadStage();
    } else {
      currentLevel = 1;
      $('game-screen')?.classList.add('hidden');
      $('setup-screen')?.classList.remove('hidden');
      renderLevelGrid();
    }
  });
  $('back-btn')?.addEventListener('click', () => {
    hideGhost();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    $('game-screen')?.classList.add('hidden');
    $('setup-screen')?.classList.remove('hidden');
    renderLevelGrid();
  });
  window.addEventListener('resize', () => {
    if ($('game-screen')?.classList.contains('hidden')) return;
    fitScale();
    renderRoomItems();
  });
}

/* ---------- 15a. PERSONAJE (ventana propia) y AJUSTES ---------- */
let voiceOn = true;

function buildCharacterModal() {
  if ($('character-modal')) return;
  const m = document.createElement('div');
  m.id = 'character-modal';
  m.className = 'modal hidden';
  const names = { bunny: 'Bunny', cat: 'Cat', bear: 'Bear' };
  m.innerHTML = `
    <div class="modal-content">
      <h2>Choose your buddy</h2>
      <p>Your buddy will help you in every room!</p>
      <div class="char-grid"></div>
      <button id="character-close" class="action-btn secondary" type="button">Done</button>
    </div>`;
  const grid = m.querySelector('.char-grid');
  Object.keys(mascotImages).forEach(key => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'char-card';
    b.dataset.char = key;
    b.innerHTML = `<span class="char-img" style="background-image:url('${mascotImages[key]}')"></span><span>${names[key]}</span>`;
    b.addEventListener('click', () => {
      selectedMascot = key;
      updateMascotDisplay();
      saveState();
    });
    grid.appendChild(b);
  });
  document.body.appendChild(m);
  $('character-close').addEventListener('click', () => m.classList.add('hidden'));
}
function openCharacterModal() { $('character-modal')?.classList.remove('hidden'); }

/* Ajustes: sin mascota (eso está en "Character"), con modo noche y voz */
function enhanceSettingsModal() {
  const modal = $('settings-modal');
  if (!modal || modal.dataset.enhanced) return;
  modal.dataset.enhanced = '1';
  modal.querySelectorAll('h3, .mascot-selection').forEach(el => el.classList.add('hidden'));

  const row = (id, label) => {
    const b = document.createElement('button');
    b.id = id; b.type = 'button'; b.className = 'setting-toggle';
    b.innerHTML = `<span>${label}</span><b></b>`;
    return b;
  };
  const dark = row('toggle-dark', 'Night mode');
  const voice = row('toggle-voice', 'Voice (listening mode)');
  const sync = () => {
    dark.querySelector('b').innerText = darkMode ? 'ON' : 'OFF';
    voice.querySelector('b').innerText = voiceOn ? 'ON' : 'OFF';
    dark.classList.toggle('selected', darkMode);
    voice.classList.toggle('selected', voiceOn);
  };
  dark.addEventListener('click', () => { darkMode = !darkMode; applyTheme(); saveState(); sync(); });
  voice.addEventListener('click', () => { voiceOn = !voiceOn; saveState(); sync(); });
  modal.querySelector('h2')?.after(dark, voice);
  sync();
  $('theme-toggle-btn')?.addEventListener('click', sync);
}

/* ---------- 15b. PANTALLA DE INICIO (se crea por JS, el HTML no cambia) ---------- */
function buildStartScreen() {
  if ($('start-screen')) return;
  const scr = document.createElement('div');
  scr.id = 'start-screen';
  scr.className = 'start-screen';

  startFloaters.forEach(f => {
    const img = makeSprite(f.file, f.w, f.h, '');
    img.className = 'start-float';
    img.style.left = `calc(${f.x}% - var(--s) * ${f.w / 2}px)`;
    img.style.top = `${f.y}%`;
    img.style.animationDelay = `${f.d}s`;
    scr.appendChild(img);
  });

  const star = document.createElement('div');
  star.className = 'start-star';
  const title = document.createElement('h1');
  title.className = 'start-title';
  title.innerHTML = '<span>Cozy</span> Grammar Room';
  const sub = document.createElement('p');
  sub.className = 'start-subtitle';
  sub.innerText = 'Decorate cozy rooms and learn English prepositions!';

  const menu = document.createElement('div');
  menu.className = 'start-menu';
  const mk = (txt, fn, cls) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'start-btn' + (cls ? ' ' + cls : '');
    b.innerText = txt;
    b.addEventListener('click', fn);
    menu.appendChild(b);
  };
  mk('Play', () => scr.classList.add('hidden'), 'primary');
  mk('Character', openCharacterModal);
  mk('How to play', () => $('howto-modal')?.classList.remove('hidden'));
  mk('Settings', () => $('settings-modal')?.classList.remove('hidden'));

  const mascot = document.createElement('div');
  mascot.id = 'start-mascot';
  mascot.className = 'mascot-avatar start-mascot';

  const strip = document.createElement('div');
  strip.className = 'start-floor';
  startProps.forEach(p => {
    const img = makeSprite(p.file, p.w, p.h, '');
    img.className = 'start-prop';
    img.style.left = `calc(${p.left}% - var(--s) * ${p.w / 2}px)`;
    img.style.bottom = `calc(var(--s) * ${6 + (p.lift || 0)}px)`;
    scr.appendChild(img);
  });

  scr.append(star, title, sub, menu, mascot, strip);
  document.body.appendChild(scr);

  // ventana "How to play"
  const how = document.createElement('div');
  how.id = 'howto-modal';
  how.className = 'modal hidden';
  how.innerHTML = `
    <div class="modal-content">
      <h2>How to play</h2>
      <p><b>Writing:</b> type a sentence like <i>Place the book on the table.</i></p>
      <p><b>Listening:</b> listen to the instruction and pick the right furniture.</p>
      <p>Some furniture is NOT needed in each level, so be careful!</p>
      <p>Finish a level to unlock the next one.</p>
      <button id="howto-close" class="action-btn secondary" type="button">Got it!</button>
    </div>`;
  document.body.appendChild(how);
  $('howto-close').addEventListener('click', () => how.classList.add('hidden'));

  // tocar el título del juego vuelve a la pantalla de inicio
  document.querySelector('.game-header h1')?.addEventListener('click', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    scr.classList.remove('hidden');
  });
}

/* ---------- 16. ARRANQUE ---------- */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('load', () => {
    loadState();
    applyTheme();
    setupThemeToggle();
    setupMenu();
    setupGameButtons();
    renderLevelGrid();
    buildCharacterModal();
    enhanceSettingsModal();
    buildStartScreen();
    updateMascotDisplay();
  });
}

/* para pruebas en Node (no afecta al navegador) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ITEMS, levelConfig, parseCommand, layoutFor, sentenceFor, findItems };
}
