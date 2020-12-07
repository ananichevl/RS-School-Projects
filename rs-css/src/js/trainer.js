import Level from './level';
import TaskProgress from './taskProgress';
import star from '../assets/Star3.png';
import logo from '../assets/rs_school_js.png';

export default class Trainer {
    levels;

    currentLevel;

    completedLevels;

    level;

    trainerWrapper;

    mainContent;

    mainSection;

    taskSection;

    constructor(levels) {
        this.levels = levels;
        this.currentLevel = localStorage.getItem('currentLevel')
            ? parseInt(localStorage.getItem('currentLevel'), 10)
            : 0;
        this.completedLevels = localStorage.getItem('completedLevels')
            ? JSON.parse(localStorage.getItem('completedLevels'))
            : [];
    }

    createElement() {
        this.trainerWrapper = document.createElement('div');
        this.trainerWrapper.classList.add('trainer-wrapper');

        const header = document.createElement('header');
        header.classList.add('trainer-header');

        const headerLogo = document.createElement('img');
        headerLogo.classList.add('trainer-header__logo');
        headerLogo.src = star;

        const headerTitle = document.createElement('h3');
        headerTitle.classList.add('trainer-header__title');
        headerTitle.innerText = 'CSS SPACE';

        header.appendChild(headerLogo);
        header.appendChild(headerTitle);

        this.trainerWrapper.appendChild(header);

        this.mainContent = document.createElement('div');
        this.mainContent.classList.add('content-section');
        this.createLevelAndTaskProgress();

        this.trainerWrapper.appendChild(this.mainContent);

        const footer = document.createElement('footer');
        footer.classList.add('trainer-footer');

        const footerTitle = document.createElement('div');
        footerTitle.classList.add('trainer-footer__title');
        footerTitle.innerText = 'По вопросам и предложениям — @ananichevl';

        footerTitle.addEventListener('click', () => {
            window.location.href = 'https://github.com/ananichevl';
        });

        const footerLogo = document.createElement('img');
        footerLogo.classList.add('trainer-footer__logo');
        footerLogo.src = logo;

        footerLogo.addEventListener('click', () => {
            window.location.href = 'https://rs.school/js/';
        });

        footer.appendChild(footerTitle);
        footer.appendChild(footerLogo);

        this.trainerWrapper.appendChild(footer);

        return this.trainerWrapper;
    }

    createLevelAndTaskProgress() {
        this.level = new Level(this.goNextLevel, this, this.levels[this.currentLevel]);
        const taskProgress = new TaskProgress(
            this.completedLevels,
            this.currentLevel,
            this.levels.length,
            this.goToLevel,
            this.clearProgress,
            this,
        );
        this.mainSection = this.level.createMainSection();
        this.taskSection = taskProgress.createTaskSection();

        this.mainContent.appendChild(this.mainSection);
        this.mainContent.appendChild(this.taskSection);
    }

    clearLevelAndTaskProgress() {
        this.mainContent.removeChild(this.mainSection);
        this.mainContent.removeChild(this.taskSection);
    }

    goNextLevel(withHelp) {
        this.updateCompleted(withHelp);

        if (this.currentLevel + 1 === this.levels.length) {
            console.log('WIN');
            this.level.handleWin();
        } else {
            this.changeCurrentLevel(this.currentLevel + 1);

            this.clearLevelAndTaskProgress();
            this.createLevelAndTaskProgress();
        }
    }

    goToLevel(number) {
        this.clearLevelAndTaskProgress();
        this.changeCurrentLevel(number - 1);

        this.createLevelAndTaskProgress();
    }

    changeCurrentLevel(number) {
        this.currentLevel = number;
        localStorage.setItem('currentLevel', this.currentLevel);
    }

    updateCompleted(withHelp) {
        this.completedLevels.push({
            level: this.currentLevel,
            withHelp,
        });
        localStorage.setItem('completedLevels', JSON.stringify(this.completedLevels));
    }

    clearProgress() {
        this.changeCurrentLevel(0);
        this.completedLevels = [];
        localStorage.setItem('completedLevels', JSON.stringify(this.completedLevels));

        this.clearLevelAndTaskProgress();
        this.createLevelAndTaskProgress();
    }
}
