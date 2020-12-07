import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/display/placeholder';
import 'codemirror/mode/htmlmixed/htmlmixed';

export default class Viewer {
    markup;

    gameElems;

    toolTip;

    viewer;

    codeViewer;

    codeMirrorLines;

    constructor(markup, gameElems, toolTip) {
        this.markup = markup;
        this.gameElems = gameElems;
        this.toolTip = toolTip;
    }

    createElement() {
        this.viewer = document.createElement('textarea');
        this.viewer.classList.add('viewer');
        this.viewer.innerHTML = this.markup;

        return this.viewer;
    }

    createCodeMirrorViewer() {
        this.codeViewer = CodeMirror.fromTextArea(this.viewer, {
            lineNumbers: true, // Нумеровать каждую строчку.
            autoRefresh: true,
            matchBrackets: true,
            mode: 'htmlmixed',
            indentUnit: 2, // Длина отступа в пробелах.
            indentWithTabs: true,
            enterMode: 'keep',
            tabMode: 'shift',
            lineSeparator: '\n',
        });

        setTimeout(() => {
            this.codeViewer.refresh();

            const wrapper = this.codeViewer.getWrapperElement();

            this.codeMirrorLines = wrapper.querySelectorAll('pre.CodeMirror-line');

            const lines = Viewer.calculateLine(this.markup);

            lines.forEach((l, index) => {
                if (l.start === l.end) {
                    const cmLine = this.codeMirrorLines[l.start];
                    this.addHoverEvents(cmLine, index, l);
                } else {
                    const cmLineStart = this.codeMirrorLines[l.start];
                    this.addHoverEvents(cmLineStart, index, l);

                    const cmLineEnd = this.codeMirrorLines[l.end];
                    this.addHoverEvents(cmLineEnd, index, l);
                }
            });
        }, 500);
    }

    addHoverEvents(cmLine, index, line) {
        cmLine.addEventListener('mouseleave',
            () => this.unHoverElemAndCMLines(
                this.gameElems[index],
                line,
            ));

        cmLine.addEventListener('mouseenter',
            () => this.hoverElemAndCMLines(
                this.gameElems[index],
                line,
            ));
    }

    hoverElemAndCMLines(elem, line) {
        this.markLines(line);
        elem.classList.add('hover');

        const elemLeft = elem.getBoundingClientRect().left;
        const elemTop = elem.getBoundingClientRect().top;

        this.toolTip.style.visibility = 'visible';
        this.toolTip.style.left = `${elemLeft + 15}px`;
        this.toolTip.style.top = `${elemTop + 15}px`;
        this.toolTip.innerText = this.getCodeMirrorLines(line);
    }

    unHoverElemAndCMLines(elem, line) {
        this.unMarkLines(line);
        elem.classList.remove('hover');
        this.toolTip.style.visibility = 'hidden';
    }

    markLines(line) {
        [...this.codeMirrorLines].slice(line.start, line.end + 1).forEach((cmL) => {
            cmL.querySelectorAll('span').forEach((e) => {
                e.classList.add('selected-line');
            });
        });
    }

    unMarkLines(line) {
        [...this.codeMirrorLines].slice(line.start, line.end + 1).forEach((cmL) => {
            cmL.querySelectorAll('span').forEach((e) => {
                e.classList.remove('selected-line');
            });
        });
    }

    getCodeMirrorLines(line) {
        return this.codeViewer.getRange({
            line: line.start,
            ch: 0,
        }, {
            line: line.end + 1,
            ch: 0,
        });
    }

    static calculateLine(text) {
        const arr = text.split('\n');
        const starts = [];
        const res = [];

        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].match('<[a-z]')) {
                starts.push(i);
            }

            if (arr[i].match('</[a-z]')) {
                res.push({
                    start: starts.pop(), end: i,
                });
            }
        }

        return res.sort((x, y) => x.start - y.start);
    }
}
