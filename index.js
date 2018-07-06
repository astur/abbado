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
    const wait = () => new Promise(resolve => {
        resolve();
    });

    return {stop, stopped, wait};
};
