# دليل النشر الرسمي لإضافة ScrollFlow على متجر Chrome Web Store
### (Chrome Web Store Step-by-Step Publisher Guide)

هذا الدليل أُعد خصيصاً ليأخذك خطوة بخطوة لرفع ونشر إضافة **ScrollFlow** بنجاح واعتمادها من المراجعة الأولى. كل شيء تم إعداده وتوليده مسبقاً في مجلدات المشروع!

---

## 📦 نظرة عامة على المرفقات الجاهزة في المشروع

| المرفق | المسار في المشروع | الغرض |
|---|---|---|
| **ملف الإضافة المضغوط** | [scrollflow-v1.0.0.zip](file:///d:/ai-projects/scrollflow/scrollflow-v1.0.0.zip) | الملف الذي يُرفع مباشرة للمتجر |
| **النصوص الرسمية الكاملة** | [docs/store-listing.md](file:///d:/ai-projects/scrollflow/docs/store-listing.md) | نصوص المتجر ثنائية اللغة (عربي / إنجليزي) |
| **الأصول البصرية واللقطات** | [store-assets/](file:///d:/ai-projects/scrollflow/store-assets/) | الأيقونة، لافتات المتجر، و 5 لقطات شاشة |
| **تقرير الأمان والأداء** | [docs/audit-report.md](file:///d:/ai-projects/scrollflow/docs/audit-report.md) | تقرير التدقيق والامتثال لسياسات Google |
| **صفحة سياسة الخصوصية** | [docs/privacy-policy.html](file:///d:/ai-projects/scrollflow/docs/privacy-policy.html) | صفحة ويب جاهزة للاستضافة على GitHub Pages |

---

## الخطوة 1: الدخول إلى لوحة تحكم مطوري كروم

1. توجّه إلى: **[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)**
2. سجّل الدخول بحساب Google الخاص بك.
3. إذا كانت هذه أول مرة تنشر فيها، سيُطلب منك دفع رسوم المطور لمرة واحدة فقط (**$5 USD** لمدى الحياة).
4. املأ بيانات المطوّر الأساسية (اسم المطور والبريد الإلكتروني للتواصل).

---

## الخطوة 2: رفع ملف الإضافة (Package Upload)

1. انقر على زر **"عنصر جديد" (New Item)** في الزاوية العلوية.
2. اسحب وأفلت الملف:
   ```text
   scrollflow-v1.0.0.zip
   ```
3. ستقوم Google بفحص الملف تلقائياً والتحقق من `manifest.json`. ستفتح لك صفحة تفاصيل الإضافة مباشرة.

---

## الخطوة 3: تعبئة معلومات صفحة المتجر (Store Listing)

افتح ملف [docs/store-listing.md](file:///d:/ai-projects/scrollflow/docs/store-listing.md) وانسخ القيم التالية للحقول المقابلة:

### 1. اللغة الافتراضية واسم الإضافة:
- **اللغة الافتراضية (Default Language):** اختر **العربية** (أو **English** إذا كنت تفضل أن تكون الإنجليزية هي الأساسية، الإضافة تدعم اللغتين تلقائياً عبر `_locales`).
- **اسم الإضافة (Item Name):**
  ```text
  ScrollFlow — مؤشر القراءة وهوامش المقالات
  ```
  *(بالإنجليزية: `ScrollFlow — Reading Progress & Margin Notes`)*

### 2. الوصف المختصر (Summary) — (أقل من 132 حرفاً):
```text
شريط قراءة ذكي مع هوامش وتظليل ملون، فهرس تلقائي، حفظ الموضع وتصدير لـ Markdown. خفيف، سريع، وخاص 100% بلا خوادم.
```
*(بالإنجليزية: `Smart reading bar with 5-color highlights, auto-TOC, Markdown export, position restore & Zen mode. Fast & 100% private.`)*

### 3. الوصف التفصيلي (Detailed Description):
- انسخ القسم الكامل من [docs/store-listing.md](file:///d:/ai-projects/scrollflow/docs/store-listing.md) تحت عنوان `## 3. الوصف التفصيلي الكامل`.

### 4. الفئة والتصنيف (Category):
- **الفئة الأساسية (Category):** اختر **إنتاجية (Productivity)** أو **أدوات وتخطيط سير العمل (Workflow & Planning)**.

---

## الخطوة 4: رفع الأصول البصرية والصور (Graphic Assets)

توجه إلى قسم **Graphic Assets** في لوحة التحكم، وقم برفع الملفات التالية من مجلد `store-assets/`:

### 1. أيقونة المتجر (Store Icon):
- الحجم: **128 × 128 px**
- ارفع الملف: `store-assets/icon128.png`

### 2. لقطات الشاشة (Screenshots):
- المتجر يتطلب لقطة واحدة على الأقل، ونحن جهزنا **5 لقطات عالية الدقة (1280 × 800 px)**. قم برفعها بالترتيب:
  1. `store-assets/screenshot-1-progress-themes-1280x800.png` (شريط القراءة والثيمات)
  2. `store-assets/screenshot-2-margins-colors-1280x800.png` (الهوامش والتظليل بـ 5 ألوان)
  3. `store-assets/screenshot-3-auto-toc-drawer-1280x800.png` (فهرس العناوين ودرج الفهرس)
  4. `store-assets/screenshot-4-export-zen-1280x800.png` (تصدير Markdown ووضع الزن الهادئ)
  5. `store-assets/screenshot-5-popup-bilingual-1280x800.png` (لوحة التحكم المنبثقة والدعم الثنائي)

### 3. بطاقة الترويج الصغيرة (Small Promo Tile - إلزامي):
- الحجم: **440 × 280 px**
- ارفع الملف: `store-assets/promo-small-440x280.png`

### 4. لافتة المتجر الكبرى (Marquee Promo Tile - ميزة الترويج الرئيسية):
- الحجم: **1400 × 560 px**
- ارفع الملف: `store-assets/promo-marquee-1400x560.png`

---

## الخطوة 5: تبويب الخصوصية والأذونات (Privacy Practices)

> [!IMPORTANT]
> هذا التبويب هو الأكثر أهمية لضمان قبول الإضافة بسرعة دون أي تعليق من مراجعي Google.

انتقل إلى تبويب **Privacy practices** واملأ البيانات كالتالي:

### 1. الغرض الأحادي (Single Purpose):
ألصق هذا النص الإنجليزي في خانة *Single Purpose Description*:
```text
Provide an aesthetic, non-intrusive visual reading-progress indicator for web pages, enable in-page marginalia highlights, auto-generate section navigation ticks, and remember reading positions so users can resume where they left off.
```

### 2. تبرير الأذونات (Permission Justifications):
ألصق التبريرات المقابلة لكل إذن في الحقل المخصص له:
- **`storage`**:
  ```text
  Required to persist user preferences (theme, orientation, toggles), locally saved scroll positions, and user-created bookmarks solely on the local device via chrome.storage.local. No remote database or external transmission is used.
  ```
- **`activeTab`**:
  ```text
  Used only when the user explicitly clicks the extension popup icon to read the active tab's scroll metrics (page screens and estimated reading time) for display in the popup donut interface.
  ```
- **`webNavigation`**:
  ```text
  Used to listen for SPA history state changes (history.pushState / onHistoryStateUpdated) so that scroll positions and bookmarks are preserved and restored accurately per virtual route on modern web apps without reloading.
  ```
- **`Host Permission (<all_urls>)`**:
  ```text
  The extension is a general-purpose reading assistant designed to display a progress indicator and allow marginalia on articles across the web. Content script injection is strictly scoped via Shadow DOM isolation, excludes internal browser and Web Store pages, and sends zero network requests.
  ```

### 3. إفصاح البيانات (Data Usage):
- هل تجمع الإضافة بيانات المستخدم؟ اختر **لا (No)**.
- حدد خيارات الإقرار الإلزامية الثلاثة (Certifications):
  - [x] عدم بيع بيانات المستخدم لأطراف ثالثة.
  - [x] عدم استخدام البيانات لأغراض خارج النطاق المعلن للإضافة.
  - [x] عدم استخدام البيانات لأغراض تحديد الجدارة الائتمانية أو الإقراض.

### 4. رابط سياسة الخصوصية (Privacy Policy URL):
تتطلب Google رابطاً عاماً (`https://...`). يمكنك استضافة ملف [docs/privacy-policy.html](file:///d:/ai-projects/scrollflow/docs/privacy-policy.html) مجاناً وبسهولة عبر:
- **GitHub Pages:** في مستودعك `7usien/scrollflow`:
  1. ادخل إلى **Settings** > **Pages**.
  2. اختر فرع `main` ومجلد `/docs`.
  3. سيكون رابط سياسة الخصوصية فوراً:
     `https://7usien.github.io/scrollflow/privacy-policy.html`
- **أو عبر GitHub Gist:** انسخ محتوى `docs/privacy-policy.md` في Gist جديد وشاركه كرابط عام.

---

## الخطوة 6: الإرسال للمراجعة (Submit for Review)

1. انقر على **"حفظ كمسودة" (Save Draft)**.
2. انقر على زر **"إرسال للمراجعة" (Submit for Review)** الأزرق في أعلى الصفحة.
3. ستظهر لك نافذة تأكيد تسألك إذا كنت تريد النشر التلقائي فور الموافقة (Auto-publish) أو النشر اليدوي. اختر ما يناسبك ثم اضغط **Submit**.

⏱️ **مدة المراجعة المعتادة:** تستغرق مراجعة Google للإضافات الخالية من الصلاحيات الخطرة بين **24 إلى 48 ساعة** عمل. ونظراً لأن كود ScrollFlow نظيف 100% ولا يحتوي على أي أكواد خارجية، فإن فرص القبول السريع ممتازة جداً.
