const cote = require('cote');
const userService = new cote.Responder({ name: 'User Service' });

let users = [];

userService.on('createuser', (req, cb) => {
    console.log('topic received; createuser');
    console.log(req.user)
    users.push(req.user);
    cb({message: 'user added.'});
});
