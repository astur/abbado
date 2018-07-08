module.exports = ({
    timeout = null,
    count = null,
} = {}) => {
    let off = false;
    let timer = null;
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
        off = true;
    };

    const stopped = () => {
        if(off) return true;
        if(count !== null && count-- <= 0) return true;
        if(expires !== null && expires < Date.now()) return true;
        return false;
    };

    return {stop, stopped, pause, resume, wait};
};
