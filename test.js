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

test('wait', async t => {
    const _ = m();
    const now = Date.now();
    await _.wait();
    t.true(now + 10 > Date.now());
});

test('pause', async t => {
    const _ = m();
    const now = Date.now();
    _.pause(1000);
    const p = _.wait();
    _.pause(50);
    await Promise.all([
        p,
        _.wait(),
        Promise.resolve().then(_.wait),
        delay(10).then(_.wait),
        Promise.resolve().then(() => _.wait()),
    ]);
    t.true(now + 50 <= Date.now());
    t.true(now + 55 >= Date.now());
});

test('pause stopped', async t => {
    const _ = m();
    const now = Date.now();
    _.pause(1000);
    const p = _.wait();
    _.stop();
    await Promise.all([p, _.wait()]);
    t.true(now + 10 >= Date.now());
});

test('resume', async t => {
    const _ = m();
    const now = Date.now();
    _.pause(1000);
    _.resume();
    await _.wait();
    t.true(now + 10 >= Date.now());
});

test('error', t => {
    const _ = m();
    t.deepEqual(_.error(), [1, null]);
    t.deepEqual(_.error(), [2, null]);
    t.deepEqual(_.error(), [3, null]);
});
