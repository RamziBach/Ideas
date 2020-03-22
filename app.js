let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
let title = '';
let text = '';
let id = '';

const form = document.querySelector('#form');
const noteText = document.querySelector('#note-text');
const noteTitle = document.querySelector('#note-title');
const formButtons = document.querySelector('.form-buttons');
const formClose = document.querySelector('#form-close-button');
const notes = document.querySelector('#notes');
const notesChild = document.querySelector('.notes-child');
const main = document.querySelector('.main');
const ideaText = document.querySelector('.idea-text');
const noteDiv = document.querySelector('.note-div');
const bin = document.querySelector('.i-p');
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal-title');
const modalText = document.querySelector('.modal-text');
const modalCloseButton = document.querySelector('.modal-close-button');
const colorPicker = document.querySelector('.color-picker');

const handleFormClick = e => {
	const isFormClicked = form.contains(e.target);
	const title = noteTitle.value;
	const text = noteText.value;
	const hasNote = title || text;
	
	if (isFormClicked) {
		openNoteTextEvents();
	} else if (hasNote) {
		addIdeas({ title, text });
	} else {
		closeNoteTextEvents();
	}
};

const openNoteTextEvents = () => {
	noteTitle.style.display = 'block';
	formButtons.style.display = 'block';
};

const closeNoteTextEvents = () => {	
	noteTitle.style.display = 'none';
	formButtons.style.display = 'none';
	noteTitle.value = '';
	noteText.value = '';
	noteText.style.height = '';
};

const openModal = e => {
	if (e.target.closest('.iGear')) {
		modal.classList.toggle('open-modal');
		modalTitle.value = title;
		modalText.value = text;
		modalText.style.resize = 'vertical';
	}
};

const autoGrow = e => {
  e.style.height = "5px";
  e.style.height = (e.scrollHeight)+"px";
	e.style.maxHeight = '300px';
};

const closeModal = e => {
	editIdea();
	modal.classList.toggle('open-modal');
	modalText.style.resize = 'none';
};

const addIdeas = ({ title, text }) => {
	const newIdea = {
		title,
		text,
		color: '#fff',
		id: ideas.length > 0 ? ideas[ideas.length - 1].id + 1 : 1
	};
	ideas = [...ideas, newIdea];
	render();
	closeNoteTextEvents();
}

const editIdea = () => {
	const title = modalTitle.value;
	const text = modalText.value;
	ideas = ideas.map(idea => idea.id === Number(id) ? {...idea, title, text} : idea);
	render();
};

const selectIdea = e => {
	const selectedIdea = e.target.closest('.iGear');
	if (!selectedIdea) return;
	const populate = selectedIdea.parentNode.parentNode.parentNode.children[1];
	//console.log(test.lastElementChild.innerHTML);
	title = populate.firstElementChild.innerHTML;
	text = populate.lastElementChild.innerHTML;
	id = selectedIdea.dataset.id;
};

const render = () => {
	saveNotes();
	displayNotes();
};

const saveNotes = () => {
	localStorage.setItem('ideas', JSON.stringify(ideas));
};

const displayNotes = () => {
	const hasIdea = ideas.length > 0;
	main.style.display = hasIdea ? 'none' : 'flex';
	notes.style.display = hasIdea ? 'flex' : 'none';
	
	notes.innerHTML = ideas.map(idea => `
		<div style="background: ${idea.color}" class="note-div" data-id="${idea.id}">
			<div style="background: ${idea.color}; border-radius: 10px" class="icons">
				<p class="i-p"><img class="i iGear" src="img/gear.svg" data-id="${idea.id}" alt="paint"></p>
				<p class="i-p"><img class="i iPaint" src="img/paint.svg" data-id="${idea.id}" alt="paint"></p>
				<p class="i-p"><img class="i iDelete" src="img/bin.svg" data-id="${idea.id}" alt="bin"></p>
			</div>
			<form style="background: ${idea.color}; border-radius: 10px">
			<h3 class="note-h3 single-line" placeholder="Title" role="textbox">${idea.title}</h3>
			<textarea style="background: ${idea.color}; border-radius: 10px" class="notes-child" readonly="true" placeholder="Click the gear icon to edit. . ." cols="40" rows="6">
${idea.text}</textarea>
</form>
</div>
	`).join('');
};

const deleteIdea = e => {
	e.stopPropagation();
	if (!e.target.matches('.iDelete')) return;
	const id = e.target.dataset.id;
	ideas = ideas.filter(note => note.id !== Number(id));
	render();
};

const openColorPicker = e => {
	e.stopPropagation();
	const selectedPaint = e.target.closest('.iPaint');
	if (!selectedPaint) return
	id = e.target.dataset.id;
	const coords = e.target.getBoundingClientRect();
	const horizontal = coords.left + window.scrollX;
	const vertical = coords.top + window.scrollY;
	colorPicker.style.transform = `translate(${horizontal}px, ${vertical}px)`;
	colorPicker.style.display = 'flex';
};

const closeColorPicker = e => {
	const bodyClick = !colorPicker.contains(e.target);
	const paintClick = !e.target.matches('.iPaint');
	if (bodyClick && paintClick) {
		colorPicker.style.display = 'none';
	}
};

const editNoteColor = color => {
	ideas = ideas.map(idea =>
		idea.id === Number(id) ? { ...idea, color } : idea
	);
	render();
};

colorPicker.addEventListener('click', e => {
	const color = e.target.dataset.color;
	if (color) {
		ideas = ideas.map(idea =>
		idea.id === Number(id) ? { ...idea, color } : idea
	);
	render();
	}
});

document.body.addEventListener('click', e => {
	handleFormClick(e);
	selectIdea(e);
	openModal(e);
	closeColorPicker(e);
	openColorPicker(e);
	deleteIdea(e);
});

noteText.addEventListener('keydown', () => {
	openNoteTextEvents();
});

formClose.addEventListener('click', e => {
	e.stopPropagation();
	closeNoteTextEvents();
});

modalCloseButton.addEventListener('click', e => {
	closeModal(e);
});

form.addEventListener('submit', e => {
	e.preventDefault();
	const title = noteTitle.value;
	const text = noteText.value;
	const hasNote = title || text;
	if (hasNote) {
		addIdeas({ title, text });
	}
});

render();