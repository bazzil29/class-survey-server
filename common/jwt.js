const nJwt = require('njwt');

const SIGN_KEY = `N0SRGSDXqvn3VDBQT/N4o2p/moop056giSxD9mC2U5hVkmP41YLfQeEUlI5iow7olAeWMu7eBNtAA6wa2b+lSp9GumMWZHZAsOKQo69DBfV6wRdFD2OVd/RBpLdMiWuosMj2vkv0FHakCpmz4AtcUGrxRmkLQPPvq+BjVU1PmuIq11pqRNNrm/+u7aQs1GwvSNinQ0yKs/BFYOxq+6zIg7+5QwNHILy3L3kYLe4JlY7nFT7DUZXSi6O3KRi1HRS9rZJCe/JivHlCdFGiwi3Vas8byIRTBwBoFfJQo+Ni5fhYE8nBOVZecczH/zG3gjIeTQhvTfr7OA7g/aFACKz0jw==`;

module.exports = {
    create: (value) => {
        const claims = {
            value: value
        };
        const jwt = nJwt.create(claims, SIGN_KEY);

        jwt.setExpiration(new Date().getTime() + (24 * 15 * 60 * 60 * 1000));
        const token = jwt.compact();
        return token;
    },
    verify: (value) => nJwt.verify(value, SIGN_KEY)
}


