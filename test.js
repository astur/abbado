const test = require('ava');
const m = require('.');
const delay = require('delay');

test('stop manually', t => {
    const _ = m();
    t.is(_.stopped(), false);
    _.stop();
    t.deepEqual(_.stopped(), {status: 'stopped manually'});
});

test('stop manually with message', t => {
    const _ = m();
    t.is(_.stopped(), false);
    _.stop('stopped in test');
    _.stop('never mind');
    t.deepEqual(_.stopped(), {status: 'stopped in test'});
});

test('stop by count', t => {
    const _ = m({count: 3});
    t.is(_.stopped(), false);
    t.is(_.stopped(), false);
    t.is(_.stopped(), false);
    t.is(!!_.stopped(), true);
    t.deepEqual(_.stopped(), {status: 'stopped by count'});
});

test.serial('stop by timeout', async t => {
    const _ = m({timeout: 30});
    t.is(_.stopped(), false);
    await delay(20);
    t.is(_.stopped(), false);
    await delay(20);
    t.deepEqual(_.stopped(), {status: 'stopped by timeout'});
});

test.serial('wait', async t => {
    const _ = m();
    const now = Date.now();
    await _.wait();
    t.true(now + 10 > Date.now());
});

test.serial('pause', async t => {
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
    t.true(now + 60 >= Date.now());
});

test.serial('pause stopped', async t => {
    const _ = m();
    const now = Date.now();
    _.pause(1000);
    const p = _.wait();
    _.stop();
    await Promise.all([p, _.wait()]);
    t.true(now + 10 >= Date.now());
});

test.serial('resume', async t => {
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
    t.deepEqual(_.error('tag1'), [4, 1]);
    t.deepEqual(_.error('tag1'), [5, 2]);
    t.deepEqual(_.error('tag1'), [6, 3]);
    t.deepEqual(_.error('tag2'), [7, 1]);
    t.deepEqual(_.error(), [8, null]);
});

test('error limit', t => {
    const _ = m({errorLimit: 3});
    t.is(_.stopped(), false);
    _.error();
    _.error('tag');
    t.is(_.stopped(), false);
    _.error();
    t.deepEqual(_.stopped(), {status: 'stopped by error limit'});
});

test('tag error limit', t => {
    const _ = m({tagErrorLimit: 3});
    t.is(_.stopped(), false);
    _.error('tag');
    _.error('tag');
    t.is(_.stopped(), false);
    _.error();
    _.error();
    _.error();
    _.error();
    _.error('TAG');
    t.is(_.stopped(), false);
    _.error('tag');
    t.deepEqual(_.stopped(), {status: 'stopped by tag error limit', tag: 'tag'});
});
