export const authorizationAdmin = async(req, res, next) =>
{
        const user = req.user;
        if (user.isAdmin == false)
        {
            return res.status(401).send({ message: 'You lack authorization to continue' });
        }
        next();
};
