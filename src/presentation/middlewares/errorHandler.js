const errorHandler = (err, req, res, next) =>
{
  if (err?.message.includes('not found'))
  {
    req.logger.error(err.stack);
    return res.status(404).json({ message: err.message });
  }
  else if (err?.name.includes('ZodError'))
  {
    req.logger.error(err.stack);
    return res.status(400).json({ message: err.issues });
  }
  else if (err?.message.includes('Login failed, invalid password.'))
  {
    req.logger.error(err.stack);
    return res.status(401).send({ message: 'Login failed, invalid password.'})
  }
  else if (err?.message.includes('Email and Password invalid format.'))
  {
    req.logger.error(err.stack);
    return res.status(401).send({ message: 'Email and Password invalid format.'})
  }
  else if (err?.message.includes('dont exist'))
  {
      req.logger.error(err.stack);
      return res.status(404).send({ message: 'Login failed, user dont exist.' });
  }

    req.logger.error(err.stack);
	res.status(500).json({ message: 'Ocurrió un error' });
};

export default errorHandler;