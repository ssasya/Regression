// test/caseid_89.spec.js
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
// 상위 폴더에 있는 playwright.config.js에서 설정 불러오기
const { server, storageState } = require('../playwright.config').projects[0].use;

test('caseid_89 - 여러 API 응답 상태 확인', async ({ page }) => {
  console.log("> caseid_89 < 테스트 시작");

  const storageStatePath = path.resolve(__dirname, '..', storageState);
  expect(fs.existsSync(storageStatePath)).toBeTruthy();

  // API 대상 리스트 전체
  const apiEndpoints = [
    '/api/friends/supporter/feeds/recent',
    '/api/friends/supporter/feeds',
    '/api/friends/supporter/feeds/following',
    '/api/friends/advertisement/MMCBF',
    '/main2/api/v1/curation/hot',
    '/main2/api/v1/curation/like',
    '/main2/api/v1/curation/support',
    '/main2/api/v1/curation/debut'
  ];

  let completedResponses = new Set();
  let allStatus200 = true;

  // 페이지 이동 전에 API 응답 감지 이벤트 리스너 등록
  page.on('requestfinished', async (request) => {
    const requestUrl = new URL(request.url());
    if (apiEndpoints.includes(requestUrl.pathname) && !completedResponses.has(requestUrl.pathname)) {
      const response = await request.response();
      if (response) {
        completedResponses.add(requestUrl.pathname);
        const status = response.status();
        console.log(`[응답 완료] ${requestUrl.pathname} (Status: ${status})`);
        if (status !== 200) {
          allStatus200 = false;
        }
      }
    }
  });

  // 페이지 이동 (이벤트 리스너는 이미 등록됨)
  console.log(`페이지 이동: https://${server}.wadiz.kr/web/feed/main`);
  await page.goto(`https://${server}.wadiz.kr/web/feed/main`);
  await page.waitForLoadState('networkidle');

  // 이미 감지되지 않은 API 응답이 있다면 waitForResponse()로 기다림
  for (const apiEndpoint of apiEndpoints) {
    if (completedResponses.has(apiEndpoint)) continue;
    try {
      const response = await page.waitForResponse(resp => 
        resp.url().includes(apiEndpoint),
        { timeout: 10000 }
      );
      if (response) {
        const status = response.status();
        console.log(`[응답 확인됨] ${apiEndpoint} (Status: ${status})`);
        if (status !== 200) allStatus200 = false;
      }
    } catch (error) {
      console.error(`[응답 없음] ${apiEndpoint}`);
      allStatus200 = false;
    }
  }

  console.log("모든 API 응답 확인 완료");

  if (allStatus200) {
    console.log("> caseid_89 테스트 결과: PASS <");
  } else {
    console.log("> caseid_89 테스트 결과: FAIL <");
  }
});
