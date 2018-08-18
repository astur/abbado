module.exports = ({
    timeout = null,
    count = null,
    errorLimit = null,
    tagErrorLimit = null,
} = {}) => {
    let result = false;
    let timer = null;
    let errorsCount = 0;
    let counter = count;
    const errors = {};
    const waiting = [];
    const expires = timeout ? Date.now() + timeout : null;

    const pause = ms => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            waiting.forEach(r => r());
            waiting.splice(0);
            timer = null;
        }, ms);
    };

    const resume = () => pause(0);

    const wait = () => new Promise(resolve => {
        if(timer === null || result){
            resolve();
        } else {
            waiting.push(resolve);
        }
    });

    const stop = arg => {
        if(timer !== null) pause(0);
        if(!result) result = typeof arg === 'string' ? {status: arg} : arg || {status: 'stopped manually'};
        return result;
    };

    const stopped = () => {
        if(result) return result;
        if(counter !== null && counter-- <= 0) return stop({status: 'stopped by count'});
        if(expires !== null && expires < Date.now()) return stop({status: 'stopped by timeout'});
        return false;
    };

    const error = tag => {
        errorsCount++;
        if(errorLimit !== null && errorLimit <= errorsCount) return stop({status: 'stopped by error limit'});
        if(typeof tag === 'string'){
            errors[tag] = (errors[tag] || 0) + 1;
            if(tagErrorLimit !== null && tagErrorLimit <= errors[tag]) return stop({status: 'stopped by tag error limit', tag});
        }
        return [errorsCount, errors[tag] || null];
    };

    const paused = () => timer !== null;

    return {stop, stopped, pause, resume, wait, error, paused};
};
