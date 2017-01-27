import { SkyBox } from './skyBox';

import { assert, expect } from 'chai';

describe('SkyBox', () => {

  describe ('Default constructor ', () => {
    it ('should construct a SkyBox object with default textures (no parameters passed).', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox();
      console.log("\n" + testSkyBox.imageName);
      expect(testSkyBox instanceof SkyBox).to.equal(true);
      expect(testSkyBox instanceof THREE.Mesh).to.equal(true);
      expect(testSkyBox.imageName = "../assets/textures/iceflow_");
      expect(testSkyBox.directions = ["lf", "rt", "up", "dn", "ft", "bk"]);
      expect(testSkyBox.imageSuffix = ".jpg");
      done();
    });

    it ('should constrcut a SkyBox object with imageName passed as parameter.', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox("icyhell_");
      console.log(testSkyBox);
      expect(testSkyBox.imageName).to.equal("../assets/textures/icyhell_");
      done();
    });

    it ('should constrcut a SkyBox object with imageName and directions passed as parameters.', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox("dawnmountain-", ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]);
      expect(testSkyBox.imageName = "../assets/textures/dawnmountain-");
      expect(testSkyBox.directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]);
      done();
    });

    it ('should constrcut a SkyBox object with imageName, directions and imageSuffix passed as parameters.', done => {
      let testSkyBox: SkyBox;
      testSkyBox = new SkyBox("dawnmountain-", ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"], ".png");
      expect(testSkyBox.imageName = "../assets/textures/dawnmountain-");
      expect(testSkyBox.directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"]);
      expect(testSkyBox.imageSuffix = ".png");
      done();
    });
  });
});
