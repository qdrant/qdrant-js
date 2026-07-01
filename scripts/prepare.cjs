const isCi = require('is-ci');

if (!isCi) {
    import('husky').then(({default: husky}) => husky());
}
