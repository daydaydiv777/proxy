const getCommandValue = function (commandName: string) {
    const args = process.argv.slice(2);
    let value = '';
    for (let i = 0; i < args.length; i++) {
        let ps = args[i].split('=');
        if (ps.length > 1 && ps[0] === commandName) {
            value = ps[1]
        }
    }
    return value
};

export {
    getCommandValue
}