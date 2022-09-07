const TelegramApi = require('node-telegram-bot-api');

const token = '5737427687:AAERsNNSHNsqJjrSmUtL2x-YAXnba49Utv0';

const bot = new TelegramApi(token, { polling: true });

const questions = [
    "\u{2753} Какую часть шаблона проектирования MVC реализует React.js?",
    "\u{2753} Какой шаблонизатор можно использовать в React?",
    "\u{2753} Перерисовывает ли React всё view когда изминелись props или состояние?",
    "\u{2753} Какой метод компонента следует использовать для кастомной логики для реагирования на изменения?",
    "\u{2753} Что можно передать как второй аргумент в метод setState?"
];

var result = 0;

const answers = [
    [
        { text: "React - это полноценный MVC-фреймворк", validate: false },
        { text: "React предназначен для работы с view частью", validate: true },
        { text: "React является «контроллером» с точки зрения MVC", validate: false },
    ],
    [
        { text: "HBS", validate: false },
        { text: "EJS", validate: false },
        { text: "XML", validate: false },
        { text: "В React вы не должны использовать какой-либо шаблонизатор. Для рендеринга HTML используется JSX (расширение синтаксиса JS).", validate: true }
    ],
    [
        { text: "Да. React.js распространяет событие на все дерево компонентов, и они вызывают метод render.", validate: false },
        { text: "Нет. React только повторно рендерит только измененный компонент.", validate: true },
    ],
    [
        { text: "shouldComponentUpdate", validate: false },
        { text: "getSnapshotBeforeUpdate", validate: false },
        { text: "componentWillUpdate", validate: true },
        { text: "componentWillMount", validate: false },
    ],
    [
        { text: "Cвойства, которые должны быть обновлены", validate: false },
        { text: "Функцую обратного вызова для получения нового состояния", validate: false },
        { text: "Предыдущее состояние", validate: true },
    ]
];
var indexQuest = 0;

const startTest = async (chatId, right) => {
    if (right) {
        await bot.sendMessage(chatId, "Верно");
    }
    await bot.sendMessage(chatId, questions[indexQuest]);

    var answersForQuestions = [];
    answers[indexQuest].map((a) => {
        answersForQuestions.push([
            { text: a.text, callback_data: a.validate.toString() },
        ]);
    });

    const gameOptions = {
        reply_markup: JSON.stringify({
            inline_keyboard: answersForQuestions,
        }),
    };
    return await bot.sendMessage(chatId, "Выберите ответ", gameOptions);
};

const start = async () => {
    bot.setMyCommands([
        { command: "/start", description: "Начальное приветствие" },
        { command: "/info", description: "Получить информацию о пользователе" },
        { command: "/testing", description: "Тестирование по дисциплинам" },
    ]);

    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === "/start") {
                return bot.sendMessage(
                    chatId,
                    `Добро пожаловать в бот, который тестирует ваши знания по React`
                );
            }
            if (text === "/info") {
                return bot.sendMessage(
                    chatId,
                    `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
                );
            }
            if (text === "/testing") {
                return startTest(chatId, indexQuest);
            }
            return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
        } catch (e) {
            return bot.sendMessage(chatId, `Произошла ошибка ${e}`);
        }
    });

    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (indexQuest + 1 < questions.length) {
            indexQuest += 1;
            if (data === "true") {
                result += 1;
                return startTest(chatId, true);
            } else {
                return startTest(chatId);
            }
        } else {
            await bot.sendMessage(chatId, `\u{2714} Вы ответили верно на ${result} вопросов из ${questions.length}`);
            indexQuest = 0;
        }
    });
};

start();