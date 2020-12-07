import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/display/placeholder';
import 'codemirror/mode/css/css';

export default class Input {
    handleEnterClick;

    input;

    editorInput;

    editorButton;

    inputLine;

    constructor(handleEnterClick, level) {
        this.handleEnterClick = handleEnterClick.bind(level);
    }

    createElement() {
        const editorSection = document.createElement('div');
        editorSection.classList.add('editor__section');

        this.editorInput = document.createElement('textarea');
        this.editorInput.classList.add('editor__section-input');
        this.editorInput.placeholder = 'Type in a CSS Selector';
        this.editorInput.rows = 1;

        this.editorButton = document.createElement('button');
        this.editorButton.classList.add('editor__section-button');
        this.editorButton.innerText = 'ENTER';

        editorSection.appendChild(this.editorInput);
        editorSection.appendChild(this.editorButton);

        return editorSection;
    }

    createCodeMirrorInput() {
        const self = this;

        this.input = CodeMirror.fromTextArea(this.editorInput, {
            lineNumbers: true, // Нумеровать каждую строчку.
            autoRefresh: true,
            matchBrackets: true,
            mode: 'css',
            indentUnit: 2, // Длина отступа в пробелах.
            indentWithTabs: true,
            enterMode: 'keep',
            tabMode: 'shift',
            extraKeys: {
                Enter: (e) => self.handleEnterClick(e),
            },
        });

        setTimeout(() => {
            this.input.refresh();
        }, 500);

        this.editorButton.addEventListener('click', () => {
            this.handleEnterClick(this.input);
        });
    }

    inputGetValue() {
        return this.input.getValue();
    }

    inputSetValue(value) {
        return this.input.setValue(value);
    }

    highlightInputLine() {
        [this.inputLine] = this.input.getWrapperElement()
            .querySelectorAll('pre.CodeMirror-line');
        this.inputLine.classList.add('error-animation');
        setTimeout(
            () => this.inputLine.classList.remove('error-animation'),
            1000,
        );
    }
}
