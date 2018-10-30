
global.CONST = {};

CONST.UserStatus = {
    OFFLINE:            0,
    FREE:               1,
    LOBBY:              2,
    PLAYING:            3,
};

CONST.SessionStatus = {
    WAITING:            0,      // ожидание набора игроков
    PREPARING:          1,      // игроки набраны, ждем таймаут несколько секунд и начинаем играть
    GAME:               2,      // игра
    ENDED:              3,      // игра завершена успешно
    BREAK:              4,      // игра сломана (произошла ошибка или один из игроков покинул игру
};

