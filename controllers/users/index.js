const cote = require('cote');

class Users {
    constructor(){
        this.client = new cote.Requester({ name: 'User Client' });
    }

    createUser(request) {
        return new Promise((resolve, reject) => {
            this.client.send({ type: 'createuser', user: request.payload }, (user) => {
                console.log(user);
                resolve(user);
            });
        });
    }
}

module.exports = new Users();
