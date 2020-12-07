export default class TaskProgress {
    completed;

    current;

    levelsNumber;

    goToLevel;

    clearProgress;

    constructor(completed, current, levelsNumber, goToLevel, clearProgress, trainer) {
        this.goToLevel = goToLevel.bind(trainer);
        this.clearProgress = clearProgress.bind(trainer);
        this.completed = completed;
        this.current = current;
        this.levelsNumber = levelsNumber;
    }

    createTaskSection() {
        const taskSection = document.createElement('div');
        taskSection.classList.add('task-section');

        const taskSectionTitle = document.createElement('h2');
        taskSectionTitle.classList.add('task-section__title');
        taskSectionTitle.innerText = 'Уровни';

        const levelsSection = document.createElement('div');
        levelsSection.classList.add('task-section__levels');

        for (let i = 1; i <= this.levelsNumber; i += 1) {
            const level = document.createElement('div');
            level.classList.add('level');
            level.addEventListener('click', () => this.goToLevel(i));

            const levelTick = document.createElement('div');
            levelTick.classList.add('level__tick');
            levelTick.innerHTML = '&#x2714;';

            if (this.current === i - 1) {
                levelTick.classList.add('selected');
            }

            if (this.completed.find((item) => item.level === i - 1)) {
                levelTick.classList.add('completed');
            }

            if (this.completed.find((item) => item.level === i - 1 && item.withHelp)) {
                levelTick.classList.add('withHelp');
            }

            const levelTitle = document.createElement('div');
            levelTitle.classList.add('level__title');
            levelTitle.innerText = `${i}`;

            level.appendChild(levelTick);
            level.appendChild(levelTitle);

            levelsSection.appendChild(level);
        }

        const taskSectionButton = document.createElement('button');
        taskSectionButton.classList.add('task-section__button');
        taskSectionButton.innerText = 'СБРОСИТЬ ПРОГРЕСС';

        taskSectionButton.addEventListener('click', this.clearProgress);

        taskSection.appendChild(taskSectionTitle);
        taskSection.appendChild(levelsSection);
        taskSection.appendChild(taskSectionButton);

        return taskSection;
    }
}
