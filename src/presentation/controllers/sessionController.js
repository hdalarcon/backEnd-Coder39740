import SessionManager from "../../domain/manager/sessionManager.js";
import UserManager from "../../domain/manager/userManager.js";
import CartManager from "../../domain/manager/cartManager.js";
import loginValidation from "../../domain/validations/session/loginValidation.js";
import jwt from 'jsonwebtoken';

export const login = async  (req, res, next) =>
{
  try {
    const { email, password } = req.body;

    await loginValidation.parseAsync(req.body);

    const manager = new SessionManager();
    const accessToken = await manager.login(email, password);


    const managerUser = new UserManager();
    const user = await managerUser.getOneByEmail(email);

    user.lastConnection = new Date();
    
    await managerUser.updateConnection(user.id, user);
    

    res.cookie('accessToken', accessToken, {
      maxAge: 60*60*1000,
      httpOnly: true
    }).send({ message: 'Login success!', accessToken })
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
        
        if(req.headers.cookie === undefined)
        {
          res.status(500).send({message: 'User not logged!'});
        }else{
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
          
          const userManager = new UserManager();
          await userManager.updateOne(id, infoUser);
          });
  
          res.clearCookie('accessToken');
          res.status(200).send({ message: 'logout ok!' });
        }

    }
    catch (e)
    {
        next(e);
    }
};

export const signup = async (req, res, next) =>
{
  try {
    const newUser = req.body;

    const cart = new CartManager();
    const cartAssociated = await cart.newCart();
    newUser.cart = cartAssociated.id;

    const userManager = new UserManager();
    const userExist = await userManager.getOneByEmail(newUser.email);
    
    if (userExist.id === undefined)
    {
      const manager = new SessionManager();
      const user = await manager.signup(newUser);
      return res.status(201).send({
        status: 'success',
        message: 'User created.',
        payload: user });
    }
    res.status(400).send({ status: 'error', message: 'Mail already in use' });

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

