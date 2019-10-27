
module.exports = class MathUtils {

    static ratio(n, m) {
        if (m == 0) {
            if (n != 0)
                return 1;
            return 0;
        }
        return n/m;
    }

    

}