'use strict';

import errcode from '../../common/error';

const error = (code) => {
  let o = _.find(errcode, { code: code });
  let e = new Error();
  e.code = o.code;
  e.message = o.message;
  return e;
}

export { error };
