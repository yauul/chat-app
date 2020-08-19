const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.json');

const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
    Query: {
        getUsers: async (_, args, context) => {
            let user;

            try {
                if (context.req && context.req.headers.authorization) {
                    const token = context.req.headers.authorization.split(
                        'Bearer '
                    )[1];
                    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
                        if (err) {
                            throw new AuthenticationError('Unauthenticated');
                        }
                        user = decodedToken;
                        console.log(user);
                    });
                }
                const users = await User.find({
                    username: { $ne: user.username },
                });

                return users;
                // return users.filter((u) => user.username !== u.username);
            } catch (error) {
                throw error;
            }
        },
        login: async (_, args) => {
            const { username, password } = args;
            let errors = {};
            try {
                if (username.trim() === '')
                    errors.username = 'Username must not be empty';
                if (password.trim() === '')
                    errors.password = 'Password must not be empty';

                if (Object.keys(errors) > 0) {
                    throw new UserInputError('user not found mudeer', {
                        errors,
                    });
                }

                const user = await User.findOne({ username: username });
                if (!user) {
                    errors.username = 'User not found';
                    throw new UserInputError('user not found mudeer', {
                        errors,
                    });
                }

                if (Object.keys(errors) > 0) {
                    throw new UserInputError('user not found mudeer', {
                        errors,
                    });
                }

                const correctPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!correctPassword) {
                    errors.password = 'Password is incorrect';
                    throw new AuthenticationError('auth error mudeer', errors);
                }

                const token = jwt.sign(
                    {
                        username,
                    },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return {
                    ...user.toJSON(),
                    created_at: user.created_at.toISOString(),
                    token,
                };
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
    },
    Mutation: {
        register: async (_, args) => {
            let { username, email, password, confirmPassword } = args;

            let errors = {};

            try {
                // TODO: Validate input data
                if (email.trim() === '')
                    errors.email = 'Email must not be empty';
                if (username.trim() === '')
                    errors.username = 'Username must not be empty';
                if (password.trim() === '')
                    errors.password = 'Password must not be empty';
                if (confirmPassword.trim() === '')
                    errors.confirmPassword =
                        'Confirm password must not be empty';

                if (!validator.isEmail(email)) errors.email = 'Invalid email';

                // TODO: Check if username / email exists
                const existsUsername = await User.findOne({
                    username: username,
                });
                const existsEmail = await User.findOne({ email: email });

                if (existsUsername) errors.username = 'Username already exists';
                if (existsEmail) errors.email = 'Email already exists';
                if (password !== confirmPassword)
                    errors.confirmPassword = 'Passwords must match';

                if (Object.keys(errors).length > 0) {
                    throw errors;
                }

                // TODO: Hash password
                const hashpwd = await bcrypt.hash(password, 6);

                // TODO: Create user
                const user = await User.create({
                    username,
                    email,
                    password: hashpwd,
                });
                return user;
                // TODO: Return user
                return user;
            } catch (error) {
                throw new UserInputError('Bad Input Dumb Dumb', error);
            }
        },
    },
};
