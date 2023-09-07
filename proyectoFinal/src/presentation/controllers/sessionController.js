import SessionManager from "../../domain/manager/sessionManager.js";
import loginValidation from "../../domain/validations/session/loginValidation.js";
import jwt from 'jsonwebtoken';

export const login = async  (req, res, next) =>
{
  try {
    const { email, password } = req.body;

    await loginValidation.parseAsync(req.body);

    const manager = new SessionManager();
    const accessToken = await manager.login(email, password);

    res.cookie('accessToken', accessToken, {
      maxAge: 60*60*1000,
      httpOnly: true
    }).send({ message: 'Login success!' })
  } catch (error) {
    next(error);
  }
};

export const current = async  (req, res, next) =>
{
  try {
    res.status(200).send({ status: 'Success', payload: req.user });
  } catch (error) {
    next(error);
  }
};

export const logout = async(req, res, next) =>
{
    try
    {
      console.log('req.headers.cookie ',req.headers.cookie);
        const token = req.headers.cookie;

        const tokenAccess = token.split('=')[1];

        jwt.verify(tokenAccess, process.env.PRIVATE_KEY, async(error, credentials) =>
        {
            if (error)
            {
                return res.status(403).send({ message: 'Authentication error' });
            }

        const infoUser = credentials.user;
        const id = infoUser.id;
        const newLastConnection = new Date();

        infoUser.lastConnection = newLastConnection;
        console.log('infoUser.lastConnection  ',infoUser.lastConnection );
        // const userManager = new SessionManager();
        // await userManager.updateOne(id, infoUser);
        });

        res.clearCookie('accessToken');
        res.status(200).send({ message: 'logout ok!' });
    }
    catch (e)
    {
        next(e);
    }
};

export const signup = async (req, res, next) =>
{
  try {
    const manager = new SessionManager();
    const user = await manager.signup(req.body);

    res.status(201).send({ status: 'success', user, message: 'User created.' });
  } catch (error) {
    next(error);
  }
};


export const forgotPassword = async(req, res, next) =>
{
    try
    {
        req.logger.debug('session controller: forget password');
        const email = req.body.email;

        const manager = new SessionManager();
        const userEmail = await manager.getOneByEmail(email);
        if (userEmail.id === undefined)
        {
            return res.status(401).send({ message: 'This email dont have an account associated' });
        }
        const tokenPassword = await generateTokenNewPassword(userEmail);

        const emailManager = new EmailManager();
        await emailManager.emailPassword(tokenPassword, email);

        res.status(200).send({ message: 'mail send' });
    }
    catch (e)
    {
        next(e);
    }
};

