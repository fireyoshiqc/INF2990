import { SkyBox } from './skyBox';

import { assert, expect } from 'chai';

describe('SkyBox', () => {

  describe ('Default constructor ', () => {
    it ('should construct a SkyBox object with default textures (no parameters passed).', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox();

      expect(testSkyBox instanceof SkyBox).to.equal(true);
      expect(testSkyBox instanceof THREE.Mesh).to.equal(true);
      expect(testSkyBox.imageName = "../assets/textures/sb_iceflow/iceflow_");
      expect(testSkyBox.directions = ["lf", "rt", "up", "dn", "ft", "bk"]);
      expect(testSkyBox.imageSuffix = ".jpg");
      done();
    });

    it ('should construct a SkyBox object with imageName passed as parameter.', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox("icyhell/icyhell_");
      expect(testSkyBox.imageName).to.equal("../assets/textures/icyhell/icyhell_");
      done();
    });

    it ('should construct a SkyBox object with imageName and directions passed as parameters.', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox("icyhell/icyhell_", ["lf", "rt", "up", "dn", "ft", "bk"]);
      expect(testSkyBox.imageName = "../assets/textures/icyhell/icyhell_");
      expect(testSkyBox.directions = ["lf", "rt", "up", "dn", "ft", "bk"]);
      done();
    });

    it ('should construct a SkyBox object with imageName, directions and imageSuffix passed as parameters.', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox("dawnmountain-", ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"], ".png");
      expect(testSkyBox.imageName = "../assets/textures/dawnmountain-");
      expect(testSkyBox.directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]);
      expect(testSkyBox.imageSuffix = ".png");
      done();
    });
  });
});
