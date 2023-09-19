import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config();

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
    },
    color:
    {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'magenta'
    }
};

const developmentLogger = winston.createLogger({
    levels: levelOptions.level,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                    colors: Object.fromEntries(
                        Object.entries(levelOptions.color).map(([level, color]) => [level.toUpperCase(), color])
                    )
                }),
                winston.format.simple()
            )
        })
    ]
});

const productionLogger = winston.createLogger({
    levels: levelOptions.level,
    transports: [
        new winston.transports.File({
            filename: './errors.log',
            level: 'info'
        })
    ]
});


const logger = process.env.NODE_ENV === 'development' ? developmentLogger : productionLogger;

export const addLogger = (req, res, next) =>
{
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};
