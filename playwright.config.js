const { devices } = require('@playwright/test');

// 테스트환경 지정
const env = process.env.TEST_ENV || 'live';

let baseURL;
if (env === 'rc') {
  baseURL = 'https://rc.wadiz.kr/web/';
} else if (env === 'rc2') {
  baseURL = 'https://rc2.wadiz.kr/web/';
} else if (env === 'rc3') {
  baseURL = 'https://rc3.wadiz.kr/web/';
} else if (env === 'stage') {
  baseURL = 'https://stage.wadiz.kr/web/';
} else if (env === 'live') {
  baseURL = 'https://www.wadiz.kr/web/';
} else {
  throw new Error("baseURL이 설정되지 않았습니다.");
}

let baseServiceURL;
if (env === 'rc') {
  baseServiceURL = 'https://rc-service.wadiz.kr/';
} else if (env === 'rc2') {
  baseServiceURL = 'https://rc2-service.wadiz.kr/';
} else if (env === 'rc3') {
  baseServiceURL = 'https://rc3-service.wadiz.kr/';
} 
// else if (env === 'stage') {
//   baseServiceURL = 'https://service.wadiz.kr/';
// } else if (env === 'live') {
//   baseServiceURL = 'https://service.wadiz.kr/';
// }

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
