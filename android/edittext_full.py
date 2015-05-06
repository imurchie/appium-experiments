import os
import sys
from time import sleep

import unittest

from appium import webdriver

# Returns abs path relative to this file and not cwd
PATH = lambda p: os.path.abspath(
    os.path.join(os.path.dirname(__file__), p)
)

fast = False

class SimpleAndroidTests(unittest.TestCase):
    def setUp(self):
        desired_caps = {
            'platformName': 'Android',
            'platformVersion': '4.4',
            'deviceName': 'Android Emulator',
            'app': 'assets/ApiDemos-debug.apk'
        }
        if fast:
            desired_caps['appActivity'] = '.view.TextFields'

        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)

    def tearDown(self):
        # end the session
        self.driver.quit()

    def test_settings(self):
        if not fast:
            self.driver.scroll(self.driver.find_element_by_accessibility_id('Content'), self.driver.find_element_by_accessibility_id('Animation'))
            self.driver.find_element_by_accessibility_id('Views').click()
            self.driver.scroll(self.driver.find_element_by_accessibility_id('Focus'), self.driver.find_element_by_accessibility_id('Animation'))
            self.driver.find_element_by_accessibility_id('TextFields').click()

        el = self.driver.find_elements_by_class_name('android.widget.EditText')[2]
        el.send_keys('This is a string')

        assert 'This is a string' == el.text


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--fast':
        fast = True
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleAndroidTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
