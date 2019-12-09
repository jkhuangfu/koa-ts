import * as crypto from 'crypto';

const hash = (content: any, type: string) => {
    const HASH = crypto.createHash(type);
    HASH.update(content);
    return HASH.digest('hex');
};
export default hash;
