const test = require('ava');
const m = require('.');
const delay = require('delay');

test('stop manually', t => {
    const _ = m();
    t.is(_.stopped(), false);
    _.stop();
    t.is(_.stopped(), true);
});

test('stop by count', t => {
    const _ = m({count: 3});
    t.is(_.stopped(), false);
    t.is(_.stopped(), false);
    t.is(_.stopped(), false);
    t.is(_.stopped(), true);
    t.is(_.stopped(), true);
});

test('stop by timeout', async t => {
    const _ = m({timeout: 30});
    t.is(_.stopped(), false);
    await delay(20);
    t.is(_.stopped(), false);
    await delay(20);
    t.is(_.stopped(), true);
});
