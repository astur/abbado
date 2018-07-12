module.exports = ({
    timeout = null,
    count = null,
    errorLimit = null,
    tagErrorLimit = null,
} = {}) => {
    let off = false;
    let result;
    let timer = null;
    let errorsCount = 0;
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
        if(timer === null || off){
            resolve();
        } else {
            waiting.push(resolve);
        }
    });

    const stop = () => {
        if(timer !== null) pause(0);
        if(!off){
            off = true;
            result = {status: 'stopped manually'};
        }
    };

    const stopped = () => {
        if(off) return result;
        if(count !== null && count-- <= 0) return {status: 'stopped by count'};
        if(expires !== null && expires < Date.now()) return {status: 'stopped by timeout'};
        return false;
    };

    const error = tag => {
        errorsCount++;
        if(errorLimit !== null && errorLimit <= errorsCount){
            if(timer !== null) pause(0);
            if(!off){
                off = true;
                result = {status: 'stopped by error limit'};
            }
        }
        if(typeof tag === 'string'){
            errors[tag] = (errors[tag] || 0) + 1;
            if(tagErrorLimit !== null && tagErrorLimit <= errors[tag]){
                if(timer !== null) pause(0);
                if(!off){
                    off = true;
                    result = {status: 'stopped by tag error limit', tag};
                }
            }
        }
        return [errorsCount, errors[tag] || null];
    };

    return {stop, stopped, pause, resume, wait, error};
};
