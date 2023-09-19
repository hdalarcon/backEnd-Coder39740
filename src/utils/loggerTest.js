import winston from 'winston';

const levelOptions =
{
    level:
    {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
};


const loggerTest = winston.createLogger({
    levels: levelOptions.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: './logs.log', level: 'debug' })
    ]
});

export const addLoggerTest = (req, res, next) =>
{
    req.loggerTest = loggerTest;
    req.loggerTest.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};
