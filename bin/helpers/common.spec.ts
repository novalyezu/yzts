import 'mocha';
import chai from 'chai';
import * as common from './common';

describe('helpers/common', () => {
  describe('wrapperData', () => {
    it('should return succes', () => {
      const res = common.wrapperData('dev');
      chai.expect(res.data).to.equal('dev');
      chai.expect(res.err).to.be.null;
    });
  });
});
