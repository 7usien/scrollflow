# Chrome Web Store — حزمة نصوص النشر وإفصاحات المراجعة (Store Listing & Review Kit)

> وثيقة متكاملة ومحدّثة باللغتين العربية والإنجليزية لمتجر إضافات كروم (Chrome Web Store)، مصاغة بدقة واحترافية لتلائم كافة متطلبات مراجعة Google وسياسات متجر كروم للمطورين.

---

## 1. بيانات المتجر الأساسية (Store Metadata)

| البند / Item | القيمة / Value |
|---|---|
| **الفئة الأساسية (Category)** | إنتاجية (Productivity) |
| **الفئة الفرعية (Sub-category)** | تخطيط وسير العمل (Workflow & Planning) |
| **اللغات المدعومة (Supported Languages)** | العربية (اللغة الافتراضية `ar`)، الإنجليزية (`en`) |
| **التسعير (Pricing)** | مجانية 100% ومفتوحة المصدر (Free & Open Source) |
| **الفئة العمرية (Content Rating)** | الجميع (Everyone) |

---

## 2. الاسم والعنوان (Title — Max 45 Chars)

### باللغة العربية (Arabic Options):
* **الخيار الأول (الموصى به - 41 حرفًا):**
  ```text
  ScrollFlow — مؤشر القراءة وهوامش المقالات
  ```
  *(41 حرفًا شاملاً المسافات والفاصلة)*
* **الخيار الثاني (37 حرفًا):**
  ```text
  ScrollFlow — شريط القراءة وحفظ الموضع
  ```
  *(37 حرفًا شاملاً المسافات والفاصلة)*

### باللغة الإنجليزية (English Options):
* **Option 1 (Recommended - 44 chars):**
  ```text
  ScrollFlow — Reading Progress & Margin Notes
  ```
  *(44 characters including spaces & dash)*
* **Option 2 (38 chars):**
  ```text
  ScrollFlow — Smart Reading Bar & Notes
  ```
  *(38 characters including spaces & dash)*

---

## 3. الوصف القصير (Summary / Short Description — Max 132 Chars)

> ⚠️ **تنبيه صارم من Google:** متجر كروم يرفض أي نص يتجاوز 132 حرفاً بدقة. تم التحقق من أطوال النصوص برمجياً.

### باللغة العربية (Arabic Options):
* **الخيار الأول (الموصى به - 113 حرفًا):**
  ```text
  شريط قراءة ذكي مع هوامش وتظليل ملون، فهرس تلقائي، حفظ الموضع وتصدير لـ Markdown. خفيف، سريع، وخاص 100% بلا خوادم.
  ```
  *(113 حرفًا — مؤهل بنسبة 100% ومطابق للحد الأقصى 132)*
* **الخيار الثاني (111 حرفًا):**
  ```text
  مؤشر قراءة ذكي مع هوامش ملونة، فهرس تلقائي، حفظ موضع التصفح وتصدير Markdown. سريع، خفيف، وخاص 100% بلا أي تتبع.
  ```
  *(111 حرفًا)*

### باللغة الإنجليزية (English Options):
* **Option 1 (Recommended - 119 chars):**
  ```text
  Smart reading bar with 5-color highlights, auto-TOC, Markdown export, position restore & Zen mode. Fast & 100% private.
  ```
  *(119 characters — fully compliant with the 132 max limit)*
* **Option 2 (126 chars):**
  ```text
  Smart reading progress bar with 5-color margin notes, auto-TOC, position restore & Markdown export. Ultra-fast & 100% private.
  ```
  *(126 characters)*

---

## 4. الوصف التفصيلي باللغة الإنجليزية (Detailed Description — EN)

```markdown
**Upgrade your web reading experience with a smart reading bar, color-coded margin notes, instant table of contents, and seamless position recovery — 100% private and offline.**

Whether you are reading long technical documentation, academic papers, research essays, or deep-dive articles, **ScrollFlow** transforms your browser into an elegant, distraction-free reading canvas. It quietly anchors your reading progress, lets you highlight and annotate insights in 5 curated colors, extracts an instant chapter index, and exports your study notes to Notion or Obsidian with a single click.

---

### 🌟 KEY FEATURES

#### 📊 1. Smart Adaptive Reading Progress Bar
- **Unobtrusive & Responsive:** Visualizes your exact reading percentage along the screen edge without covering body text.
- **Customizable Placement:** Position it horizontally (Top / Bottom) or vertically (Left / Right).
- **Flexible Geometries:** Choose between Floating Centered (60%), Full Length (100%), and corner radiuses (Subtle 6px, Pill Capsule 999px, Sharp 2px).
- **Optional Native Scrollbar Replacement:** Cleanly hides bulky OS scrollbars with smooth scrolling behavior.

#### 🎨 2. Six Handcrafted Color Themes
- **Curated Aesthetics:** Switch between **Aurora** (Cosmic Gradient), **Sunset** (Warm Amber), **Cyberpunk** (Neon Cyan/Magenta), **Minimal** (Ultra-thin subtle line), **Glass Pill** (Frosted Glass backdrop), and **Mono** (Classic slate gray).
- **Adaptive Contrast:** Automatically balances tone against dark mode and light mode web pages.

#### 🖍️ 3. Five-Color Margin Notes & Text Highlighting
- **Highlight Instantly:** Select any text to reveal a sleek floating bubble with 5 vivid pastel colors (Yellow, Green, Purple, Blue, Red).
- **Interactive Navigation Dots:** Your annotated quotes appear as glowing markers on the progress rail. Hover over any dot to see an instant snippet preview card.
- **Click to Jump:** Click any margin dot to smoothly glide directly to that exact paragraph.
- **Zero DOM Pollution:** All UI elements live in an isolated Shadow Root — web page layout, styles, and scripts remain 100% untouched.

#### 📑 4. Auto-Generated Table of Contents (Auto-TOC)
- **Instant Chapter Map:** Automatically detects semantic page headings (H1, H2, H3) and places subtle tick marks along the progress bar.
- **Quick-Access Drawer:** Open the side menu to view an interactive outline of the entire document with real-time reading progress for each section.

#### 📝 5. One-Click Markdown Export (Notion & Obsidian Ready)
- **Instant Clipboard Export:** Export all saved quotes, margin notes, timestamps, percentages, and page titles formatted in clean Markdown.
- **Ready for Your Knowledge Base:** Paste directly into **Notion**, **Obsidian**, **Bear**, **Logseq**, or **Apple Notes** with complete source links and structure.

#### 🧘 6. Zen Auto-Hide Mode
- **Distraction-Free Immersion:** When you pause scrolling for 2.5 seconds to focus on reading, the indicator and markers gently fade away.
- **Instant Recall:** Resurfaces smoothly as soon as you scroll, move your mouse, or hit a navigation key.

#### 🔖 7. Never Lose Your Place (Smart Position Restore)
- **Automatic Bookmark:** Remembers your exact reading position across thousands of articles and documentation pages.
- **SPA & Dynamic Web Friendly:** Fully compatible with Single Page Applications (React, Next.js, Vue, Docs sites) by tracking `history.pushState` changes.
- **Polite Toast Notification:** Reopens the page with a gentle "Resumed where you left off" indicator without ever overriding manual scrolling.

#### ⏱️ 8. Reading Metrics & Quick Back-to-Top
- **Estimated Reading Time:** Calculates reading time based on human words-per-minute metrics.
- **Screen Depth Counter:** See page length measured in viewport screens.
- **Discreet Back-to-Top:** One-click smooth return to the beginning of the article.

---

### 🛡️ PRIVACY BY ARCHITECTURE (Zero Tracking, Zero Servers)

We believe reading should be completely personal. ScrollFlow is engineered with a strict **Zero-Knowledge Architecture**:
- ❌ **NO Remote Servers:** There is no backend, no cloud database, and no server infrastructure.
- ❌ **NO Telemetry or Analytics:** No Google Analytics, no tracking scripts, no cookies, and no fingerprinting.
- ❌ **NO Data Selling or Sharing:** Your reading habits, URLs, highlights, and notes never leave your personal computer.
- ❌ **NO Third-Party Runtime Dependencies:** 0 external libraries, < 20KB gzipped, ultra-fast and lightweight.
- ✅ **100% Local Storage:** All positions, notes, and preferences reside exclusively in `chrome.storage.local`.
- ✅ **Full User Control:** Clear all saved data or disable the extension for specific domains with one click.

---

### 💡 PERFECT FOR:
- **Researchers & Academics:** Annotate long papers and synthesize notes into Obsidian or Notion.
- **Software Engineers:** Navigate complex API documentation and long GitHub pull requests with Auto-TOC.
- **Students & Writers:** Keep track of reading goals and extract study quotes cleanly.
- **Casual & Book Readers:** Never lose your spot in serialized blogs, newsletters, and long-form journalism.

---

### ⌨️ KEYBOARD SHORTCUTS
- **Alt + Shift + P:** Toggle ScrollFlow overlay visibility on/off anytime.
- Customizable via `chrome://extensions/shortcuts`.
```

---

## 5. الوصف التفصيلي باللغة العربية (Detailed Description — AR)

```markdown
**ارتقِ بتجربة قراءة المقالات والتوثيقات البرمجية على الويب: مؤشر قراءة ذكي، هوامش وتظليل ملون، فهرس تلقائي، واستعادة ذكية لموضعك — خفيف، أنيق، وخاص 100% داخل جهازك.**

سواء كنت تقرأ توثيقاً برمجياً طويلاً، أو بحثاً أكاديمياً، أو مقالات رأي متعمقة، أو نشرات بريدية مطولة؛ يحول **ScrollFlow** متصفحك إلى بيئة قراءة هادئة واحترافية. يوضح لك نسبة تقدمك بدقة بالغة، ويتيح لك تظليل النصوص وتدوين الهوامش بخمسة ألوان منتقاة، وينشئ فهرساً تلقائياً لعناوين المقال، مع إمكانية تصدير ملاحظاتك إلى Notion أو Obsidian بنقرة واحدة!

---

### 🌟 أبرز المزايا والمواصفات

#### 📊 1. مؤشر قراءة ذكي وتكيفي
- **خفيف وغير حاجب:** يُظهر نسبة القراءة المئوية على حافة الشاشة بتصميم زجاجي أنيق دون تغطية أي جزء من محتوى الصفحة.
- **حرية كاملة في الموضع:** يمكن وضعه أفقياً (أعلى أو أسفل الشاشة) أو رأسياً (يمين أو يسار الشاشة).
- **أشكال هندسية متعددة:** اختر بين الشريط العائم المتمركز (60%) أو الطول الكامل (100%)، مع تحكم كامل بنصف قطر الحواف (دائرية خفيفة 6px، كبسولة كاملة 999px، أو حادة 2px).
- **إخفاء شريط المتصفح الأصلي:** إمكانية إخفاء شريط التمرير التقليدي لنظام التشغيل لتجربة تصفح غامرة وسلسة.

#### 🎨 2. ستة ثيمات مظهر مصممة بعناية
- **تنوع بصري ساحر:** ثيم **Aurora** (تدرج أورورا الكوني)، **Sunset** (دفء ألوان الغروب)، **Cyberpunk** (نيون متوهج)، **Minimal** (خط نحيف وبسيط)، **Glass Pill** (تأثير الزجاج المصنفر)، و**Mono** (الرمادي الكلاسيكي).
- **تباين ذكي:** ينسجم تلقائياً مع خلفيات الصفحات سواء كانت في الوضع الليلي (Dark Mode) أو الفاتح (Light Mode).

#### 🖍️ 3. هوامش وتظليل النصوص بـ 5 ألوان (Marginalia)
- **تظليل فوري:** ما عليك سوى تحديد أي فقرة نصية لتظهر كبسولة عائمة تتيح حفظ النص وتظليله بخمسة ألوان مريحة للعين (أصفر، أخضر، بنفسجي، أزرق، أحمر).
- **نقاط تنقل تفاعلية:** تظهر مقتطفاتك كهوامش مضيئة على مسار شريط التمرير. بمجرد تمرير الماوس فوق أي نقطة، تظهر بطاقة معاينة أنيقة لمقتطف النص.
- **قفز فوري:** انقر على أي هامش لتنتقل فوراً وبسلاسة إلى موضع الفقرة داخل المقال.
- **عزل تام للأنماط (Shadow DOM):** كافة عناصر الإضافة معزولة داخل Shadow Root مستقل، مما يضمن عدم المساس بكود أو تصميم أو سرعة الموقع الأصلي.

#### 📑 4. فهرس العناوين التلقائي (Auto-TOC)
- **خريطة تفاعلية للمحتوى:** تتعرف الإضافة تلقائياً على العناوين الهيكلية للمقال (H1, H2, H3) وتضع علامات فصول خفيفة على مسار الشريط.
- **درج جانبي سريع:** افتح قائمة الهوامش لتستعرض فهرس فصول المقال الكامل مع نسبة التقدم في كل قسم والقفز بنقرة واحدة.

#### 📝 5. تصدير الملاحظات إلى Markdown بنقرة واحدة
- **تصدير فوري للحافظة (Clipboard):** انسخ كافة اقتباساتك وهوامشك مصنفة حسب ألوانها ونسبتها المئوية ورابط الصفحة بتنسيق Markdown قياسي ونظيف.
- **جاهز لتطبيقاتك المفضلة:** الصق الملاحظات مباشرة داخل **Notion** أو **Obsidian** أو **Logseq** أو **Bear** كملخص منظم للقراءة والدراسة.

#### 🧘 6. وضع القراءة الهادئ (Zen Auto-Hide)
- **تركيز بلا تشتيت:** عند التوقف عن التمرير لمدة 2.5 ثانية للاندماج في القراءة، يتلاشى الشريط والنقاط بلطف ليترك لك كامل مساحة الشاشة.
- **استجابة فورية:** يعود الشريط للظهور بنعومة تامة بمجرد لمس عجلة الماوس أو التمرير أو تحريك المؤشر.

#### 🔖 7. حفظ واستعادة موضع التمرير تلقائياً
- **لا تفقد مكانك أبداً:** تحفظ الإضافة موضع توقفك في آلاف المقالات والصفحات.
- **دعم كامل لتطبيقات الصفحة الواحدة (SPA):** يتعرف بدقة على تنقلات المسار الداخلية (React, Next.js, Vue) ويحفظ موضع كل صفحة على حدة.
- **إشعار استعادة مهذب:** عند العودة للصفحة يُعيدك تلقائياً إلى موضعك مع إشعار خفيف دون أن يقاطع تمريرك اليدوي إن أردت تجاوزه.

#### ⏱️ 8. مؤشرات القراءة وزر الصعود للأعلى
- **تقدير وقت القراءة:** قياس سرعة القراءة بناءً على معدل الكلمات في الدقيقة.
- **عمق الصفحة بعدد الشاشات:** تعرف على طول المقال بدقة لمعرفة الوقت المتبقي لإكماله.
- **زر الصعود للأعلى (Back to Top):** زر عائم مدمج وذكي يعيدك إلى قمة الصفحة بسلاسة.
- **احتفال خفيف عند الإنجاز:** وميض احتفالي بالكونفيتي عند وصولك إلى 100% من المقال الطويل (يمكن إيقافه بحرية).

---

### 🛡️ الخصوصية أولاً وبشكل قاطع (Zero Tracking, Zero Servers)

نؤمن بأن قراءتك وملاحظاتك ملكك وحدك. صُممت ScrollFlow وفق مبدأ **انعدام المعرفة التام (Zero-Knowledge Architecture)**:
- ❌ **لا خوادم خارجية:** لا يوجد خادم، ولا قاعدة بيانات سحابية، ولا أي وسيط خارجي.
- ❌ **لا تحليلات ولا تتبع:** لا نستخدم Google Analytics، ولا ملفات تعريف ارتباط (Cookies)، ولا نجمع أي بصمة للمتصفح.
- ❌ **لا بيع ولا مشاركة للبيانات:** روابط المقالات وهوامشك لا تغادر جهازك الشخصي إطلاقاً.
- ❌ **صفر مكتبات خارجية:** كود مكتوب بلغة TypeScript نقية بحجم يقل عن 20 كيلوبايت، وسرعة فائقة لا تؤثر على موارد جهازك.
- ✅ **تخزين محلي 100%:** كافة الإعدادات والملاحظات تحفظ داخل مساحة `chrome.storage.local` في متصفحك.
- ✅ **تحكم كامل بالحذف:** زر مسح شامل للملاحظات والمواضع بضغطة واحدة، وإمكانية تعطيل الإضافة لأي نطاق تختاره.

---

### 💡 الإضافة المثالية لكل من:
- **المبرمجين والمطورين:** لمتابعة التوثيقات التقنية ومراجعة التغييرات الطويلة على GitHub.
- **الباحثين وطلبة الجامعات:** لتظليل الاقتباسات وحفظ الهوامش وتصديرها مباشرة لأدوات البحث كـ Notion وObsidian.
- **القرّاء والكتّاب:** للاستمتاع بالمقالات المعمقة دون فقدان فقرة التوقف ودون تشتيت بصري.

---

### ⌨️ اختصارات لوحة المفاتيح
- **Alt + Shift + P:** إظهار أو إخفاء شريط ومؤشرات ScrollFlow في أي لحظة.
- يمكن تخصيص الاختصار بسهولة عبر: `chrome://extensions/shortcuts`.
```

---

## 6. بيان الغرض الأحادي (Single Purpose Statement)

> **Mandatory for Chrome Web Store Review Compliance:**

```text
ScrollFlow has a single, focused purpose: to enhance the reading experience of long-form web articles and documentation by providing an unobtrusive visual reading progress bar, an auto-generated table of contents, and locally-stored margin notes that allow users to track progress, annotate key excerpts, and seamlessly resume where they left off.
```

---

## 7. تبريرات الأذونات الفنية المفصلة (Technical Permission Justifications)

> تُقدَّم هذه النصوص حرفياً في خانات تبرير الأذونات (Permission Justifications) بلوحة تحكم مطوري متجر كروم (Chrome Web Store Developer Dashboard):

### 1. إذن `storage`
* **Justification for Reviewers:**
  ```text
  The 'storage' permission is required strictly to persist user display preferences (active theme, bar position, edge thickness, Zen auto-hide mode, celebration toggle) and per-URL reading state (scroll position percentage, auto-generated outline state, and color-coded text margin notes) locally on the user's machine using chrome.storage.local. All data remains exclusively within the user's browser, is never transferred to any remote server or external service, and can be cleared by the user at any time.
  ```

### 2. إذن `activeTab`
* **Justification for Reviewers:**
  ```text
  The 'activeTab' permission is invoked only when the user explicitly clicks the ScrollFlow extension action icon to open the popup interface. It allows the popup to inspect the active tab's current URL, title, and scroll metrics in order to display relevant reading statistics (estimated reading time, page length in viewports, and saved bookmark counts), and to provide a quick one-click toggle for whitelisting or blacklisting the active domain.
  ```

### 3. إذن `webNavigation`
* **Justification for Reviewers:**
  ```text
  The 'webNavigation' permission (specifically listening to onCommitted and onHistoryStateUpdated events) is necessary to support modern Single Page Applications (SPAs built with React, Next.js, Vue, Angular, etc.). SPAs change document paths and content dynamically via the HTML5 History API (pushState/replaceState) without triggering a full page reload. By observing navigation state updates, ScrollFlow accurately saves, attributes, and restores reading positions and margin notes for individual article routes rather than erroneously applying a single scroll position to an entire web application.
  ```

### 4. إذن الوصول للمواقع (`content_scripts` on `<all_urls>` host permission)
* **Justification for Reviewers:**
  ```text
  ScrollFlow is designed to serve as a universal reading companion across the open web, functioning on any arbitrary blog, news publication, research portal, or technical documentation site the user chooses to read. Injecting content scripts across web pages is necessary to measure the viewport and scroll progress, observe semantic headings (H1-H3) for the table of contents, and render the reading progress bar and highlight selection bubble inside an isolated Shadow DOM.

  Rigorous security and privacy boundaries are enforced:
  1. Sensitive browser internal schemes (chrome://*, chrome-extension://*, edge://*, about:*) and the Chrome Web Store (*://chromewebstore.google.com/*, *://chrome.google.com/webstore/*) are strictly hard-excluded in the manifest configuration.
  2. Users have granular per-domain controls directly in the extension popup to disable ScrollFlow on any specific website.
  3. No page content, form inputs, passwords, or personal identity information are ever harvested, logged, or communicated over the network.
  ```

### 5. ملاحظة الحافظة (Clipboard API for Markdown Export)
* **Technical Note for Reviewers:**
  ```text
  Exporting margin notes to Markdown utilizes the standard client-side Web API navigator.clipboard.writeText. It is strictly triggered by explicit user clicks on the "Export to Markdown" button within the bookmarks menu. It operates 100% locally and does not require or declare extra elevated clipboard permissions.
  ```

---

## 8. الكلمات المفتاحية والتصنيف (Keywords & Categorization)

### الكلمات المفتاحية باللغة الإنجليزية (English Keywords):
```text
reading progress, scroll position, margin notes, text highlighter, table of contents, auto toc, notion export, obsidian, markdown export, zen mode, reading bar, smooth scroll, back to top, reading time, study notes, productivity
```

### الكلمات المفتاحية باللغة العربية (Arabic Keywords):
```text
مؤشر القراءة, شريط التمرير, حفظ موضع القراءة, هوامش المقالات, تظليل النصوص, فهرس المقال, تصدير ماركداون, نوشن, أوبسيديان, وضع الزن, وقت القراءة, سكرول, إضافة قراءة, إنتاجية
```

---

## 9. دليل إفصاح استخدام البيانات والخصوصية (CWS Data Usage & Privacy Disclosure Guide)

عند ملء تبويب **Privacy practices** في لوحة مطوري متجر كروم (Chrome Web Store Developer Dashboard)، اتبع الإجابات المحددة التالية لضمان القبول الفوري دون تأخير:

### أ. بيان الغرض الأحادي (Single Purpose):
* **السؤال:** أقرّ بأن الإضافة تلتزم بسياسة الغرض الأحادي (Single Purpose policy).
* **الإجابة:** **نعم (Yes)**، مع وضع نص الـ Single Purpose الموضح في القسم رقم 6 أعلاه.

### ب. مبررات الأذونات (Permission Justification):
* الصق تبرير كل إذن من القسم رقم 7 أعلاه في الخانة المخصصة له.

### ج. إقرار جمع البيانات (Data Collection Questions):
* **هل تجمع الإضافة بيانات المستخدمين؟ (Do you collect user data?):**
  ➜ **لا (No)**. الإضافة لا تجمع أي بيانات شخصية، ولا معرّفات، ولا بيانات تصفح خارج الجهاز.
* **إقرارات الامتثال الإلزامية (Certifications):**
  1. **بيع البيانات:** أقر بأنني لا أبيع بيانات المستخدمين لأي طرف ثالث ➜ **نعم (Check / Confirm)**.
  2. **الاستخدام غير المعلن:** أقر بأنني لا أستخدم بيانات المستخدمين لأي غرض لا يرتبط بالغرض الأحادي الأساسي ➜ **نعم (Check / Confirm)**.
  3. **الجدارة الائتمانية والإقراض:** أقر بأنني لا أستخدم بيانات المستخدمين لتحديد الجدارة الائتمانية أو لأغراض الإقراض ➜ **نعم (Check / Confirm)**.

### د. رابط سياسة الخصوصية (Privacy Policy URL):
* أدخل الرابط المباشر لصفحة الخصوصية المستضافة على GitHub Pages:
  ```text
  https://<YOUR-GITHUB-USERNAME>.github.io/scrollflow/docs/privacy-policy.html
  ```
  *(أو الرابط الدائم المستضاف في المستودع)*

---

## 10. دليل اللقطات الإعلانية والتصاميم (Store Visual Assets Spec)

لتحقيق أعلى نسبة نقر وتحميل (CTR) في المتجر، يجب إعداد اللقطات بالأبعاد التالية:

| نوع الصورة | الأبعاد المطلوبة | الوصف والمحتوى المقترح |
|---|---|---|
| **Screenshot 1 (البطل / Hero)** | 1280 × 800 px | شريط ScrollFlow على مقال تقني طويل، يبرز مؤشر النسبة المئوية وثيم Aurora المتوهج. |
| **Screenshot 2 (الهوامش والتظليل)** | 1280 × 800 px | كبسولة التظليل العائمة بـ 5 ألوان على نص محدد، مع نقاط الهوامش وبطاقة المعاينة. |
| **Screenshot 3 (الفهرس والتصدير)** | 1280 × 800 px | درج الفهرس السريع مفتوحاً يُظهر فهرس العناوين H1-H3 مع زر التصدير لـ Markdown الموجه لـ Notion / Obsidian. |
| **Screenshot 4 (الوضع الهادئ والثيمات)** | 1280 × 800 px | استعراض الثيمات الستة (Sunset, Cyberpunk, Glass, Minimal, Mono) مع وضع الزن التلقائي. |
| **Screenshot 5 (لوحة التحكم السريعة)** | 1280 × 800 px | نافذة الـ Popup تُظهر إحصائيات القراءة (وقت القراءة، عدد الشاشات) مع خيارات التحكم وحماية الخصوصية. |
| **Small Promo Tile (الأيقونة الترويجية)** | 440 × 280 px | شعار ScrollFlow الزجاجي العصري مع تدرج لوني انسيابي وخلفية داكنة فخمة. |
| **Marquee Promo Tile (البانر الرئيسي)** | 1400 × 560 px | بانر ترويجي فسيح يبرز شعار الإضافة: "Read Smarter. Annotate Instantly. 100% Private." |
