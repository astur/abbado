module.exports = ({
    timeout = null,
    count = null,
} = {}) => {
    let off = false;
    let timer = null;
    const waiting = [];

    if(timeout){
        setTimeout(() => {
            off = true;
        }, timeout);
    }

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

    const stop = () => {
        if(timer !== null) pause(0);
        off = true;
    };

    const stopped = () => off || count !== null && count-- <= 0;

    return {stop, stopped, pause, wait};
};
