

const server = require('./modules/server');
const dataset = require('./modules/dataset');

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection:', p, 'reason:', reason);
});

dataset.then(() => {

    // стартуем http-сервер только после установки связи с базой
    try {
        server.start();
    } catch(err){
        console.error("Server error:", err);
    }

});