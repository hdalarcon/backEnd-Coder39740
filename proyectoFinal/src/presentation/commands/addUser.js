import { Command } from 'commander';
import UserManager from '../../domain/manager/UserManager.js';

const addUserCommand = new Command('addUser');

addUserCommand
.version('0.0.1')
.description('Add User')
.option('-e, --email <email>', 'User`s email')
.option('-fn, --firstName <firstName>', 'User`s first name')
.option('-ln, --lastName <lastName>', 'User`s last name')
.option('-p, --password <password>', 'User`s password')
.option('-a, --age <age>', 'User`s age')
.option('-ia, --isAdmin <isAdmin>', 'User`s isAdmin')
.option('-t, --terminal <terminal>', 'User created from terminal')
.action(async(env) =>
{
    const payload = {
        ...env,
        age: +env.age,
        isAdmin: env.isAdmin === 'true',
        terminal: env.terminal === 'true'
    };
    const manager = new UserManager();
    const user = await manager.create(payload);

    if (user)
    {
        console.log(user);
        console.log('user created successfully');
    }
});
export default addUserCommand;
