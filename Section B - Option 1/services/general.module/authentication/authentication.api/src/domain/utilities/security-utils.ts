import crypto from 'crypto';

export class SecurityUtils {

    static encrypt(text: string) {
        const cipher = crypto.createCipher('aes-256-cbc', 'yV*tL^x0saMcyAi@')
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    static decrypt(text: string) {
        const decipher = crypto.createDecipher('aes-256-cbc', 'yV*tL^x0saMcyAi@')
        let dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}