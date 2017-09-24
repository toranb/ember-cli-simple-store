import { helper } from '@ember/component/helper';

export default helper((params) => {
    return params[0] === params[1];
});
