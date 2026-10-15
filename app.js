const LS_KEY = 'ai_filipe_tts_characters_v1';

const elements = {
  charactersList: document.getElementById('charactersList'),
  addForm: document.getElementById('addForm'),
  nameInput: document.getElementById('nameInput'),
  voiceSelect: document.getElementById('voiceSelect'),
  rateInput: document.getElementById('rateInput'),
  rateValue: document.getElementById('rateValue'),
  pitchInput: document.getElementById('pitchInput'),
  pitchValue: document.getElementById('pitchValue'),
  avatarInput: document.getElementById('avatarInput'),
  importSampleBtn: document.getElementById('importSampleBtn'),
  activeCharacterSelect: document.getElementById('activeCharacterSelect'),
  textInput: document.getElementById('textInput'),
  speakBtn: document.getElementById('speakBtn'),
  stopBtn: document.getElementById('stopBtn'),
  previewName: document.getElementById('previewName'),
  previewAvatar: document.getElementById('previewAvatar'),
  previewMeta: document.getElementById('previewMeta'),
};

let characters = [];
let voices = [];

function loadCharacters() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    characters = raw ? JSON.parse(raw) : [];
  } catch (error) {
    characters = [];
  }
}

function saveCharacters() {
  localStorage.setItem(LS_KEY, JSON.stringify(characters));
}

function populateVoices() {
  voices = speechSynthesis.getVoices() || [];

  const voiceOptions = voices.map((voice) => {
    const label = `${voice.name} (${voice.lang})${voice.default ? ' — default' : ''}`;
    return `<option value="${voice.voiceURI}">${label}</option>`;
  }).join('');

  elements.voiceSelect.innerHTML = voiceOptions || '<option value="">Nenhuma voz disponível</option>';

  elements.activeCharacterSelect.innerHTML = '<option value="">-- Selecionar --</option>';
  characters.forEach((character) => {
    const option = document.createElement('option');
    option.value = character.id;
    option.textContent = character.name;
    elements.activeCharacterSelect.appendChild(option);
  });
}

function renderList() {
  elements.charactersList.innerHTML = '';
  elements.activeCharacterSelect.innerHTML = '<option value="">-- Selecionar --</option>';

  characters.forEach((character) => {
    const li = document.createElement('li');

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = character.avatar || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    avatar.alt = character.name;
    li.appendChild(avatar);

    const info = document.createElement('div');
    info.style.flex = '1';
    info.innerHTML = `<div class="name">${character.name}</div><div class="meta">${character.voiceName || character.voiceURI || 'voz padrão'} • rate ${character.rate} pitch ${character.pitch}</div>`;
    li.appendChild(info);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'small-btn secondary';
    editBtn.onclick = () => startEdit(character.id);
    li.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Remover';
    delBtn.className = 'small-btn';
    delBtn.onclick = () => {
      if (confirm(`Remover ${character.name}?`)) {
        removeCharacter(character.id);
      }
    };
    li.appendChild(delBtn);

    elements.charactersList.appendChild(li);

    const option = document.createElement('option');
    option.value = character.id;
    option.textContent = character.name;
    elements.activeCharacterSelect.appendChild(option);
  });

  updatePreview();
}

function startEdit(id) {
  const character = characters.find((item) => item.id === id);
  if (!character) return;

  elements.nameInput.value = character.name;
  elements.avatarInput.value = character.avatar || '';
  elements.rateInput.value = character.rate;
  elements.rateValue.textContent = character.rate;
  elements.pitchInput.value = character.pitch;
  elements.pitchValue.textContent = character.pitch;

  if (character.voiceURI) {
    elements.voiceSelect.value = character.voiceURI;
  }

  removeCharacter(id);
}

function addCharacter(character) {
  characters.push(character);
  saveCharacters();
  renderList();
}

function removeCharacter(id) {
  characters = characters.filter((character) => character.id !== id);
  saveCharacters();
  renderList();
}

function speakText() {
  const text = elements.textInput.value.trim();
  if (!text) {
    alert('Digite um texto.');
    return;
  }

  const activeId = elements.activeCharacterSelect.value;
  let character = characters.find((item) => item.id === activeId);

  if (!character) {
    character = {
      name: 'Padrão',
      voiceURI: elements.voiceSelect.value || null,
      rate: parseFloat(elements.rateInput.value) || 1,
      pitch: parseFloat(elements.pitchInput.value) || 1,
      voiceName: (voices.find((voice) => voice.voiceURI === elements.voiceSelect.value) || {}).name || null,
    };
  }

  const utterance = new SpeechSynthesisUtterance(text);

  if (character.voiceURI) {
    const chosenVoice = voices.find((voice) => voice.voiceURI === character.voiceURI);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
  }

  utterance.rate = character.rate || 1;
  utterance.pitch = character.pitch || 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function stopSpeech() {
  speechSynthesis.cancel();
}

function updatePreview() {
  const activeId = elements.activeCharacterSelect.value;
  const character = characters.find((item) => item.id === activeId);

  if (character) {
    elements.previewName.textContent = character.name;
    if (character.avatar) {
      elements.previewAvatar.src = character.avatar;
      elements.previewAvatar.hidden = false;
    } else {
      elements.previewAvatar.hidden = true;
    }
    elements.previewMeta.textContent = `${character.voiceName || character.voiceURI || 'voz'} • rate ${character.rate} pitch ${character.pitch}`;
  } else {
    elements.previewName.textContent = 'Nenhum personagem';
    elements.previewAvatar.hidden = true;
    elements.previewMeta.textContent = '';
  }
}

elements.rateInput.addEventListener('input', (event) => {
  elements.rateValue.textContent = event.target.value;
});

elements.pitchInput.addEventListener('input', (event) => {
  elements.pitchValue.textContent = event.target.value;
});

elements.addForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = elements.nameInput.value.trim();
  if (!name) {
    alert('Informe o nome do personagem.');
    return;
  }

  const voiceURI = elements.voiceSelect.value || null;
  const voiceName = (voices.find((voice) => voice.voiceURI === voiceURI) || {}).name || null;

  const newCharacter = {
    id: String(Date.now()),
    name,
    avatar: elements.avatarInput.value.trim() || '',
    voiceURI,
    voiceName,
    rate: parseFloat(elements.rateInput.value) || 1,
    pitch: parseFloat(elements.pitchInput.value) || 1,
  };

  addCharacter(newCharacter);

  elements.addForm.reset();
  elements.rateInput.value = 1;
  elements.pitchInput.value = 1;
  elements.rateValue.textContent = '1.0';
  elements.pitchValue.textContent = '1.0';
});

elements.importSampleBtn.addEventListener('click', () => {
  const sampleCharacters = [
    {
      id: 'char_1',
      name: 'Filipe - Alegre',
      avatar: '',
      voiceURI: voices[0] ? voices[0].voiceURI : null,
      voiceName: voices[0] ? voices[0].name : 'voz padrão',
      rate: 1.1,
      pitch: 1.2,
    },
    {
      id: 'char_2',
      name: 'Filipe - Calmo',
      avatar: '',
      voiceURI: voices[1] ? voices[1].voiceURI : null,
      voiceName: voices[1] ? voices[1].name : 'voz padrão',
      rate: 0.95,
      pitch: 0.9,
    },
  ];

  sampleCharacters.forEach((sample) => {
    if (!characters.find((character) => character.id === sample.id)) {
      characters.push(sample);
    }
  });

  saveCharacters();
  renderList();
});

elements.speakBtn.addEventListener('click', speakText);
elements.stopBtn.addEventListener('click', stopSpeech);
elements.activeCharacterSelect.addEventListener('change', updatePreview);

function init() {
  loadCharacters();
  populateVoices();
  renderList();

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      populateVoices();
      renderList();
    };
  }
}

init();
