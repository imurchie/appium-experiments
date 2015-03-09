"use strict";

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd = require('wd');


var desired = {
  platformName: 'Android',
  platformVersion: '4.4',
  deviceName: 'Android Emulator',
  app: 'https://github.com/appium/appium/raw/master/assets/ApiDemos-debug.apk',
  appActivity: '.view.DateWidgets1'
};


describe("date picker", function () {
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

  it('should set the date picker correctly', function (done) {
    var dp, els;
    driver
      .elementByName('change the date')
        .click()
      .elementByClassName('android.widget.DatePicker')
        .then(function (_dp) {
          dp = _dp;
          return dp;
        })
      .elementsByClassName('android.widget.EditText')
        .then(function (_els) {
          els = _els;
          return els[0];
        })
        .clear()
        .sendKeys('Jul')
      .then(function () {
        return els[1];
      })
        .clear()
        .sendKeys('21')
      .then(function () {
        return els[2];
      })
        .clear()
        .sendKeys('2011')
      .elementByName('Done')
        .click()
      .elementById('io.appium.android.apis:id/dateDisplay')
        .text().should.eventually.include('7-21-2011')
      .nodeify(done);
  });
});
