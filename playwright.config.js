const { devices } = require('@playwright/test');

// 테스트환경 지정bb
let env = process.env.TEST_ENV || 'live';
if (env === 'live'){
  env = 'www';
}
let baseURL = `http://${env}.wadiz.kr/web/`

module.exports = {
  globalSetup: require.resolve('./global-setup'),
  projects: [
    {
      name: 'PC',
      use: {
        browserName: 'chromium',
        headless: false,
        storageState: 'storageState.json',
        baseURL: baseURL,
        // PC 웹 환경에 적합한 뷰포트 설정
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Mobile',
      use: {
        browserName: 'chromium',
        headless: false,
        storageState: 'storageState.json',
        baseURL: baseURL,
        // 페이지 내 viewport 설정
        viewport: { width: 390, height: 844 },
        isMobile: true,
        deviceScaleFactor: 3,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        // 실제 브라우저 창 크기를 설정
        launchOptions: {
          args: ['--window-size=390,844']
        }
      },
    },
  ],
};