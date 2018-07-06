module.exports = ({
    timeout = null,
    count = null,
} = {}) => {
    // stop
    let off = false;
    if(timeout){
        setTimeout(() => {
            off = true;
        }, timeout);
    }
    const stop = () => {
        off = true;
    };
    const stopped = () => off || count !== null && count-- <= 0;

    // pause
    let timer = null;
    const waiting = [];
    const pause = ms => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            waiting.forEach(r => r());
            waiting.splice(0);
            timer = null;
        }, ms);
    };
    const wait = () => new Promise(resolve => {
        if(timer === null || off){
            resolve();
        } else {
            waiting.push(resolve);
        }
    });

    return {stop, stopped, pause, wait};
};
