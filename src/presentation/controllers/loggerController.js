export const getLogger = async(req, res, next) =>
{
    try
    {
        req.loggerTest.fatal('Esto es un mensaje de error fatal');
        req.loggerTest.error('Esto es un mensaje de error');
        req.loggerTest.warning('Esto es un mensaje de advertencia');
        req.loggerTest.info('Esto es un mensaje informativo');
        req.loggerTest.http('Esto es un mensaje detallado');
        req.loggerTest.debug('Esto es un mensaje de depuración');

        res.send({ message: 'Logs generados en la consola y guardados en logs.log' });
    }
    catch (e)
    {
        next(e);
    }
};
