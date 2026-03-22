// Variabili globali
let notes = [];
let editingId = null;

// Elementi DOM
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const saveBtn = document.getElementById('saveBtn');
const searchInput = document.getElementById('searchInput');
const notesContainer = document.getElementById('notesContainer');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Carica note dal localStorage al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderNotes(notes);
});

// Event listeners
saveBtn.addEventListener('click', saveNote);
searchInput.addEventListener('input', searchNotes);
deleteAllBtn.addEventListener('click', deleteAllNotes);

// Funzione per salvare una nota
function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('Per favore, compila sia il titolo che il contenuto!');
        return;
    }

    if (editingId) {
        // Modifica nota esistente
        const note = notes.find(n => n.id === editingId);
        if (note) {
            note.title = title;
            note.content = content;
            note.date = new Date().toLocaleString('it-IT');
            editingId = null;
            saveBtn.textContent = 'Salva Nota';
        }
    } else {
        // Crea nuova nota
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleString('it-IT')
        };
        notes.unshift(newNote); // Aggiungi in cima
    }

    // Salva nel localStorage
    saveToLocalStorage();

    // Pulisci input
    titleInput.value = '';
    contentInput.value = '';

    // Renderizza le note
    renderNotes(notes);

    // Scrolla verso le note
    notesContainer.scrollIntoView({ behavior: 'smooth' });
}

// Funzione per cercare note
function searchNotes() {
    const query = searchInput.value.toLowerCase();

    if (!query) {
        renderNotes(notes);
        return;
    }

    const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );

    renderNotes(filtered);
}

// Funzione per renderizzare le note
function renderNotes(notesToRender) {
    notesContainer.innerHTML = '';

    if (notesToRender.length === 0) {
        notesContainer.innerHTML = '<p class="empty-message">Nessuna nota trovata.</p>';
        return;
    }

    notesToRender.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <h3>${escapeHtml(note.title)}</h3>
            <div class="date">📅 ${note.date}</div>
            <p>${escapeHtml(note.content).replace(/\n/g, '<br>')}</p>
            <div class="buttons">
                <button class="btn-edit" onclick="editNote(${note.id})">✏️ Modifica</button>
                <button class="btn-delete" onclick="deleteNote(${note.id})">🗑️ Elimina</button>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// Funzione per modificare una nota
function editNote(id) {
    const note = notes.find(n => n.id === id);

    if (note) {
        titleInput.value = note.title;
        contentInput.value = note.content;
        editingId = id;
        saveBtn.textContent = 'Aggiorna Nota';

        // Scrolla verso il form
        titleInput.scrollIntoView({ behavior: 'smooth' });
        titleInput.focus();
    }
}

// Funzione per eliminare una nota
function deleteNote(id) {
    if (confirm('Sei sicuro di voler eliminare questa nota? Non potrai più recuperarla.')) {
        notes = notes.filter(note => note.id !== id);
        saveToLocalStorage();
        renderNotes(notes);
    }
}

// Funzione per eliminare tutte le note
function deleteAllNotes() {
    if (confirm('Sei sicuro di voler eliminare TUTTE le note? Questa azione non può essere annullata!')) {
        notes = [];
        saveToLocalStorage();
        renderNotes(notes);
        titleInput.value = '';
        contentInput.value = '';
        editingId = null;
        saveBtn.textContent = 'Salva Nota';
    }
}

// Funzione per salvare nel localStorage
function saveToLocalStorage() {
    localStorage.setItem('diaryNotes', JSON.stringify(notes));
}

// Funzione per caricare dal localStorage
function loadNotes() {
    const saved = localStorage.getItem('diaryNotes');
    if (saved) {
        try {
            notes = JSON.parse(saved);
        } catch (e) {
            console.error('Errore nel caricamento delle note:', e);
            notes = [];
        }
    }
}

// Funzione per escapare HTML e prevenire XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
