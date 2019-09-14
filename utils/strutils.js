module.exports = class StringUtils {

    static charIsLetter(ch) {
        return ch.length === 1 && ch.match(/[a-z]/i);
    }

    static charIsNumber(ch) {
        var re = /^\d$/;
        return re.test(ch);
    }

    static isLowerCase(str) {
        return str == str.toLowerCase();
    }

    static isUpperCase(str) {
        return str == str.toUpperCase();
    }
}
