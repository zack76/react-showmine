const validateEmail = value => {
    let re = RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$');
    return re.test(value);
};

const validateNum = (value, length) => {
    let re = length ? RegExp('^\\d{' + length + '}$') : RegExp('^\\d+$');
    return re.test(value);
};

const validateDefaultInput = (value) => {
    let re = RegExp('^(?!\\s*$).+');
    return re.test(value);
};

module.exports = {
    validateEmail,
    validateNum,
    validateDefaultInput,
}

