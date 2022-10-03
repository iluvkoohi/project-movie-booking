const { check, query } = require('express-validator');


const userValidator = [
    check('email', 'Email required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
];
const cinemaValidator = [
    check('accountId', 'Account Id required').notEmpty(),
    check('name', 'Name is required').notEmpty(),
    check('address.name', 'Address name is required').notEmpty(),
    check('address.coordinates.latitude', 'Address latitude is required').notEmpty(),
    check('address.coordinates.longitude', 'Address longitude is required').notEmpty(),
    check('dateTime.open', 'Cinema opening is required').notEmpty(),
    check('dateTime.close', 'Cinema closing is required').notEmpty(),
];
const cinemaSeatsValidator = [
    check('accountId', 'Account Id required').notEmpty(),
    check('rows', 'Row count is required').notEmpty(),
    check('cols', 'Column count is required').notEmpty(),
];

const getCinemasValidator = [
    query('latitude', 'Latitude required').notEmpty(),
    query('longitude', 'Longitude is required').notEmpty(),
];

const getCinemasSeatsValidator = [
    query('cinemaId', 'Cinema Id required').notEmpty(),
    query('movieId', 'Movie Id is required').notEmpty(),
    query('accountId', 'Account Id is required').notEmpty(),
];


module.exports = {
    userValidator,
    cinemaValidator,
    getCinemasValidator,
    cinemaSeatsValidator,
    getCinemasSeatsValidator
}