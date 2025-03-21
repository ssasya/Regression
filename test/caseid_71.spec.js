const { test, expect } = require('@playwright/test');

test('caseid_71 - 스토어 : 마이와디즈 구매내역 상세 확인', async ({ page,isMobile }) => {
  if (isMobile){
    
    // -----------------------------------------
    // 1. 스토어 : 마이와디즈 나의 구매내역 진입 //
    // -----------------------------------------
    await Promise.all([ //페이지 이동하여 API 로딩 대기
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.goto('mywadiz/store/order')
    ]);

    // 상품 리스트 API Json에 파싱(orderNo를 받기 위해)
    const storebuyList = await page.request.get(`apip/store/orders/my?page=0&sortBy=REGISTERED_AT%2CDESC&size=10&filter=ALL`);
    expect(storebuyList.ok()).toBeTruthy();
    const storebuyList_result = await storebuyList.json();
    console.log(storebuyList_result);
    const orderNo_first = storebuyList_result.data[0].orderNo;
    const orderName = storebuyList_result.data[0].project.title;

    await page.locator('.PurchaseSummaryCard_item__3Wq1e').first().click();

    // ----------------------------------------
    // 2. 스토어 : 스토어 나의 구매 리스트 확인 //
    // ----------------------------------------

    // 
    const fullorder_View =  await page.locator('.OrderDetailPage_cardInfoArea__29mmy').innerText();
    const matchNo = fullorder_View.match(/주문번호\s*:\s*(.+)/);
    const orderNo_View = matchNo ? matchNo[1].trim() : "";
    expect(orderNo_View).toBe(orderNo_first);
    
    const fullorderName_View =  await page.locator('.OrderDetailPage_cardInfoArea__29mmy').innerText();
    expect(fullorderName_View.trim()).toBe(orderName);

  }
});