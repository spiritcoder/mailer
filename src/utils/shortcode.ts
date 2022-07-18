const ShortCode = async () => {

    var length = 6;
    var chars = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
    var code = '';
    for (var i = length; i > 0; --i) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

export {ShortCode};