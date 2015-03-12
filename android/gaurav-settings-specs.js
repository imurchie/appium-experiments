"use strict";

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd')
  , TouchAction = wd.TouchAction;



var desired = {
  platformName: 'Android',
  platformVersion: '4.4',
  deviceName: 'Android Emulator',
  app: '/Users/isaac/code/temp/temp/App.apk',
  appActivity: '.SettingsSuggestionActivity'
};


describe("drag and drop", function () {
  var driver;

  before(function() {
    driver = wd.promiseChainRemote('localhost', 4723);
    chaiAsPromised.transferPromiseness = wd.transferPromiseness;
    // optional extra logging
    driver.on('status', function(info) {
      console.log(info.cyan);
    });
    driver.on('command', function(eventType, command, response) {
      console.log(' > ' + eventType.cyan, command, (response || '').grey);
    });
    driver.on('http', function(meth, path, data) {
      console.log(' > ' + meth.magenta, path, (data || '').grey);
    });
    return driver
      .init(desired);
  });

  after(function() {
    return driver.quit();
  });

  it('should move the element correctly', function (done) {
    driver
      .elementByClassName('android.widget.ListView')
        .then(function (list) {
          return list.elementsByClassName('android.widget.TextView');
        })
        .then(function (els) {
          var action = new TouchAction(driver);
          return action.longPress({el: els[els.length-1]}).moveTo({ el: els[0] }).release().perform();
        })
      .sleep(10000)
      .nodeify(done);
  });
});
