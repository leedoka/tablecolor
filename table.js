let currentColor = '';

AColorPicker.createPicker('div.color-container').on('change', (picker, color) => {
    const parsedColor = AColorPicker.parseColor(color, 'hex');
    currentColor = parsedColor;
});

function generateID () {
    return 'color-' + Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
}

let mode = '';
let editId = '';

let addColorButton = document.querySelector('.button-2');
let paletteButton = document.querySelector('.button');
let palette = document.querySelector('.frame-2');
let trashButtons;
let pencilButtons;
let tableColor = document.querySelector('tbody');
let hexField = document.querySelector('.a-color-picker-single-input>input');
let nameColorField = document.querySelector('.field');
let chooseType = document.querySelector('.field-2');
let header2 = document.querySelector('.h2');
let buttonSave = document.querySelector('.button-2');

let colorsArray = localStorage.getItem("colorsArray");

if (colorsArray) {
    colorsArray = JSON.parse(colorsArray);
    for (const color of colorsArray) {
        color.id = generateID();
        newRowColor(color);  
    }

} else {
    localStorage.setItem("colorsArray", "[]");
}

function deleteColor (id) {
    let row = document.getElementById(id);
    if (row) {
        tableColor.removeChild(row);
    }
    const colorIndex = colorsArray.findIndex(color => color.id === id);
    if (colorIndex > -1) {
        colorsArray.splice(colorIndex, 1);
    }
    localStorage.setItem('colorsArray', JSON.stringify(colorsArray));
}

function changeModeInterface () {
    if (mode === 'edit') {
        header2.textContent = 'Изменение цвета';
        buttonSave.textContent = 'Сохранить';
    } else {
        header2.textContent = 'Добавление цвета';
        buttonSave.textContent = 'Добавить';
    }
}

function editColor (id) {
    editId = id;
    const color = colorsArray.find(color => color.id === id);

    hexField.value = color.color;
    nameColorField.value = color.name;
    chooseType.value = color.type;
    currentColor = color.color;

    const container = document.querySelector('.main-1');
    const palettePicker = document.querySelector('.color-container');
    if (palettePicker) {
        container.removeChild(palettePicker);
        const newContainer = document.createElement('div');
        newContainer.classList.add('color-container');
        container.appendChild(newContainer);
    }

    AColorPicker.createPicker('div.color-container', {
        color: color.color
    }).on('change', (picker, color) => {
        const parsedColor = AColorPicker.parseColor(color, 'hex');
        currentColor = parsedColor;
    });

    palette.classList.remove('hidden');
}

function clearPalette () {
    palette.classList.add('hidden');
    nameColorField.value = '';
    chooseType.value = 'main';
    hexField.value = '';
    currentColor = '';
}

addColorButton.onclick = function () {
    let objectValues = {
        name: nameColorField.value,
        type: chooseType.value,
        color: currentColor
    };

    if (mode === 'edit') {
        const colorIndex = colorsArray.findIndex(color => color.id === editId);
        colorsArray[colorIndex].name = objectValues.name;
        colorsArray[colorIndex].type = objectValues.type;
        colorsArray[colorIndex].color = objectValues.color;
        localStorage.setItem('colorsArray', JSON.stringify(colorsArray));

        const colorRow = document.getElementById(editId);

        const firstTD = colorRow.querySelector('.first-column');
        const colorSquare = firstTD.querySelector('.color-square');
        const colorName = colorRow.querySelector('.color-name');
        const colorType = colorRow.querySelector('.type-td');
        const colorHEX = colorRow.querySelector('.code-td');

        colorSquare.style.backgroundColor = objectValues.color;
        colorName.textContent = objectValues.name;
        colorType.textContent = objectValues.type;
        colorHEX.textContent = objectValues.color;
    } else {
        objectValues.id = generateID();
    
        colorsArray.push(objectValues);
        localStorage.setItem('colorsArray', JSON.stringify(colorsArray));
        newRowColor(objectValues);
    }
    clearPalette();
}

function newRowColor (objectValues) {
    let newRow = document.createElement('tr');
    newRow.id = objectValues.id;

    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');

    let newColorSquare = document.createElement('div');
    newColorSquare.classList.add("color-square");
    newColorSquare.style.backgroundColor = objectValues.color;
    td1.classList.add('first-column');
    td1.classList.add('center');

    td1.appendChild(newColorSquare);

    let newPencil = document.createElement('i');
    newPencil.classList.add("fa-pencil");
    newPencil.classList.add("fa-solid");
    newPencil.classList.add("center");
    newPencil.id = objectValues.id;
    td5.classList.add("center");

    td2.classList.add("color-name");

    td3.classList.add("type-code");
    td3.classList.add("type-td");

    td4.classList.add("type-code");
    td4.classList.add("code-td");

    td5.appendChild(newPencil);

    let newTrash = document.createElement('i');
    newTrash.classList.add("fa-trash");
    newTrash.classList.add("fa-solid");
    newTrash.classList.add("center");
    newTrash.id = objectValues.id;
    
    td6.classList.add("center");

    td6.appendChild(newTrash);

    td2.textContent = objectValues.name;
    td3.textContent = objectValues.type;
    td4.textContent = objectValues.color;

    newRow.appendChild(td1);
    newRow.appendChild(td2);
    newRow.appendChild(td3);
    newRow.appendChild(td4);
    newRow.appendChild(td5);
    newRow.appendChild(td6);

    tableColor.appendChild(newRow);

    pencilButtons = document.querySelectorAll('.fa-pencil');
    pencilButtons.forEach((pencilButton) => {
        pencilButton.addEventListener('click', (event) => {
            mode = 'edit';
            changeModeInterface();
            editColor(event.target.id);
        })
    })

    trashButtons = document.querySelectorAll('.fa-trash');
    trashButtons.forEach((trashButton) => {
        trashButton.addEventListener('click', (event) => {
            deleteColor(event.target.id);
        })
    })
}

paletteButton.onclick = function () {
    mode = 'add';
    changeModeInterface();
    palette.classList.remove("hidden");
}
