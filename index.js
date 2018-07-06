module.exports = ({timeout = null} = {}) => {
    let off = false;

    if(timeout){
        setTimeout(() => {
            off = true;
        }, timeout);
    }

    const stop = () => {
        off = true;
    };

    const stopped = () => off;

    return {stop, stopped};
};
