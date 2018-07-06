module.exports = () => {
    let off = false;

    const stop = () => {
        off = true;
    };

    const stopped = () => off;

    return {stop, stopped};
};
