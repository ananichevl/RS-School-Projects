const keyboardInput = document.querySelector(".use-keyboard-input");
let fullKeyboard;
const digitSymbols = {
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '[': '{',
    ']': '}',
    ',': '<',
    '.': '>',
    '/': '?',
    ';': ':',
    "'": '"',
    '\\': '|'
};

const alphabetSymbols = {
    'q': 'й',
    'w': 'ц',
    'e': 'у',
    'r': 'к',
    't': 'е',
    'y': 'н',
    'u': 'г',
    'i': 'ш',
    'o': 'щ',
    'p': 'з',
    '[': 'х',
    ']': 'ъ',
    'a': 'ф',
    's': 'ы',
    'd': 'в',
    'f': 'а',
    'g': 'п',
    'h': 'р',
    'j': 'о',
    'k': 'л',
    'l': 'д',
    ';': 'ж',
    "'": 'э',
    '\\': 'ё',
    'z': 'я',
    'x': 'ч',
    'c': 'с',
    'v': 'м',
    'b': 'и',
    'n': 'т',
    'm': 'ь',
    ',': 'б',
    '.': 'ю',
    '/': '/',
    '{': 'Х',
    '}': 'Ъ',
    ':': 'Ж',
    '"': 'Э',
    '|': 'Ё',
    '<': 'Б',
    '>': 'Ю',
};

class Keyboard {
    elements = {
        main: null,
        keysContainer: null,
        keys: []
    };

    input = '';
    capsLock = false;
    shift = false;
    language = 'en';

    constructor() {
        this.elements.main = document.createElement("div");
        let keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        keysContainer.classList.add("keyboard__keys");
        keysContainer.appendChild(this.createKeys());

        this.elements.keys = keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open();
            });
        });
    };

    createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "en", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\\", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "done",
            "space", "left", "right"
        ];

        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("span");
            const insertLineBreak = ["backspace", "]", "enter", "done"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        let position = keyboardInput.selectionStart;
                        this.input = [this.input.substring(0, position - 1), this.input.substring(position)].join('');
                        keyboardInput.value = this.input;
                        keyboardInput.focus();
                        keyboardInput.selectionEnd = position - 1;
                    });
                    break;
                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");

                    keyElement.addEventListener("click", () => {
                        this.handleCapsLockClick();
                        keyElement.classList.toggle("keyboard__key--active", this.capsLock);
                        keyboardInput.focus();
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.addEventListener("click", () => {
                        let position = keyboardInput.selectionStart;
                        this.input = [this.input.slice(0, position), '\n', this.input.slice(position)].join('');
                        keyboardInput.value = this.input;
                        keyboardInput.focus();
                        keyboardInput.selectionEnd = position + 1;
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.addEventListener("click", () => {
                        let position = keyboardInput.selectionStart;
                        this.input = [this.input.slice(0, position), ' ', this.input.slice(position)].join('');
                        keyboardInput.value = this.input;
                        keyboardInput.focus();
                        keyboardInput.selectionEnd = position + 1;
                    });
                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.addEventListener("click", () => {
                        this.close();
                        keyboardInput.focus();
                    });
                    break;
                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.addEventListener("click", () => {
                        this.handleShiftClick();
                        keyElement.classList.toggle("keyboard__key--active", this.shift);
                        keyboardInput.focus();
                    });

                    break;
                case "en":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.addEventListener("click", () => {
                        this.handleEnClick();
                        keyboardInput.focus();
                    });

                    break;
                case "left":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.addEventListener("click", () => {
                        keyboardInput.focus();
                        keyboardInput.selectionEnd = keyboardInput.selectionEnd - 1;
                    });
                    break;
                case "right":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.addEventListener("click", () => {
                        keyboardInput.focus();
                        keyboardInput.selectionStart = keyboardInput.selectionStart + 1;
                    });
                    break;
                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        let position = keyboardInput.selectionStart;

                        if (Object.keys(alphabetSymbols).includes(key)) {
                            if (this.language === 'en') {
                                if (key.match('[a-zA-Z]')) {
                                    let addition = this.capsLock ^ this.shift ? key.toUpperCase() : key.toLowerCase();
                                    this.input = [this.input.slice(0, position), addition, this.input.slice(position)].join('');
                                } else {
                                    let addition = this.shift ? digitSymbols[key] : key;
                                    this.input = [this.input.slice(0, position), addition, this.input.slice(position)].join('');
                                }
                            } else {
                                let addition = this.capsLock ^ this.shift ? alphabetSymbols[key.toLowerCase()].toUpperCase() : alphabetSymbols[key.toLowerCase()].toLowerCase();
                                this.input = [this.input.slice(0, position), addition, this.input.slice(position)].join('');
                            }
                        } else {
                            let addition = this.shift ? digitSymbols[key] : key;
                            this.input = [this.input.slice(0, position), addition, this.input.slice(position)].join('');
                        }
                        keyboardInput.value = this.input;
                        keyboardInput.focus();
                        keyboardInput.selectionEnd = position + 1;
                    });
                    break;
            }

            keyElement.textContent = key.toLowerCase();

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    }

    open() {
        this.elements.main.classList.remove("keyboard--hidden");
    }

    close() {
        this.elements.main.classList.add("keyboard--hidden");
    }

    handleCapsLockClick() {
        this.capsLock = !this.capsLock;
        this.elements.keys.forEach(key => {
            if (key.textContent.match('[a-zA-Zа-яА-ЯёЁ]') && key.textContent.length === 1) {
                key.textContent = this.capsLock ^ this.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        });
    }

    handleShiftClick() {
        this.shift = !this.shift;
        this.elements.keys.forEach(key => {
            if (key.textContent.match('[a-zA-Zа-яА-ЯёЁ]') && key.textContent.length === 1) {
                key.textContent = this.capsLock ^ this.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }

            Object.entries(digitSymbols).forEach(entry => {
                if (entry[0] === key.textContent) {
                    key.textContent = entry[1];
                } else if (entry[1] === key.textContent) {
                    key.textContent = entry[0];
                }
            });
        });
    }

    handleEnClick() {
        if (this.language === 'en') {
            this.language = 'ru';
        } else {
            this.language = 'en';
        }

        this.elements.keys.forEach(key => {
            if (key.textContent === 'en' || key.textContent === 'ru') {
                key.textContent = this.language;
            }

            Object.entries(alphabetSymbols).forEach(entry => {
                if (entry[0] === key.textContent.toLowerCase()) {
                    key.textContent = this.capsLock ^ this.shift ? entry[1].toUpperCase() : entry[1].toLowerCase();
                } else if (entry[1] === key.textContent.toLowerCase()) {
                    key.textContent = this.capsLock ^ this.shift ? entry[0].toUpperCase() : entry[0].toLowerCase();
                }
            });
        });
    }
}

window.addEventListener("DOMContentLoaded", function () {
    fullKeyboard = new Keyboard();
});

keyboardInput.addEventListener('input', function () {
    fullKeyboard.input = keyboardInput.value;
});

window.addEventListener("keypress", function (e) {
    keyboardInput.focus();
    console.log(e);
    fullKeyboard.elements.keys.forEach(key => {
        if (key.textContent.toLowerCase() === e.key.toLowerCase() || key.textContent === e.code.toLowerCase()) {
            key.classList.add("keyboard__key-lightup");
            setTimeout(function () {
                key.classList.remove("keyboard__key-lightup");
            }, 200);
        }
    });
});

window.addEventListener("keydown", function (e) {
    if (e.key === 'Shift') {
        fullKeyboard.handleShiftClick();
        fullKeyboard.elements.keys.forEach(key => {
            if (key.textContent === 'shift') {
                key.classList.toggle("keyboard__key--active", this.shift);
            }
        })
    }

    if (e.key === 'Backspace') {
        fullKeyboard.elements.keys.forEach(key => {
            if (key.textContent === 'backspace') {
                key.classList.add("keyboard__key-lightup");
                setTimeout(function () {
                    key.classList.remove("keyboard__key-lightup");
                }, 200);
            }
        });
    }

    if (e.key === 'CapsLock') {
        fullKeyboard.handleCapsLockClick();
        fullKeyboard.elements.keys.forEach(key => {
            if (key.textContent === 'caps') {
                key.classList.add("keyboard__key--active", fullKeyboard.capsLock);
            }
        });
    }
});

window.addEventListener("keyup", function (e) {
    if (e.key === 'CapsLock') {
        fullKeyboard.handleCapsLockClick();
        fullKeyboard.elements.keys.forEach(key => {
            if (key.textContent === 'caps') {
                key.classList.remove("keyboard__key--active", fullKeyboard.capsLock);
            }
        });
    }
});