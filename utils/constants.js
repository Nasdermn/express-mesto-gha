const MONGO_DUPLICATE_KEY_ERROR = 11000;
const SALT_ROUNDS = 10;
const SECRET_KEY = 'vzlomshiks_and_ddosers_are_lohi)';
// eslint-disable-next-line no-useless-escape
const urlRegex = /^https?:\/\/(www\.)?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+#?$/;

module.exports = {
  MONGO_DUPLICATE_KEY_ERROR,
  SALT_ROUNDS,
  SECRET_KEY,
  urlRegex,
};
