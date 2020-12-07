import Input from './input';
import Viewer from './htmlViewer';
import soundFile from '../assets/error.wav';

const sound = new Audio(soundFile);

export default class Level {
    goNextLevel;

    trainer;

    level;

    gameSection;

    input;

    game;

    withHelp;

    constructor(goNextLevel, trainer, level) {
        this.goNextLevel = goNextLevel.bind(trainer);
        this.trainer = trainer;
        this.level = level;
    }

    createMainSection() {
        const mainSection = document.createElement('div');
        mainSection.classList.add('main-section');

        this.gameSection = document.createElement('div');
        this.gameSection.classList.add('main-section__game');

        const shortTask = document.createElement('h2');
        shortTask.classList.add('game__short-task');
        shortTask.innerText = this.level.title;

        this.game = document.createElement('div');
        this.game.classList.add('game__playing-field');

        this.game.innerHTML = this.level.markup;

        const toolTip = document.createElement('div');
        toolTip.classList.add('game__tooltip');
        toolTip.innerText = '<planet></planet>';

        const helpButton = document.createElement('button');
        helpButton.classList.add('game__help-button');
        helpButton.innerText = 'ПОМОЩЬ';

        this.gameSection.appendChild(shortTask);
        this.gameSection.appendChild(this.game);
        this.gameSection.appendChild(toolTip);
        this.gameSection.appendChild(helpButton);

        const gameElems = this.game.querySelectorAll('*');

        const editor = document.createElement('div');
        editor.classList.add('main-section__editor');

        const editorTitle = document.createElement('h3');
        editorTitle.classList.add('editor__title');
        editorTitle.innerText = 'CSS Editor';

        const viewerTitle = document.createElement('h3');
        viewerTitle.classList.add('viewer__title');
        viewerTitle.innerText = 'HTML Viewer';

        editor.appendChild(editorTitle);

        this.input = new Input(this.handleEnterClick, this);
        editor.appendChild(this.input.createElement());
        this.input.createCodeMirrorInput();

        editor.appendChild(viewerTitle);

        const viewer = new Viewer(this.level.markup, gameElems, toolTip);
        editor.appendChild(viewer.createElement());
        viewer.createCodeMirrorViewer();
        mainSection.appendChild(this.gameSection);
        mainSection.appendChild(editor);

        const selection = this.game.querySelectorAll(this.level.selector);
        selection.forEach((s) => {
            s.classList.add('selection-animation');
        });

        gameElems.forEach((s, i) => {
            const lines = Viewer.calculateLine(this.level.markup);

            s.addEventListener('mouseout', () => {
                s.classList.remove('hover');
                viewer.unMarkLines(lines[i]);
            });

            s.addEventListener('mouseover', (e) => {
                if (e.target === s) {
                    s.classList.add('hover');
                    viewer.markLines(lines[i]);
                }
            });
        });

        helpButton.addEventListener('click', () => {
            this.withHelp = true;
            // TODO clear input
            const interval = setInterval(() => {
                const inputLength = this.input.inputGetValue().length
                    ? this.input.inputGetValue().length
                    : 0;
                if (this.input.inputGetValue() !== this.level.selector) {
                    const sliceLength = inputLength - this.level.selector.length + 1;
                    if (sliceLength === 0) {
                        this.input.inputSetValue(this.level.selector);
                    } else {
                        this.input.inputSetValue(this.level.selector
                            .slice(0, inputLength - this.level.selector.length + 1));
                    }
                } else {
                    clearInterval(interval);
                }
            }, 200);
        });

        return mainSection;
    }

    handleEnterClick(e) {
        try {
            const expectedSelection = this.game.querySelectorAll(this.level.selector);
            const actualSelection = this.game.querySelectorAll(e.getValue());

            if (Level.nodeListsAreEqual(actualSelection, expectedSelection)) {
                expectedSelection.forEach((elem) => {
                    elem.classList.remove('selection-animation');
                    elem.classList.add('correct-animation');
                });
                setTimeout(() => this.goNextLevel(this.withHelp), 1200);
            } else {
                Level.playSound();
                this.input.highlightInputLine();
            }
        } catch (exp) {
            Level.playSound();
            this.input.highlightInputLine();
        }
    }

    handleWin() {
        this.gameSection.innerHTML = '';
        const winTitle = document.createElement('h1');
        winTitle.classList.add('game__win-title');
        winTitle.innerHTML = '<span>Поздравляю!</span><span>Это конец!</span>';

        this.gameSection.appendChild(winTitle);
    }

    static nodeListsAreEqual(list1, list2) {
        if (list1.length !== list2.length) {
            return false;
        }
        return Array.from(list1).every((node, index) => node === list2[index]);
    }

    static playSound() {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    }
}
