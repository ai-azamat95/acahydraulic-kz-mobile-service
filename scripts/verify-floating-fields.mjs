// Local-only checks. External traffic is blocked; WhatsApp and analytics are mocked.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
const browsers = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.resolve("dist/public");
const out = process.env.FORM_QA_OUT || "ui-check/floating-fields";
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(root + path.sep) && file !== root)
    return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory())
    file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    if (path.extname(file)) return res.writeHead(404).end();
    file = path.join(root, "index.html");
  }
  res.setHeader(
    "Content-Type",
    {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".woff2": "font/woff2",
      ".jpg": "image/jpeg",
    }[path.extname(file)] || "application/octet-stream"
  );
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await browsers[process.env.FORM_BROWSER || "chromium"].launch(
  process.env.FORM_BROWSER_PATH
    ? { executablePath: process.env.FORM_BROWSER_PATH }
    : {}
);
const report = {
  browser: browser.version(),
  sizes: [],
  errors: [],
  blockedExternal: 0,
  mutations: [],
};
const assertFields = async container => {
  const fields = await container
    .locator(".floating-field")
    .evaluateAll(elements =>
      elements
        .filter(el => el.getBoundingClientRect().height)
        .map(el => {
          const input = el.querySelector("input,textarea,select,button");
          const label = el.querySelector("label");
          const style = getComputedStyle(input),
            ls = getComputedStyle(label);
          const r = input.getBoundingClientRect(),
            lr = label.getBoundingClientRect();
          return {
            name: label.textContent,
            associated: label.control === input,
            font: parseFloat(style.fontSize),
            width: r.width,
            height: r.height,
            labelFits:
              lr.left >= r.left && lr.right <= r.right && lr.bottom <= r.bottom,
            raised: parseFloat(ls.fontSize) === 12,
            separated: lr.bottom <= r.top + parseFloat(style.paddingTop),
            transition: ls.transitionDuration,
            fits: r.left >= 0 && r.right <= innerWidth,
          };
        })
    );
  for (const field of fields) {
    assert.equal(
      field.associated,
      true,
      `real associated label: ${field.name}`
    );
    assert.equal(field.font, 16, `16px typing size: ${field.name}`);
    assert.ok(
      field.height >= 44 && field.labelFits && field.fits,
      `field bounds: ${field.name}`
    );
    if (field.raised)
      assert.ok(
        field.separated,
        `label does not overlap entered value: ${field.name}`
      );
  }
  return fields;
};
try {
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1440, 900],
    [844, 390],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
      locale: "ru-RU",
    });
    await context.route("**/*", route => {
      const request = route.request();
      if (new URL(request.url()).origin !== origin) {
        report.blockedExternal++;
        return route.abort();
      }
      if (request.method() !== "GET") {
        report.mutations.push(request.url());
        return route.abort();
      }
      return route.continue();
    });
    await context.addInitScript(() => {
      window.__testOpens = [];
      window.open = (...args) => {
        window.__testOpens.push(args);
        return null;
      };
    });
    const page = await context.newPage();
    page.on("pageerror", e => report.errors.push(e.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    const cookie = page.getByRole("dialog", {
      name: "Управление файлами cookie",
    });
    await cookie
      .getByRole("button", { name: "Только обязательные", exact: true })
      .click();
    await cookie.waitFor({ state: "hidden" });
    await page.evaluate(() => document.fonts.ready);
    await page
      .getByRole("button", { name: "Описать поломку", exact: true })
      .click();
    const dialog = page.locator('[data-slot="dialog-content"]');
    const submit = dialog.locator('button[type="submit"]');
    assert.equal(await submit.isDisabled(), true);
    const location = dialog.getByLabel("Где находится техника? *", {
      exact: true,
    });
    const model = dialog.getByLabel("Марка и модель *", { exact: true });
    const name = dialog.getByLabel("Контактное лицо *", { exact: true });
    const phone = dialog.getByLabel("Телефон *", { exact: true });
    await location.fill("Тестовый объект");
    await model.fill("Тестовая модель");
    await name.fill("Тест");
    await phone.fill("123");
    assert.equal(await phone.getAttribute("type"), "tel");
    assert.equal(await phone.getAttribute("inputmode"), "tel");
    await dialog.locator("summary").click();
    await dialog
      .getByLabel("Название компании", { exact: true })
      .fill("Тестовая компания");
    await dialog
      .getByLabel("Описание проблемы", { exact: true })
      .fill("Тестовая неисправность\nВторая строка");
    const close = dialog.locator('[data-slot="dialog-close"]');
    assert.ok(await close.evaluate(el => {
      const r = el.getBoundingClientRect();
      return r.y >= 0 && r.bottom <= innerHeight && el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    }), "close button remains reachable after scrolling through the form");
    const allFields = await assertFields(dialog);
    assert.equal(allFields.length, 11);
    assert.ok(
      allFields.every(f => f.transition === "0s"),
      "reduced motion respected"
    );
    // Click the label itself, not just its input. Empty, focused, filled and cleared states.
    await location.fill("");
    await model.focus();
    const label = dialog.locator(
      `label[for="${await location.getAttribute("id")}"]`
    );
    assert.equal(
      await label.evaluate(el => getComputedStyle(el).fontSize),
      "14px"
    );
    await label.click();
    assert.equal(
      await location.evaluate(el => el === document.activeElement),
      true
    );
    assert.equal(
      await label.evaluate(el => getComputedStyle(el).fontSize),
      "12px"
    );
    await location.fill("Тестовый объект");
    await model.focus();
    assert.equal(
      await label.evaluate(el => getComputedStyle(el).fontSize),
      "12px"
    );
    const consent = dialog.getByRole("checkbox");
    await consent.check();
    assert.equal(await submit.isEnabled(), true);
    await submit.click();
    await page
      .getByText("Укажите телефон с кодом города или оператора", {
        exact: true,
      })
      .waitFor();
    assert.equal(
      await page.evaluate(() => window.__testOpens.length),
      0,
      "invalid phone opens nothing"
    );
    await phone.fill("+7 700 000 00 00");
    const email = dialog.getByLabel("Email (опционально)", { exact: true });
    await email.fill("not-an-email");
    await submit.click();
    assert.equal(await email.evaluate(el => el.validity.typeMismatch), true);
    assert.equal(
      await page.evaluate(() => window.__testOpens.length),
      0,
      "invalid email opens nothing"
    );
    await email.fill("");
    await consent.uncheck();
    assert.equal(await submit.isDisabled(), true);
    await consent.check();
    await page.evaluate(() => {
      window.__testEvents = [];
      window.__ACA_ANALYTICS_EXCLUDE__ = false;
      window.__ACA_COOKIE_CONSENT__ = { analytics: true, marketing: false };
      window.gtag = (...args) => window.__testEvents.push(args);
      window.__ACA_TRACK_YANDEX_GOAL__ = () => {};
    });
    await submit.click();
    const captured = await page.evaluate(() => ({
      opens: window.__testOpens,
      events: window.__testEvents,
    }));
    assert.equal(captured.opens.length, 1, "one mocked WhatsApp opening");
    const messageUrl = new URL(captured.opens[0][0]);
    assert.equal(messageUrl.origin, "https://wa.me");
    const text = messageUrl.searchParams.get("text");
    for (const part of [
      "Тестовый объект",
      "Тестовая модель",
      "Тестовая компания",
      "+7 700 000 00 00",
      "Тестовая неисправность",
      "Понимаю, что диагностика платная.",
    ])
      assert.ok(text.includes(part));
    const event = captured.events.find(e => e[1] === "form_whatsapp_click");
    assert.equal(event[2].form_source, "b2b_form");
    assert.ok(text.includes(event[2].contact_intent_id));
    assert.doesNotMatch(
      JSON.stringify(event),
      /Тест|700 000|location|phone|model/
    );
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await page.keyboard.press("Enter");
    await dialog.waitFor();
    assert.equal(
      await dialog.getByRole("checkbox").isChecked(),
      false,
      "consent resets on reopen"
    );
    assert.equal(await location.inputValue(), "", "new form starts empty");
    if ([390, 1440].includes(width)) {
      await page.waitForFunction(
        () => document.querySelectorAll("[data-sonner-toast]").length === 0
      );
      await dialog.evaluate(el => (el.scrollTop = 0));
      await page.screenshot({
        path: `${out}/form-empty-${width}.png`,
        animations: "disabled",
      });
      await location.fill("Тестовый объект");
      await model.fill("CAT 330");
      await dialog.evaluate(el => (el.scrollTop = 220));
      await page.screenshot({
        path: `${out}/form-filled-${width}.png`,
        animations: "disabled",
      });
    }
    // Viewport resize approximates the reduced space above a mobile keyboard.
    if (width === 390) {
      await page.setViewportSize({ width, height: 420 });
      await phone.focus();
      await phone.scrollIntoViewIfNeeded();
      const r = await phone.boundingBox();
      assert.ok(r.y >= 0 && r.y + r.height <= 420);
      await phone.fill("+7");
      await page.setViewportSize({ width, height });
    }
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    // Exercise the same fields in the six-step intake without clicking its WhatsApp link.
    const calculator = page.locator("#calculator");
    await calculator
      .locator("button")
      .filter({ has: page.getByText("Экскаватор", { exact: true }) })
      .click();
    await calculator
      .getByLabel("Марка *", { exact: true })
      .selectOption("Caterpillar (CAT)");
    await calculator.getByLabel("Модель *", { exact: true }).fill("330");
    await assertFields(calculator);
    await calculator
      .getByRole("button", { name: "Продолжить →", exact: true })
      .click();
    await calculator
      .getByRole("button", { name: "Теряет мощность", exact: true })
      .click();
    await calculator
      .getByLabel("Коротко опишите неисправность", { exact: true })
      .fill("Тест");
    await assertFields(calculator);
    await calculator
      .getByRole("button", { name: "Продолжить →", exact: true })
      .click();
    await calculator
      .getByLabel("Город / регион *", { exact: true })
      .selectOption("Астана");
    await calculator
      .getByLabel("Объект / район / ближайший населённый пункт", {
        exact: true,
      })
      .fill("Тестовый объект");
    await assertFields(calculator);
    await calculator
      .getByRole("button", { name: "Узнать условия →", exact: true })
      .click();
    await calculator
      .getByRole("button", { name: "Пока не подходит", exact: true })
      .click();
    await calculator
      .getByText("Заявка на выезд не оформлена", { exact: true })
      .waitFor();
    await calculator
      .getByRole("button", { name: "Условия понятны →", exact: true })
      .click();
    await calculator
      .getByLabel("Контактное лицо", { exact: true })
      .fill("Тест");
    const calculatorPhone = calculator.getByLabel("Телефон / WhatsApp *", {
      exact: true,
    });
    await calculatorPhone.fill("+7 700 000 00 00");
    assert.equal(await calculatorPhone.getAttribute("type"), "tel");
    await assertFields(calculator);
    const prepared = new URL(
      await calculator.locator('a[href^="https://wa.me/"]').getAttribute("href")
    );
    assert.ok(prepared.searchParams.get("text").includes("Тестовый объект"));
    if (width === 390)
      await calculator.screenshot({
        path: `${out}/calculator-${width}.png`,
        animations: "disabled",
      });
    await calculator
      .getByRole("button", { name: "← Назад", exact: true })
      .click();
    await calculator
      .getByRole("button", { name: "Условия понятны →", exact: true })
      .click();
    assert.equal(
      await calculatorPhone.inputValue(),
      "+7 700 000 00 00",
      "back preserves entered contact"
    );
    await calculator
      .getByRole("button", { name: "Начать заново", exact: true })
      .click();
    await calculator
      .locator("button")
      .filter({ has: page.getByText("Экскаватор", { exact: true }) })
      .waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      ),
      true
    );
    report.sizes.push({
      width,
      height,
      labels: "pass",
      validation: "pass",
      mockedContact: "pass",
      reopen: "pass",
      calculator: "pass",
    });
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.mutations, []);
} catch (error) {
  report.failure = error.stack;
  throw error;
} finally {
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(report, null, 2));
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  console.log(JSON.stringify(report, null, 2));
}
