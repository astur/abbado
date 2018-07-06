const test = require('ava');
const m = require('.');

test('stop manually', t => {
    const _ = m();
    t.is(_.stopped(), false);
    _.stop();
    t.is(_.stopped(), true);
});
