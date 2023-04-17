const isCi = require('is-ci');

if (!isCi) {
    require('husky').install();
}
