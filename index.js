const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Pack = require('./package');
const UserController = require('./controllers').users;

(async () => {
    const server = await new Hapi.Server({
        host: 'localhost',
        port: 3000,
    });

const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: Pack.version,
    },
};

try {
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    await server.start();
    console.log('Server running at:', server.info.uri);
} catch(err) {
    console.log(err);
}

server.route({
    method: 'GET',
    path: '/hello/{user?}',
    handler: function (request, h) {

        const user = request.params.user ?
            encodeURIComponent(request.params.user) :
            'stranger';

        return `Hello ${user}!`;
    },
    options: {
        description: 'Say hello!',
        notes: 'The user parameter defaults to \'stranger\' if unspecified',
        tags: ['api', 'greeting']
    }
});

server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, h) {
        return [];
    },
    options: {
        description: 'Say hello!',
        notes: 'get all users',
        tags: ['api', 'users']
    }
});

server.route({
    method: 'POST',
    path: '/users',
    handler: UserController.createUser,
    options: {
        description: 'create new user',
        notes: 'create user',
        tags: ['api', 'users'],
        plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },
        validate: {
            payload: {
                name: Joi.string().description('user name').required(),
                email: Joi.string().email({ minDomainAtoms: 2 }).description('user email').required(),
                password: Joi.string().description('user password').required().min(2).max(10),
            }
        }
    }
});

})();
