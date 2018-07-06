module.exports = ({
    timeout = null,
    count = null,
} = {}) => {
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

    return {stop, stopped};
};
