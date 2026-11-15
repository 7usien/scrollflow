# 📜 ScrollFlow — وثيقة متطلبات المنتج (PRD) ومواصفات SDD

> **الإصدار:** 1.0 — **التاريخ:** 2026-11-15
> **الحالة:** ✅ جاهز للتنفيذ (Ready for Implementation)
> **الجمهور المستهدف:** Coding Agent / مطوّر الواجهة الأمامية
> **منهجية البناء:** SDD — Spec-Driven Development (المواصفة هي مصدر الحقيقة الوحيد)

---

## 0. كيف تُقرأ هذه الوثيقة (تعليمات للـ Coding Agent)

هذه الوثيقة مكتوبة لتُنفَّذ حرفيًا. اتبع القواعد التالية:

1. **الترتيب إلزامي:** `§9 المعمارية` ➜ `§10 نموذج البيانات` ➜ `§11 الخوارزميات` ➜ `§16 المهام (tasks)`.
2. **لا تخترع سلوكًا غير مذكور.** أي حالة غير مغطاة ➜ اتبع `§0.1 قواعد الحسم التلقائي` أدناه، ودوّنها في ملف `DECISIONS.md` داخل المشروع.
3. **كل متطلب وظيفي (FR) يجب أن يقابله:** كود + اختبار. المهام في `§16` مرتبطة بأرقام المتطلبات.
4. **لا تُضِف مكتبات خارجية** (لا React، لا Framer Motion، لا canvas-confetti). الهدف: < 30KB غير مضغوط، صفر طلبات شبكة.
5. **لا تعطِّل أي وظيفة أصلية في الصفحة.** الإضافة طبقة مراقبة فقط (observer-only).
6. **اللغة:** نصوص الإضافة (UI strings) عربية وإنجليزية عبر `i18n`، والكود والتعليقات بالإنجليزية.
7. عند أي تعارض بين الأقسام: `§7 المتطلبات الوظيفية` أعلى سلطة، ثم `§11`.

### 0.1 قواعد الحسم التلقائي (عند الغموض)
| الحالة | القرار الافتراضي |
|---|---|
| موقع يكسر التصميم | لا تُصلح الموقع؛ فقط أضف نمط `safe` (بلا blur) تلقائيًا |
| صفحة لا يمكن قياسها | أخفِ الشريط بالكامل، لا تُظهر أخطاء للمستخدم |
| تعارض مع إضافة أخرى | لا تحاول؛ لا `z-index` حربي — استخدم `2147483000` فقط |
| سلوك غير محدد في الوصولية | طبّق معيار WCAG 2.2 AA كحد أدنى |

---

## 1. الملخص التنفيذي (Executive Summary)

**ScrollFlow** إضافة لـ Chrome (Manifest V3) تُضيف **مؤشر تقدّم قراءة رأسي (Vertical Reading Progress)** أنيق على حافة الشاشة اليمنى، يعكس نسبة ما قرأه المستخدم من الصفحة الحالية، ويحتفظ **بموضع التمرير (Scroll Position)** لكل صفحة بحيث يعود المستخدم إليها من حيث توقّف، مع **احتفال Confetti** بسيط عند الوصول إلى نهاية الصفحة كحافز نفسي للاستمرار.

**الفكرة في سطر:** *"نسبة إنجازك في قراءة أي صفحة، أمام عينك دائمًا — ولا تفقد مكانك أبدًا."*

**لماذا قد ينجح؟** التمرير هو أكثر تفاعل يقوم به المستخدم على الويب، ومع ذلك لا يوجد أي تغذية راجعة (feedback) على «التقدّم». التقدّم المرئي يولّد دافعًا للإكمال (Zeigarnik effect + Goal Gradient Effect). إضافات مشابهة موجودة لكنها إما بدائية الشكل، أو ثقيلة، أو تفتقد ميزة العودة إلى الموضع.

---

## 2. المشكلة والفرصة

### 2.1 المشكلة
| # | المشكلة | الأثر على المستخدم |
|---|---|---|
| P1 | المستخدم لا يعرف كم بقي من صفحة طويلة (مقال، توثيق، منشور منتدى، نتائج بحث) | إحباط، مغادرة مبكرة، تمرير عشوائي |
| P2 | فقدان الموضع عند العودة لصفحة قرأها جزئيًا | إعادة قراءة غير ضرورية، أو فقدان مكان مهم |
| P3 | الصفحات الطويلة (Infinite Scroll / توثيق تقني) تُشعر بالضياع | توهان، ضعف الإحساس بالإنجاز |
| P4 | شريط التمرير الأصلي بلا معنى «تقدّمي» ولا حافز | لا يوجد شعور بالاحتفال بالإنجاز |

### 2.2 الفرصة
- سوق إضافات Chrome يضم ملايين المستخدمين المهتمين بالإنتاجية والقراءة.
- التكلفة التقنية منخفضة جدًا (بدون خادم، بدون حساب، بدون بيانات تُرسل).
- مساحة تمييز واضحة: **تصميم عصري + احتفال + استعادة موضع** في إضافة واحدة خفيفة.

### 2.3 المنافسون (تحليل مختصر)
| المنافس | القوة | الضعف الذي نستغله |
|---|---|---|
| إضافات "Reading Progress" التقليدية | بسيطة | تصميم قديم، بلا Confetti، بلا استعادة موضع |
| استعادة التمرير الأصلية في Chrome | تعمل تلقائيًا | لا تعمل بعد إغلاق التبويب/المتصفح دائمًا، ولا تعطي نسبة مرئية |
| إضافات "Tab Session" | قوية في الحفظ | ثقيلة، خارج سياق القراءة، بلا مؤشر تقدّم |

---

## 3. الأهداف ومقاييس النجاح

### 3.1 أهداف المنتج (Goals)
| # | الهدف | مقياس النجاح (KPI) |
|---|---|---|
| G1 | جعل التقدّم في القراءة مرئيًا دائمًا | 100% من الصفحات القابلة للتمرير تعرض المؤشر خلال ≤ 300ms من `document_idle` |
| G2 | تقليل فقدان الموضع | ≥ 95% نجاح في استعادة الموضع على الصفحات الثابتة (Static) و ≥ 80% على SPA |
| G3 | إحساس بالإنجاز | ≥ 70% من الجلسات التي تصل للنهاية تُظهر Confetti دون إزعاج (لا يتكرر أكثر من مرة/دقيقة) |
| G4 | خفّة مطلقة | تأثير على الـ main thread < 1ms/إطار، حجم الحزمة < 30KB، صفر طلبات شبكة |
| G5 | ثقة وخصوصية | 0 بيانات تُرسل خارج الجهاز؛ صفحة سياسة خصوصية واضحة في الـ Store |

### 3.2 الأهداف غير المشمولة (Non-Goals — صريحة)
- ❌ متصفحات أخرى (Firefox/Safari/Edge) — نسخة 1.0 لـ Chromium فقط (MV3).
- ❌ مزامنة مواضع التمرير بين الأجهزة (sync) — محلية فقط في 1.0.
- ❌ تتبّع إحصاءات قراءة أو لوحة تحليلات.
- ❌ شرح/تلخيص محتوى الصفحة أو مساعد ذكاء اصطناعي.
- ❌ العمل داخل التطبيقات المدمجة (PDF Viewer، Chrome Web Store، صفحات `chrome://`، صفحات `file://` افتراضيًا).
- ❌ استبدال شريط التمرير الأصلي (قرار تصميمي: Overlay فقط في 1.0).
- ❌ حسابات أو تسجيل دخول.

---

## 4. المستخدمون وسيناريوهات الاستخدام

### 4.1 الشخصيات (Personas)
| الشخصية | الوصف | ما يريده |
|---|---|---|
| **سارة — طالبة دراسات عليا** | تقرأ أوراقًا بحثية وتوثيقًا طويلًا يوميًا | تعرف كم بقي، وتعود لمكانها بعد الاجتماع |
| **خالد — مطوّر** | يتنقل بين وثائق تقنية طويلة (MDN, docs) و SPA | استعادة دقيقة للموضع، بلا إزعاج أو بطء |
| **نورة — قارئة محتوى** | تقرأ مقالات طويلة على الجوال/اللابتوب | إحساس بالإنجاز، تصميم جميل لا يشوّش |

### 4.2 سيناريوهات (User Journeys)
**J1 — قراءة مقال طويل:** يفتح مقالًا ← الشريط يظهر على اليمين ويتحرك بسلاسة ← يمرّر ← عند 25/50/75 نبضة خفيفة ← عند النهاية Confetti ← يغلق التبويب.
**J2 — العودة لصفحة:** يفتح تبويبًا جديدًا لنفس الرابط ← خلال 400ms يقفز للـ 62% حيث توقّف ← ظهر تلميح صغير: «عدت إلى حيث توقفت».
**J3 — استثناء موقع:** ينقر أيقونة الإضافة ← «إيقاف على هذا الموقع» ← الشريط يختفي فورًا، والاختيار يُحفظ للمستقبل.
**J4 — صفحة قصيرة:** صفحة بطول 0.6 شاشة ← لا شريط (لا معنى له) ← الأيقونة تُظهر حالة «لا يوجد تمرير».

---

## 5. نطاق الإصدار (Scope)

### 5.1 داخل النطاق — MVP 1.0
- شريط تقدّم رأسي عائم + حالات وحركات.
- قياس طول الصفحة (بعدد الشاشات + وقت قراءة مُقدَّر) في الـ popup.
- حفظ واستعادة موضع التمرير تلقائيًا لكل صفحة.
- Confetti عند الوصول للنهاية + نبضات عند المحطات.
- Popup للتحكم: تشغيل/إيقاف عام، استثناء الموقع الحالي، تمكين/تعطيل الاستعادة والاحتفال، اختيار الثيم (Aurora / Sunset / Mono)، مسح البيانات.
- Badge على أيقونة الإضافة يعرض النسبة.
- دعم RTL/LTR، الوضع الليلي، `prefers-reduced-motion`.
- صفحة إعدادات موسّعة (Options) اختيارية لكن مطلوبة في 1.0 (بسيطة).

### 5.2 خارج النطاق (Backlog لاحقًا)
مزامنة سحابية • قائمة قراءة • إحصاءات محلية للقراءة • أوضاع المؤشر (دائري/أفقي) • دعم Firefox.

---

## 6. تجربة المستخدم والتصميم (UX & Visual Design)

### 6.1 المبدأ البصري
**"طبقة زجاجية رقيقة على حافة الشاشة"**: لا تغطّي المحتوى، لا تُشتّت، لكنها ملحوظة وجميلة. الشريط 6px عرضًا، بمسافة 6px من الحافة، مع تدرّج لوني حيوي وحلقة توهّج على المؤشر.

### 6.2 تشريح الشريط (Anatomy)
```
حافة الشاشة اليمنى
 ┌──────────────────────────┐
 │                        ▌ │ ← 6px من الحافة
 │                        ▓ │ ← Thumb: نقطة 12px + توهّج
 │                        ▓ │
 │                        ░ │ ← Filled: تدرّج Brand
 │                        ░ │
 │                        ░ │ ← Track: زجاج شبه شفاف
 │                        ░ │
 │                        ○ │ ← Cap سفلي
 └──────────────────────────┘
 ارتفاع الشريط = 60vh، متمركز عموديًا، Radius = 999px
```

### 6.3 نظام التصميم (Design Tokens)
| Token | القيمة | الاستخدام |
|---|---|---|
| `--sf-brand-start` | `#6D5BFF` | بداية التدرّج |
| `--sf-brand-mid` | `#4E8CFF` | وسط التدرّج |
| `--sf-brand-end` | `#00D4FF` | نهاية التدرّج |
| `--sf-done` | `#FFD166` | لون الإكمال 100% |
| `--sf-confetti-1..5` | `#6D5BFF` `#00D4FF` `#34E5A0` `#FFD166` `#FF6B9A` | جزيئات الاحتفال |
| `--sf-track` | `rgba(255,255,255,.14)` (داكن) / `rgba(15,18,30,.10)` (فاتح) | مسار الشريط |
| `--sf-surface` | `rgba(17,20,32,.55)` | سطح البوب-أب |
| `--sf-blur` | `blur(12px)` | زجاجية |
| `--sf-text` | `#E9ECF5` / `#141824` | نص |
| `--sf-radius` | `999px` (bar) / `16px` (popup) | استدارة |
| `--sf-shadow` | `0 8px 32px rgba(0,0,0,.28)` | ظل |
| الحركة السريعة | `180ms cubic-bezier(.4,0,.2,1)` | Hover |
| حركة النبضة | `240ms cubic-bezier(.34,1.56,.64,1)` | Milestone |
| مدة الاحتفال | `1600–2200ms` | Confetti |

**الثيمات الثلاثة (تُطبَّق عبر تبديل المتغيّرات فقط):**
| الثيم | brand-start → end | الوصف |
|---|---|---|
| **Aurora** (افتراضي) | `#6D5BFF` → `#00D4FF` | بنفسجي–سماوي، عصري وحيوي |
| **Sunset** | `#FF6B9A` → `#FFB86B` | وردي–برتقالي، دافئ |
| **Mono** | `#8E9AAF` → `#DDE3EE` | رمادي أنيق، للمواقع الحساسة بصريًا |

### 6.4 حالات الشريط (States)
| الحالة | الوصف | التفاصيل |
|---|---|---|
| `hidden` | لا يوجد شريط | صفحة غير قابلة للتمرير (< 1.2 شاشة) أو الموقع مستثنى أو الإضافة معطّلة |
| `idle` | ظاهر بشفافية 0.75 | تختفي الشفافية الزائدة عند عدم التمرير لمدة 2.5s ➜ يصل الشريط إلى `opacity: .55` و`width: 4px` |
| `active` | شفافية 1 و`width: 8px` | عند التمرير (خلال 600ms من آخر حدث تمرير) |
| `hover` | `width: 10px` + ظهور تسمية النسبة `%62` | التسمية: pill صغير بجانب الشريط، يظهر بـ fade+slide 8px |
| `milestone` | نبضة واحدة: scale 1→1.12→1 + وميض توهّج | عند عبور 25/50/75 لأول مرة في الصفحة |
| `complete` | لون `--sf-done` + Confetti + تلميح «أكملت الصفحة 🎉» | عند ≥ 99.5% |
| `restored` | تلميح صغير «عدت إلى حيث توقفت» لمدة 2.5s | بعد الاستعادة الناجحة فقط |

### 6.5 Buildup البوب-أب (Popup) — 340×420px
```
┌────────────────────────────────┐
│  ScrollFlow            [⚙]     │  Header + شعار
│  ────────────────────────────  │
│   ◜◝ 62%                       │  حلقة تقدّم كبيرة (donut)
│   صفحة طويلة · 7.4 شاشة        │  قياس طول الصفحة
│   وقت قراءة مُقدَّر: 11 دقيقة   │
│   ────────────────────────────  │
│  [⏸ إيقاف على هذا الموقع]      │  زر استثناء الموقع الحالي (toggle)
│  ────────────────────────────  │
│  استعادة موضع التمرير   [ON ●] │  Toggle
│  احتفال عند الإكمال     [ON ●] │  Toggle
│  المؤشر                  [▼ Aurora] │ Select
│  ────────────────────────────  │
│  [مسح بيانات التمرير]          │  زر ثانوي + تأكيد
└────────────────────────────────┘
```

### 6.6 Confetti — المواصفة الدقيقة
| البند | القيمة |
|---|---|
| التقنية | `<canvas>` واحد بحجم viewport، `devicePixelRatio`-aware، داخل Shadow DOM |
| نقطة الانطلاق | على الحافة نفسها (`innerWidth - 8`) وعلى ارتفاع **88% من ارتفاع الشاشة** — أي أسفل الشريط، لا مركز الشاشة، كي لا تُغطّى القراءة |
| العدد | `clamp(60, floor(viewportWidth / 10), 140)` |
| الأشكال | 3 أنواع: مستطيل 60%، دائرة 30%، مثلث 10% |
| الحجم | 4–9px |
| السرعة الابتدائية | x ∈ [-4.5, 4.5]، y ∈ [-11, -5] px/frame@60fps |
| الجاذبية | +0.32 px/frame² |
| مقاومة الهواء | ×0.995 لكل إطار |
| الدوران | زاوية عشوائية + `±0.22 rad/frame`، مع تدوير 3D محاكى بـ `scaleX(cos θ)` |
| التلاشي | آخر 25% من العمر عبر `globalAlpha` |
| المدة | 1600–2200ms، ثم تنظيف كامل (إزالة canvas وإلغاء rAF) |
| الأداء | إطار واحد فقط يعمل في كل مرة، يتوقف عند `document.hidden` |
| التكرار | مرة واحدة لكل (URL + جلسة تبويب)، مع cooldown 60s كحد أدنى بين احتفالين في نفس الصفحة |
| بديل `reduced-motion` | نبضة توهّج واحدة على الشريط + تلميح «أكملت الصفحة» بدون Canvas |
| صفحات قصيرة (< 2 شاشات) | 30 جزيئة فقط ("mini burst") كي لا يكون الاحتفال مبالغًا |

### 6.7 الـ Badge
- نص: النسبة المئوية مقرّبة (`62`)، بلا علامة `%` (مساحة صغيرة).
- لون الخلفية: تدرّج Brand ثابت (`#6D5BFF`)، وأبيض للنص.
- عند 100%: `✓` لثلاث ثوانٍ ثم يعود للنسبة.
- يتحدّث بـ throttle = 1 ثانية (لتجنّب إعادة رسم متكررة).
- على صفحات غير قابلة للتمرير أو المستثناة: badge فارغ.

---

## 7. المتطلبات الوظيفية (Functional Requirements — EARS)

> صيغة EARS: **"عندما <مُحفِّز> فإن <النظام> يجب أن <السلوك> [مع <قيد>]"**. كل متطلب له معرّف يُستخدم في الاختبارات والمهام.

### 7.1 القياس والعرض
| ID | المتطلب |
|---|---|
| **FR-01** | عندما ينتهي تحميل صفحة قابلة للتمرير فإن الإضافة يجب أن تحسب طول المستند الكلي بـ `document.documentElement.scrollHeight` وأن تحسب أقصى مسافة تمرير `maxScroll = max(0, scrollHeight - innerHeight)`. |
| **FR-02** | عندما تكون `maxScroll < 0.2 × innerHeight` فإن الإضافة يجب أن تعتبر الصفحة «غير قابلة للتمرير» وأن تخفي الشريط والـ badge. |
| **FR-03** | عندما يتغيّر `maxScroll` (lazy loading / إغلاق صندوق / تقليص نافذة) فإن الإضافة يجب أن تعيد الحساب خلال ≤ 200ms عبر `ResizeObserver` على `documentElement` و`body` + `MutationObserver` مُقيَّد. |
| **FR-04** | يجب أن تُحسب النسبة كالتالي: `progress = clamp(scrollY / maxScroll, 0, 1)`، وتُعرض بمنزلتين مقربتين إلى نسبة صحيحة (0–100). |
| **FR-05** | يجب أن يُعرض الشريط في كل صفحة تُحقّق شروط FR-01/FR-02 وليست مستثناة وليست `active === false`، خلال ≤ 300ms من التنفيذ. |
| **FR-06** | عندما يمرّر المستخدم فإن الشريط يجب أن يعكس النسبة الجديدة بسلاسة بمعامل تنعيم `lerp(prev, target, 0.28)` على الأقل 30fps. |
| **FR-07** | عندما يمرّر المستخدم فوق الشريط فإن الإضافة يجب أن تعرض تسمية النسبة (`%62`) وأن توسّع الشريط إلى 10px. |
| **FR-08** | يجب أن يُحدَّث الـ badge بنسبة الصفحة الحالية، مع throttle = 1000ms، وفقط للتبويب النشط. |
| **FR-09** | يجب أن يعرض البوب-أب: النسبة، طول الصفحة بعدد الشاشات (`scrollHeight / innerHeight` بمنزلة عشرية واحدة)، ووقت قراءة مُقدّر (`عدد الكلمات ÷ 220` كلمة/دقيقة، بحد أدنى دقيقة واحدة). |

### 7.2 الاحتفال (Confetti & Milestones)
| ID | المتطلب |
|---|---|
| **FR-10** | عندما تصل النسبة إلى ≥ 99.5% لأول مرة في تحميل الصفحة الحالية فإن الإضافة يجب أن تُشغّل Confetti وفق `§6.6` (إن كان الاحتفال مُفعَّلًا و`prefers-reduced-motion` غير مُشغَّل). |
| **FR-11** | عندما يعبر المستخدم محطة 25% أو 50% أو 75% لأول مرة في التحميل الحالي فإن الشريط يجب أن ينبض نبضة واحدة (240ms). |
| **FR-12** | عندما تُشغَّل نسبة الاحتفال مرة ثانية في نفس الصفحة فإنه يجب ألا يحدث قبل مرور 60 ثانية (cooldown). |
| **FR-13** | عندما يُفعَّل `prefers-reduced-motion: reduce` فإنه يجب استبدال Confetti بنبضة توهّج + تلميح نصي، وألا تُستخدم أي حركة انتقالية على الشريط. |
| **FR-14** | عندما تكون الصفحة أقصر من شاشتين فإن Confetti يجب أن يستخدم الوضع المصغّر (30 جزيئة، انتشار أقل). |
| **FR-15** | عند اكتمال الصفحة يجب أن يظهر تلميح «أكملت الصفحة 🎉» لـ 2.5 ثانية أعلى الشريط، ثم يختفي تلقائيًا. |

### 7.3 حفظ واستعادة الموضع
| ID | المتطلب |
|---|---|
| **FR-16** | يجب أن تحفظ الإضافة `{ scrollY, scrollRatio, docHeight, ts }` لكل صفحة، بعد توقّف التمرير لمدة 400ms (`debounce`)، وعند `visibilitychange → hidden`، وعند `pagehide`، وعند `beforeunload`. |
| **FR-17** | يجب أن يكون مفتاح التخزين عنوانًا مُطبَّعًا (انظر `§10.3`)، وأن يُحفظ في `chrome.storage.local`. |
| **FR-18** | عندما يفتح المستخدم صفحة لها موضع محفوظ صالح فإن الإضافة يجب أن تعيد التمرير إليه تلقائيًا إذا كان `settings.restoreScroll === true`. |
| **FR-19** | يجب أن تكون الاستعادة «ذكية»: تُستخدم `scrollY` إن كان `docHeight` الحالي ضمن ±15% من المحفوظ، وإلا تُستخدم `scrollRatio × maxScroll` (انظر `§11.5`). |
| **FR-20** | يجب ألا تحدث الاستعادة إذا: (أ) المستخدم بدأ التمرير فعليًا (`scrollY > 40` أو حدث `wheel/touchmove/keydown`) قبل اكتمالها، (ب) الرابط يحوي hash anchor صريحًا، (ج) الموضع المحفوظ أقل من 60px، (د) انتهت صلاحية السجل (TTL). |
| **FR-21** | يجب أن تُعاد محاولة الاستعادة عند `DOMContentLoaded` ثم `load` ثم عبر 8 محاولات متباعدة (`[0, 150, 400, 800, 1400, 2200, 3200, 4500] ms`) أو حتى الوصول إلى الهدف ±8px، وألا تتجاوز 5 ثوانٍ. |
| **FR-22** | عندما تنجح الاستعادة (بفارق ≤ 8px) فإن الإضافة يجب أن تعرض تلميح «عدت إلى حيث توقفت» لـ 2.5s. |
| **FR-23** | عندما يحدث تنقّل SPA (تغيّر URL بلا إعادة تحميل) فإن الإضافة يجب أن: تحفظ موضع الرابط القديم، وتصفّر حالة المحطات/الاحتفال، وتبدأ دورة قياس واستعادة جديدة للرابط الجديد. |
| **FR-24** | يجب أن تحذف الإضافة السجلات الأقدم من 90 يومًا، وأن تحتفظ بحد أقصى 1500 سجل (إزالة الأقدم استخدامًا LRU عند التجاوز). |
| **FR-25** | عندما يطلب المستخدم «مسح بيانات التمرير» فإنه يجب حذف كل سجلات المواضع مع تأكيد، مع الإبقاء على الإعدادات. |

### 7.4 الاستثناء والتحكم
| ID | المتطلب |
|---|---|
| **FR-26** | يجب أن تعمل الإضافة على كل المواقع (`<all_urls>`) ما لم يكن النطاق مستثنى (blocklist). |
| **FR-27** | عندما يُوقف المستخدم الإضافة على موقع من البوب-أب فإن الشريط يجب أن يختفي فورًا (≤ 200ms) دون إعادة تحميل، ويُحفظ الاستثناء بـ `hostname` (وبدون `www.`). |
| **FR-28** | يجب أن يستثني النظام تلقائيًا وبشكل غير قابل للتجاوز: `chrome://`, `chrome-extension://`, `edge://`, `about:`, `view-source:`, `file://` (إلا إذا فعّل المستخدم «السماح للملفات المحلية»)، و`chromewebstore.google.com`, ومستندات PDF المُدمجة. |
| **FR-29** | يجب أن يوفّر البوب-أب: مفتاح تشغيل عام، استثناء الموقع الحالي، تبديل الاستعادة، تبديل الاحتفال، اختيار الثيم، مسح البيانات. |
| **FR-30** | عندما يضغط المستخدم زر «تشغيل/إيقاف عام» فإن التغيير يجب أن ينعكس في كل التبويبات المفتوحة خلال ≤ 500ms (broadcast). |
| **FR-31** | يجب أن يعمل اختصار لوحة مفاتيح `Alt+Shift+P` على تبديل إظهار/إخفاء الشريط في التبويب الحالي (اختياري، يُسجَّل في `commands`). |

### 7.5 الحالات والحواف
| ID | المتطلب |
|---|---|
| **FR-32** | إذا ظهرت الصفحة في iframe واحد أو أكثر فإن الشريط يجب أن يظهر للإطار الأعلى فقط (`all_frames: false`). |
| **FR-33** | إذا كانت الصفحة تحتوي `body { overflow: hidden }` مع حاوية تمرير داخلية (مثل بعض تطبيقات الويب) فإن الإضافة **لا** تحاول التخمين؛ تُخفي الشريط وتُظهر «الصفحة غير قابلة للقياس» في البوب-أب. |
| **FR-34** | إذا فشل الوصول إلى `chrome.storage` (مثلاً في وضع التصفح المتخفي بلا إذن) فإن الإضافة يجب أن تعمل بالشريط فقط وتُعطّل الاستعادة بصمت. |
| **FR-35** | يجب ألا تُعدِّل الإضافة أي عنصر في صفحة المستخدم خارج جذر Shadow DOM الخاص بها، وألا تلتقط أي حدث بطريقة تعطّل الصفحة (`passive: true` دائمًا). |

---

## 8. المتطلبات غير الوظيفية (NFR)

| ID | الفئة | المتطلب |
|---|---|---|
| **NFR-01** | الأداء | مستمع `scroll` واحد فقط، `{ passive: true }`، ومُقيَّد بـ `requestAnimationFrame` (لا عمل متزامن داخل الحدث) |
| **NFR-02** | الأداء | زمن معالجة إطار التمرير (script time) < 1ms في p95 على جهاز متوسط |
| **NFR-03** | الأداء | لا يُشغّل أي `setInterval` دوري أكبر من 1 ثانية (بلا polling للـ DOM) |
| **NFR-04** | الأداء | كل المراقبات (Observers/rAF) تُوقف عند `document.hidden` وتُستأنف عند الظهور |
| **NFR-05** | الحجم | حزمة الإضافة < 30KB غير مضغوطة، بلا اعتماديات خارجية |
| **NFR-06** | الخصوصية | صفر طلبات شبكة، صفر تتبّع، لا قراءة لمحتوى النص إلا لحساب عدد الكلمات محليًا (وبدون تخزينه) |
| **NFR-07** | الأذونات | أقل إذن ممكن: `storage`, `activeTab` فقط + `content_scripts` على `<all_urls>` + `webNavigation` **فقط** لرصد SPA (مع تبرير في صفحة الإذن) |
| **NFR-08** | التوافق | Chrome/Edge/Brave/Opera بنسخة ≥ 116 (دعم `Document.scrollingElement` + `:has` غير مطلوب) |
| **NFR-09** | العزل | كل واجهات الإضافة داخل Shadow DOM مع `all: initial` + `:host { all: initial }` لمنع تسرّب أنماط الموقع |
| **NFR-10** | الوصولية | الشريط `role="progressbar"` مع `aria-valuenow/min/max`، عناصر البوب-أب قابلة للتنقّل بالكيبورد، تباين ≥ 4.5:1، `aria-live="polite"` للتلميحات |
| **NFR-11** | التدويل | `_locales/ar` و `_locales/en`، دعم `dir="rtl"` في البوب-أب والإعدادات |
| **NFR-12** | المتانة | لا يُرفع أي خطأ غير مُلتقَط إلى console المضيف؛ كل شيء داخل `try/catch` مع تسجيل مُخفَّض |
| **NFR-13** | الصيانة | TypeScript مع `strict: true`، تقسيم وحدات واضح، تغطية اختبارات ≥ 80% لمنطق `core` |
| **NFR-14** | المتصفح المتخفي | يعمل دون أخطاء؛ التخزين قد يكون منفصلًا (سلوك مقبول) |
| **NFR-15** | الاتساق | الشريط لا يتأثر بـ `zoom` أو `transform` على `html` (يُستخدم `position: fixed` على جذر Shadow DOM المُضاف إلى `documentElement`، مع فحص احتياطي) |

---

## 9. المعمارية التقنية (Technical Design)

### 9.1 نظرة عامة
```
┌─────────────────────────────────────────────────────────────┐
│  Web Page (Host)                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Content Script (isolated world, all frames = false)   │  │
│  │  ├─ src/content/bootstrap.ts                          │  │
│  │  ├─ measure.ts   → computeMetrics()                   │  │
│  │  ├─ ui/shadow-host.ts → ShadowRoot + <style>          │  │
│  │  ├─ ui/progress-bar.ts → DOM + states                 │  │
│  │  ├─ ui/confetti.ts     → Canvas engine                │  │
│  │  ├─ ui/toast.ts        → hints                        │  │
│  │  └─ restore.ts         → scroll restoration engine    │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────────────────────────────────┘
                │ chrome.runtime.sendMessage / onMessage
┌───────────────┴─────────────────────────────────────────────┐
│ Service Worker (background.ts)                              │
│  ├─ badge.ts        → per-tab progress badge                │
│  ├─ settings.ts     → storage.sync read/write + broadcast   │
│  ├─ nav-watch.ts    → webNavigation.onHistoryStateUpdated   │
│  ├─ store.ts        → storage.local CRUD + TTL/LRU          │
│  └─ messaging.ts    → typed message router                  │
└───────────────┬─────────────────────────────────────────────┘
                │ chrome.storage
┌───────────────┴──────────────┬──────────────────────────────┐
│ Popup (popup.html+ts)        │ Options (options.html+ts)      │
│  دونات النسبة + قياس + Toggles│  إعدادات متقدمة + blocklist    │
└──────────────────────────────┴──────────────────────────────┘
```

### 9.2 هيكل المشروع (إلزامي)
```
scrollflow/
├── manifest.json
├── package.json
├── tsconfig.json
├── vite.config.ts                # @crxjs/vite-plugin
├── README.md
├── DECISIONS.md                  # سجل القرارات (يُنشئه الـ agent)
├── _locales/
│   ├── ar/messages.json
│   └── en/messages.json
├── public/icons/
│   ├── icon16.png icon32.png icon48.png icon128.png
├── src/
│   ├── core/                     # منطق نقي 100% (بلا DOM) — قابل للاختبار
│   │   ├── progress.ts           # computeProgress(), isScrollable()
│   │   ├── url.ts               # normalizeUrl(), isExcluded()
│   │   ├── storage-model.ts     # أنواع + TTL/LRU خوارزميات
│   │   ├── reading.ts           # estimateReadingTime(), screens()
│   │   └── types.ts
│   ├── content/
│   │   ├── bootstrap.ts
│   │   ├── measure.ts
│   │   ├── restore.ts
│   │   ├── milestones.ts
│   │   ├── ui/shadow-host.ts
│   │   ├── ui/progress-bar.ts
│   │   ├── ui/progress-bar.css     # تُحقن كنص في ShadowRoot
│   │   ├── ui/confetti.ts
│   │   └── ui/toast.ts
│   ├── background/
│   │   ├── service-worker.ts
│   │   ├── badge.ts
│   │   ├── settings.ts
│   │   ├── nav-watch.ts
│   │   └── store.ts
│   ├── shared/
│   │   ├── messages.ts           # معرّفات الرسائل + الأنواع
│   │   ├── settings-schema.ts    # الإعدادات الافتراضية + التحقق
│   │   └── theme.ts              # design tokens كمصفوفة متغيّرات CSS
│   ├── popup/{popup.html,popup.ts,popup.css}
│   └── options/{options.html,options.ts,options.css}
└── tests/
    ├── unit/*.test.ts             # Vitest
    └── e2e/*.spec.ts              # Playwright + chromium (extensions)
```

### 9.3 manifest.json (النسخة المرجعية)
```jsonc
{
  "manifest_version": 3,
  "name": "__MSG_extName__",
  "description": "__MSG_extDesc__",
  "version": "1.0.0",
  "default_locale": "ar",
  "minimum_chrome_version": "116",
  "permissions": ["storage", "activeTab", "webNavigation"],
  "background": { "service_worker": "src/background/service-worker.ts", "type": "module" },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "exclude_matches": [
        "*://chromewebstore.google.com/*",
        "*://chrome.google.com/webstore/*"
      ],
      "js": ["src/content/bootstrap.ts"],
      "run_at": "document_idle",
      "all_frames": false,
      "match_about_blank": false
    }
  ],
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_icon": { "16": "public/icons/icon16.png", "32": "public/icons/icon32.png" }
  },
  "options_page": "src/options/options.html",
  "commands": {
    "toggle-overlay": {
      "suggested_key": { "default": "Alt+Shift+P" },
      "description": "__MSG_cmdToggle__"
    }
  },
  "icons": { "16": "public/icons/icon16.png", "48": "public/icons/icon48.png", "128": "public/icons/icon128.png" }
}
```
> **ملاحظة للـ Agent:** لا تضف `host_permissions` إن لم تكن بحاجة لـ `chrome.scripting.executeScript`. `content_scripts` وحدها كافية. لا تضف `tabs` (لا نحتاجه؛ نستخدم `activeTab` + `sender.tab`).

### 9.4 مصفوفة الرسائل (Messaging Contract)
| الرسالة | من → إلى | الحمولة | الاستجابة |
|---|---|---|---|
| `PROGRESS_UPDATE` | content → SW | `{ tabId?, url, percent, maxScroll, docHeight, viewportH, scrollable }` | `{ ok: true }` |
| `GET_TAB_STATE` | popup → SW | `{ tabId }` | `{ percent, metrics, siteEnabled, settings }` |
| `SETTINGS_GET` | content/popup → SW | `{}` | `Settings` |
| `SETTINGS_PATCH` | popup/options → SW | `Partial<Settings>` | `{ settings: Settings }` |
| `SITE_TOGGLE` | popup → SW | `{ hostname, enabled }` | `{ settings }` |
| `SAVE_POSITION` | content → SW | `{ url, scrollY, scrollRatio, docHeight, ts }` | `{ ok }` |
| `GET_POSITION` | content → SW | `{ url }` | `{ entry: ScrollEntry \| null }` |
| `CLEAR_POSITIONS` | popup/options → SW | `{}` | `{ cleared: number }` |
| `SETTINGS_CHANGED` | SW → all tabs | `Settings` | — |
| `NAV_CHANGED` | SW → tab | `{ url }` | — |
| `TOGGLE_OVERLAY` | SW → tab (من command) | `{}` | — |

**قاعدة:** كل رسالة تُرسل عبر `sendMessage` مُغلَّف بـ `try/catch` (لأن التبويب قد يكون مغلقًا)، وكل رد يحمل `{ ok, data?, error? }`.

### 9.5 تدفق البيانات (Data Flow)
```
dom ready ─► settings.get ─► isExcluded? ─► exit(hidden)
                       └─no─► restore.try() ─► measure() ─► shadowHost.mount()
                                                              │
                          scroll(rAF, passive) ─► computeProgress ─► bar.render()
                                                              ├─► milestones.check()
                                                              ├─► confetti.maybe()
                                                              ├─► toast.maybe()
                                                              └─► debounce(400) ─► SAVE_POSITION
                                                              └─► throttle(1000) ─► PROGRESS_UPDATE ─► badge
```

### 9.6 خطّافات الاختبار (Test Hooks) — إلزامية

هذه المعرّفات **عقد** بين التنفيذ والاختبارات الجاهزة في `tests/e2e/`. تغييرها يكسر E1–E10.

| العنصر | المعرّف | ملاحظات |
|---|---|---|
| جذر Shadow DOM | `id="scrollflow-root"` على عنصر مضاف إلى `document.documentElement` | يجب أن يكون `shadowRoot` مفتوحًا (open) |
| الشريط | `data-testid="rail"` | داخل جذر الظل |
| عنصر التعبئة | `data-testid="fill"` | يحمل `--sf-progress` كرقم `0..1` |
| التلميح | `data-testid="toast"` | نص عربي |
| الحالة | `data-state` على الشريط | `hidden/idle/active/hover/milestone/complete/restored` |
| الإخفاء | `opacity < 0.05` على الشريط | الطريقة التي يتحقق بها الاختبار من الحالات المخفية |

---

## 10. نموذج البيانات (Data Model)

### 10.1 الإعدادات — `chrome.storage.sync` (مفتاح: `settings`)
```ts
export interface Settings {
  version: 1;
  enabled: boolean;              // افتراضي: true
  restoreScroll: boolean;        // افتراضي: true
  celebrate: boolean;            // افتراضي: true
  milestones: boolean;           // افتراضي: true
  showBadge: boolean;            // افتراضي: true
  showToasts: boolean;           // افتراضي: true
  theme: 'aurora' | 'sunset' | 'mono'; // افتراضي: 'aurora'
  side: 'right' | 'left' | 'auto';     // افتراضي: 'right'  (auto = حسب dir الصفحة)
  contrast: 'normal' | 'high';   // افتراضي: 'normal'
  allowFileUrls: boolean;        // افتراضي: false
  blocklist: string[];           // نطاقات مثل ["mail.google.com","docs.google.com"]
  hiddenOnce: string[];          // نطاقات أخفاها المستخدم يدويًا لمرة واحدة
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1, enabled: true, restoreScroll: true, celebrate: true,
  milestones: true, showBadge: true, showToasts: true,
  theme: 'aurora', side: 'right', contrast: 'normal',
  allowFileUrls: false, blocklist: [], hiddenOnce: []
};
```

### 10.2 مواضع التمرير — `chrome.storage.local`
- **api:** تستخدم `chrome.storage.local` مباشرة (لا IndexedDB) — كافٍ حتى 1500 سجل.
- **مفتاح السجل:** `pos:${normalizedUrl}`
- **حدود:** 1500 سجل، TTL = 90 يومًا، الحذف عند `chrome.runtime.onStartup` وعند تجاوز الحد.

```ts
export interface ScrollEntry {
  url: string;        // الرابط المطبّع
  scrollY: number;    // px
  scrollRatio: number;// 0..1
  docHeight: number;  // scrollHeight وقت الحفظ
  viewportH: number;  // innerHeight وقت الحفظ
  ts: number;         // Date.now()
}
```

### 10.3 تطبيع الرابط (`normalizeUrl`) — خوارزمية إلزامية
```
1. أنشئ URL من href.
2. احذف الـ hash إذا كان فارغًا أو يبدأ بـ "#" لكن لا يبدأ بـ "#/".
   (نُبقي "#/..." لأنها مسارات SPA)
3. احذف معاملات التتبّع: utm_*, fbclid, gclid, ref, source, mc_cid, mc_eid, igshid.
4. احذف الـ hash-params (بعد #?).
5. أزل شرطة النهاية الزائدة في الـ pathname (ما عدا "/").
6. أعد origin + pathname + ("?"+search إن وُجد).
7. احذف بادئة "www." من الـ hostname للمقارنة في الـ blocklist فقط (لا في المفتاح).
```

### 10.4 حالة الجلسة (في الذاكرة فقط داخل content script)
```ts
interface PageSession {
  url: string;
  mounted: boolean;
  scrollable: boolean;
  maxScroll: number;
  docHeight: number;
  viewportH: number;
  lastPercent: number;
  smoothed: number;          // قيم lerp
  firedMilestones: Set<25|50|75>;
  celebrated: boolean;
  lastCelebrationAt: number;
  userInteracted: boolean;
  restore: { attempted: true; succeeded: boolean; targetY: number | null };
  rafId: number | null;
  restoreTimers: number[];
}
```

---

## 11. الخوارزميات (Reference Algorithms)

### 11.1 حساب المقياس (measure)
```ts
export function computeMetrics(): Metrics {
  const el = document.scrollingElement ?? document.documentElement;
  const docHeight = Math.max(el.scrollHeight, document.body?.scrollHeight ?? 0);
  const viewportH = window.innerHeight;
  const scrollY = window.scrollY ?? el.scrollTop ?? 0;
  const maxScroll = Math.max(0, docHeight - viewportH);
  return {
    docHeight, viewportH, scrollY, maxScroll,
    scrollable: maxScroll >= viewportH * 0.2,
    screens: docHeight / Math.max(viewportH, 1),
  };
}
```

### 11.2 حساب النسبة + التنعيم
```ts
export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
export const computeProgress = (scrollY: number, maxScroll: number) =>
  maxScroll <= 0 ? 0 : clamp01(scrollY / maxScroll);

// داخل حلقة rAF
state.smoothed += (target - state.smoothed) * 0.28;   // lerp
if (Math.abs(target - state.smoothed) < 0.001) state.smoothed = target;
bar.style.setProperty('--sf-progress', String(state.smoothed)); // 0..1
```
**رسم الشريط:** يُستخدم `transform: scaleY(var(--sf-progress))` مع `transform-origin: top` على عنصر Fill، **لا** `height` (لتجنّب الـ layout). الارتفاع الكلي للشريط `60vh`، فالنسبة تُترجم بصريًا.

### 11.3 تحديث مقيّد (Scroll Handler)
```ts
let ticking = false;
window.addEventListener('scroll', () => {
  state.userInteracted = true;
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; tick(); });
}, { passive: true });
```

### 11.4 اكتشاف تغيّر الطول (Dynamic Height)
```ts
const ro = new ResizeObserver(() => scheduleMeasure()); // على documentElement و body
ro.observe(document.documentElement);
if (document.body) ro.observe(document.body);

// MutationObserver مُقيَّد: صور تُحمَّل، عناصر تُضاف
const mo = new MutationObserver(() => scheduleMeasure()); // throttled 200ms
mo.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
```
`scheduleMeasure()` = `debounce(150ms)` ثم إعادة حساب `maxScroll` وإعادة رسم الشريط (بلا قفزة في الموضع المحفوظ).

### 11.5 محرك الاستعادة (restore) — الأهم في المنتج
```ts
export async function tryRestore(entry: ScrollEntry, settings: Settings) {
  if (!settings.restoreScroll) return;
  if (Date.now() - entry.ts > TTL_90D) return;
  if (entry.scrollY < 60) return;
  if (location.hash && !location.hash.startsWith('#/')) return;  // anchor صريح
  if (window.scrollY > 40) return;                                // المستخدم بدأ

  const deadline = performance.now() + 5000;
  const delays = [0, 150, 400, 800, 1400, 2200, 3200, 4500];

  for (const d of delays) {
    await sleep(d);
    if (performance.now() > deadline) break;
    if (state.userInteracted && window.scrollY > 40) return;

    const m = computeMetrics();
    if (!m.scrollable) continue;

    const frameStable = Math.abs(m.docHeight - lastDocHeight) < 24; // استقر الطول؟
    const targetY = Math.abs(m.docHeight - entry.docHeight) <= entry.docHeight * 0.15
      ? clamp(entry.scrollY, 0, m.maxScroll)
      : clamp(entry.scrollRatio * m.maxScroll, 0, m.maxScroll);

    if (frameStable) {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
      await sleep(60);
      if (Math.abs(window.scrollY - targetY) <= 8) {
        toast(MSG.restored); state.restore.succeeded = true; return;
      }
    } else {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior }); // محاولة مبدئية
    }
  }
}
```
**قواعد إضافية:**
- أثناء محاولات الاستعادة، يُخفى الشريط (`opacity: 0`) ثم يظهر بـ fade 200ms كي لا "يقفز" أمام المستخدم.
- لا تُستعاد المواضع في التبويبات المفتوحة في الخلفية (`document.hidden === true`)؛ تنتظر أول `visibilitychange → visible` (بحد أقصى 15s).
- إذا لم يحصل استقرار حتى النهاية: تُترك الصفحة كما هي وتُسجّل `restore.status = 'partial'`.

### 11.6 دورة حياة الحفظ
```ts
const save = debounce(400, () => {
  if (!state.userInteracted && window.scrollY < 60) return;
  const m = computeMetrics();
  send(SAVE_POSITION, {
    url: normalizeUrl(location.href),
    scrollY: m.scrollY,
    scrollRatio: computeProgress(m.scrollY, m.maxScroll),
    docHeight: m.docHeight,
    viewportH: m.viewportH,
    ts: Date.now(),
  });
});
window.addEventListener('scroll', save, { passive: true });
window.addEventListener('pagehide', save.flush, { capture: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) save.flush(); });
```

### 11.7 رصد SPA
```ts
// في Service Worker
chrome.webNavigation.onHistoryStateUpdated.addListener((d) => {
  if (d.frameId !== 0) return;
  chrome.tabs.sendMessage(d.tabId, { type: 'NAV_CHANGED', url: d.url });
});
// + onCommitted للتنقّل الكامل
```
في content script عند استلام `NAV_CHANGED`: `flushSave(oldUrl)` ← تصفير `firedMilestones`, `celebrated`, `userInteracted=false` ← `tryRestore(newUrl)` ← `scheduleMeasure()`.

### 11.8 الاحتفال والمحطات
```ts
const MILESTONES = [25, 50, 75] as const;
function onPercentChange(pct: number) {
  if (settings.milestones) {
    for (const m of MILESTONES) {
      if (pct >= m && !state.firedMilestones.has(m)) {
        state.firedMilestones.add(m); pulseBar(m);
      }
    }
  }
  const atBottom = pct >= 99.5;
  const canCelebrate = settings.celebrate
    && atBottom
    && !state.celebrated
    && Date.now() - state.lastCelebrationAt > 60_000;
  if (canCelebrate) {
    state.celebrated = true; state.lastCelebrationAt = Date.now();
    settings.reducedMotion ? glowPulse() : confetti.burst(state);
    if (settings.showToasts) toastComplete();
  }
  if (pct < 95) state.celebrated = false;  // لتفعيل الاحتفال مرة أخرى بعد الـ cooldown
}
```

### 11.9 محرك الـ Confetti (هيكل التنفيذ)
```ts
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; vrot: number;
  color: string; shape: 'rect' | 'circle' | 'triangle'; life: number; ttl: number;
}

export function burst(opts: { count: number; originX: number; originY: number; reduced: boolean }) {
  if (opts.reduced) return glowOnly();
  const canvas = createCanvas();           // dpr-aware، pointer-events:none
  const ctx = canvas.getContext('2d')!;
  const particles: Particle[] = Array.from({ length: opts.count }, spawn);
  let raf = 0, start = performance.now();

  const frame = (now: number) => {
    if (document.hidden) { raf = requestAnimationFrame(frame); return; }
    paint(ctx, particles, canvas);
    if (now - start < 2400 && particles.some(p => isVisible(p))) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf); destroyCanvas(canvas);
    }
  };
  raf = requestAnimationFrame(frame);
}
// physics/frame: vy += 0.32; vx *= 0.995; vy *= 0.995; x += vx; y += vy;
//                rot += vrot; alpha = lifeProgress < .75 ? 1 : (1 - (p-.75)/.25)
```

---

## 12. الواجهات (UI Specifications)

### 12.1 الشريط — CSS مرجعي (يُحقن داخل ShadowRoot)
```css
:host { all: initial; }
.sf-rail {
  position: fixed;
  top: 20vh;
  right: 6px;                 /* أو left حسب settings.side */
  height: 60vh;
  width: 6px;
  border-radius: 999px;
  background: var(--sf-track);
  backdrop-filter: blur(12px);
  z-index: 2147483000;
  pointer-events: auto;
  opacity: .55;
  transition: opacity 180ms cubic-bezier(.4,0,.2,1), width 180ms cubic-bezier(.4,0,.2,1);
  box-shadow: 0 0 0 1px rgba(255,255,255,.06) inset;
}
.sf-rail[data-state="active"] { opacity: 1; width: 8px; }
.sf-rail:hover { width: 10px; opacity: 1; }
.sf-fill {
  position: absolute; inset: 0;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--sf-brand-start), var(--sf-brand-mid), var(--sf-brand-end));
  transform-origin: top center;
  transform: scaleY(var(--sf-progress, 0));
  will-change: transform;
  transition: transform 90ms linear;
}
.sf-thumb {
  position: absolute; left: 50%;
  width: 12px; height: 12px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px 2px var(--sf-brand-end);
  transform: translate(-50%, -50%);
  top: calc(var(--sf-progress, 0) * 100%);
}
.sf-rail[data-state="complete"] .sf-fill { background: var(--sf-done); }
@media (prefers-reduced-motion: reduce) {
  .sf-rail, .sf-fill, .sf-thumb { transition: none !important; }
}
```

### 12.2 البوب-أب
- أبعاد: 340×420px، `--sf-surface` + `--sf-blur` + `--sf-shadow`، `border-radius: 16px`.
- الحلقة (Donut): SVG `circle` واحد بـ `stroke-dasharray = 2πr`، `stroke-dashoffset` متحرك، سماكة 8px، تدرّج Brand.
- كل الـ toggles: `role="switch"` + `aria-checked`، عرض 44×24px، لون التشغيل `--sf-brand-mid`.
- الحالة الفارغة (صفحة غير قابلة للتمرير / مستثناة): رسم توضيحي بسيط + نص + زر «تفعيل على هذا الموقع».
- الصفحات الداخلية للمتصفح: تعطيل كل العناصر + رسالة «لا تعمل الإضافة هنا».
- `dir` يتحدد بـ `document.documentElement.dir = navigator.language.startsWith('ar') ? 'rtl' : 'ltr'`.

### 12.3 الإعدادات (Options)
جداول بسيطة: عام / المظهر / الاستثناءات (إضافة نطاق بمدخل نصي ودعم `*.example.com`) / البيانات (تصدير JSON + استيراد + مسح).

---

## 13. الخصوصية والأذونات

| الإذن | لماذا | البديل المرفوض |
|---|---|---|
| `storage` | حفظ الإعدادات والمواضع | — |
| `activeTab` | قراءة الرابط الحالي عند فتح البوب-أب | `tabs` (أوسع من اللازم) |
| `webNavigation` | رصد تنقّل SPA لتحديث الموضع | polling كل 500ms (يزيد الحمل) |
| `content_scripts: <all_urls>` | الشريط يجب أن يعمل على كل المواقع | إدخال يدوي لكل موقع (تجربة سيئة) |

**التزامات صريحة لصفحة الـ Store:**
- لا يجمع أي بيانات شخصية، لا يقرأ محتوى الصفحات لأي غرض غير قياس الطول محليًا.
- لا اتصال بأي خادم. لا تحليلات. لا إعلانات.
- جميع البيانات محلية، ويستطيع المستخدم مسحها بزر واحد.

---

## 14. خطة الاختبار (Test Plan)

### 14.1 اختبارات الوحدة (Vitest) — `src/core` فقط
| الاختبار | المتطلب |
|---|---|
| `computeProgress(0, 0) === 0` / `computeProgress(500, 1000) === 0.5` / يتجاوز القيم سالبة | FR-04 |
| `isScrollable(maxScroll=100, vh=800) === false` | FR-02 |
| `normalizeUrl` يحذف utm/fbclid، يحفظ `#/route`، يحذف `/` الأخيرة | §10.3 / FR-17 |
| `isExcluded('chrome://settings') === true` | FR-28 |
| `isExcluded` مع blocklist و`www.` بادئة | FR-27 |
| `estimateReadingTime(2200 words) === 10` | FR-09 |
| TTL: سجل عمره 91 يومًا يُحذف | FR-24 |
| LRU: إضافة 1501 سجل ➜ يُحذف الأقدم | FR-24 |
| اختيار targetY (ثابت/متغيّر الطول ±15%) | FR-19 |

### 14.2 اختبارات التكامل (Playwright + Chromium مع `--load-extension`)
| السيناريو | المتطلب |
|---|---|
| E1: صفحة طويلة ➜ الشريط ظاهر، و`--sf-progress` يتغير مع التمرير | FR-01,05,06 |
| E2: تمرير للنهاية ➜ Canvas يظهر ثم يُزال خلال ≤ 2.5s | FR-10,§6.6 |
| E3: إعادة تحميل الصفحة ➜ `scrollY` يعود (بفارق ≤ 8px) | FR-18,19,22 |
| E4: استثناء موقع من البوب-أب ➜ الشريط يختفي فورًا، وبعد reload يبقى مخفيًا | FR-27 |
| E5: صفحة قصيرة ➜ لا شريط، البوب-أب يعرض حالة فارغة | FR-02 |
| E6: SPA (history.pushState) ➜ الشريط يُصفَّر، ثم يستعيد موضع المسار الجديد | FR-23 |
| E7: Infinite scroll ➜ بعد إضافة محتوى، النسبة تنخفض منطقيًا (لا تقفز 100%) | FR-03 |
| E8: `prefers-reduced-motion` ➜ لا Canvas، تلميح ظاهر | FR-13 |
| E9: صفحة بنافذة ضيقة جدًا (320px) ➜ الشريط لا يغطي المحتوى | NFR-10 |
| E10: موقع بثيم فاتح ➜ تباين الشريط مقبول | §6.3 |

### 14.3 مصفوفة اختبار يدوي (QA)
مواقع اختبار إلزامية: `wikipedia.org` (طويل)، `developer.mozilla.org` (توثيق + ثيم فاتح/داكن)، `youtube.com/watch` (SPA + حاوية تمرير داخلية)، `x.com` (SPA + infinite)، `news.ycombinator.com` (قصير)، `docs.google.com` (must-exclude)، `PDF` (must-exclude)، `chrome://settings` (must-exclude).
أنظمة: Windows 11 + Chrome 116/120/130، macOS، Linux. حالات: RTL عربي، zoom 150%، dark mode، high contrast، شاشة 4K، تبويبات كثيرة (20+)، وضع التصفح المتخفي.

### 14.4 معايير القبول النهائية (Definition of Done)
- [ ] كل FR في `§7` منفَّذ ومغطّى باختبار أو تحقق يدوي موثّق.
- [ ] لا أخطاء في console المضيف على كل المواقع المختبرة.
- [ ] Lighthouse-less: `document.hidden` يوقف كل العمل (تحقّق عبر Performance profiler).
- [ ] حجم الحزمة النهائي < 30KB.
- [ ] `tsc --noEmit` بلا أخطاء، ESLint بلا تحذيرات.
- [ ] `DECISIONS.md` يحتوي كل قرار اتُّخذ عند الغموض.
- [ ] README يشرح التثبيت المحلي والاختبار والبناء.

---

## 15. المخاطر والتخفيف

| # | الخطر | الاحتمال | الأثر | التخفيف |
|---|---|---|---|---|
| R1 | تعارض CSS مع مواقع تستخدم `*` selectors | متوسط | متوسط | Shadow DOM + `all: initial` + `:host` |
| R2 | `position: fixed` يُكسر بسبب `transform` على الجذر | منخفض | عالٍ | فحص `getComputedStyle(html).transform !== 'none'` ➜ استخدام `position: absolute` + `top: scrollY` |
| R3 | فشل الاستعادة في SPA يعيد التمرير لمكان خاطئ | متوسط | عالٍ | قيد ±15% + استقرار الطول + إلغاء فوري عند تفاعل المستخدم |
| R4 | حاويات تمرير داخلية (`overflow: auto` على div) | مرتفع | متوسط | إعلان explicit: غير مدعومة في 1.0، تُخفى الشريط (FR-33) |
| R5 | استهلاك ذاكرة من MutationObserver على مواقع ضخمة | متوسط | متوسط | `subtree: true` مع throttle 200ms + إيقاف عند hidden + حد أقصى 10 معالجات/ثانية |
| R6 | مراجعة Chrome Web Store لسبب `<all_urls>` | متوسط | متوسط | تبرير واضح + سياسة خصوصية + لقطات توضيحية |
| R7 | إزعاج المستخدم بالاحتفال | متوسط | متوسط | Cooldown 60s + إمكانية إيقافه + reduced-motion |

---

## 16. خطة التنفيذ — المهام (tasks.md)

> **قاعدة:** كل مهمة = PR صغير، لها ملفات محددة ومعيار إنجاز قابل للقياس. لا تبدأ مهمة قبل اكتمال التبعيات.

### المرحلة 0 — التأسيس (Setup)
| # | المهمة | الملفات | الإنجاز | التبعية |
|---|---|---|---|---|
| T01 | تهيئة المشروع: Vite + CRXJS + TypeScript strict + ESLint + Prettier + Vitest + Playwright | `package.json, tsconfig.json, vite.config.ts, .eslintrc` | `npm run build` ينتج `dist/` تُحمَّل في Chrome دون أخطاء | — |
| T02 | manifest.json + الأيقونات + `_locales` | `manifest.json, public/icons/*, _locales/**` | الإضافة تظهر في `chrome://extensions` بلا تحذيرات | T01 |
| T03 | `shared/types.ts` + `shared/settings-schema.ts` + `shared/messages.ts` + `shared/theme.ts` | `src/shared/*` | الأنواع تُترجم بلا أخطاء، والافتراضيات مطابقة لـ §10.1 | T01 |

### المرحلة 1 — النواة المنطقية (Core, pure)
| # | المهمة | الملفات | الإنجاز | التبعية |
|---|---|---|---|---|
| T04 | `core/progress.ts` + اختبارات | `src/core/progress.ts, tests/unit/progress.test.ts` | تغطية 100% للدوال | T03 |
| T05 | `core/url.ts` (normalizeUrl, isExcluded, hostname matching) + اختبارات | `src/core/url.ts` + tests | كل حالات §10.3 و FR-28 مغطّاة | T03 |
| T06 | `core/storage-model.ts` (TTL, LRU, serialize) + اختبارات | `src/core/storage-model.ts` | FR-24 مغطّى | T03 |
| T07 | `core/reading.ts` (screens, readingTime) + اختبارات | `src/core/reading.ts` | FR-09 مغطّى | T03 |

### المرحلة 2 — الخلفية (Background)
| # | المهمة | الملفات | الإنجاز | التبعية |
|---|---|---|---|---|
| T08 | `settings.ts`: قراءة/كتابة/دمج + بثّ `SETTINGS_CHANGED` | `src/background/settings.ts` | FR-30 يعمل: تغيير الإعداد ينعكس في تبويب مفتوح ≤ 500ms | T03 |
| T09 | `store.ts`: `SAVE_POSITION`, `GET_POSITION`, `CLEAR_POSITIONS`, تنظيف TTL/LRU عند `onStartup` | `src/background/store.ts` | الاختبار اليدوي: حفظ/قراءة/مسح | T06 |
| T10 | `badge.ts`: تحديث الـ badge، throttle 1000ms، `✓` عند 100% | `src/background/badge.ts` | FR-08 | T08 |
| T11 | `nav-watch.ts`: رصد SPA على `frameId===0` | `src/background/nav-watch.ts` | رسالة `NAV_CHANGED` تُرسل مرة واحدة لكل تغيير | T08 |
| T12 | `service-worker.ts`: راوتر الرسائل + `commands` | `src/background/service-worker.ts` | كل رسائل §9.4 مستجيبة | T08–T11 |

### المرحلة 3 — الشريط (Overlay UI)
| # | المهمة | الملفات | الإنجاز | التبعية |
|---|---|---|---|---|
| T13 | `shadow-host.ts`: إنشاء host + ShadowRoot + حقن CSS + `all: initial` + كشف transform على الجذر | `src/content/ui/shadow-host.ts` | لا تسرّب أنماط (اختبار بصري على 3 مواقع) | T02 |
| T14 | `progress-bar.ts`: عناصر rail/fill/thumb + API `mount/render/updateState/destroy` | `src/content/ui/progress-bar.ts` | E1 ينجح | T13, T04 |
| T15 | حالات الشريط: idle/active/hover/milestone/complete + التسمية `%` | نفس الملف | كل حالات §6.4 قابلة للاستدعاء ومُختبَرة | T14 |
| T16 | `toast.ts`: تلميحات (restored / complete) + `aria-live` | `src/content/ui/toast.ts` | FR-15, FR-22 | T13 |
| T17 | `measure.ts`: computeMetrics + ResizeObserver + MutationObserver مقيّد | `src/content/measure.ts` | E7 ينجح (infinite scroll) | T04 |

### المرحلة 4 — التمرير والحفظ والاستعادة
| # | المهمة | الملفات | الإنجاز | التبعية |
|---|---|---|---|---|
| T18 | `bootstrap.ts`: تسلسل البدء (settings ➜ exclude ➜ restore ➜ measure ➜ mount) | `src/content/bootstrap.ts` | الشريط يظهر ≤ 300ms | T08,T14,T17 |
| T19 | حلقة التمرير: rAF + lerp + throttles + إرسال `PROGRESS_UPDATE` | `src/content/bootstrap.ts` | NFR-01,02 | T18 |
| T20 | الحفظ: debounce 400ms + flush على pagehide/visibilitychange | `src/content/bootstrap.ts` | FR-16 | T18,T09 |
| T21 | `restore.ts`: المحرك الكامل §11.5 + الإلغاء عند تفاعل المستخدم | `src/content/restore.ts` | E3 ينجح (فارق ≤ 8px) | T20 |
| T22 | `milestones.ts`: المحطات + الاحتفال + cooldown | `src/content/milestones.ts` | FR-11,12 | T15 |
| T23 | `ui/confetti.ts`: محرك Canvas كامل مع تنظيف كامل | `src/content/ui/confetti.ts` | E2 ينجح، لا تسرّب ذاكرة بعد 20 احتفالًا | T13,T22 |
| T24 | دعم SPA في content script (استقبال `NAV_CHANGED`) | `src/content/bootstrap.ts` | E6 ينجح | T11,T21 |

### المرحلة 5 — الأسطح (Popup/Options)
| # | المهمة | الملفات | الإنجاز | التبعية |
|---|---|---|---|---|
| T25 | `popup.html/css`: التخطيط + الحلقة SVG + الثيمات + RTL | `src/popup/*` | مطابق لـ §6.5 بصريًا | T08,T12 |
| T26 | `popup.ts`: قراءة حالة التبويب، toggles، استثناء الموقع، مسح البيانات | `src/popup/popup.ts` | FR-27,29,25 | T25 |
| T27 | `options.html/ts`: إعدادات موسّعة + إدارة blocklist + تصدير/استيراد | `src/options/*` | كل حقول `Settings` قابلة للتعديل | T08 |
| T28 | أيقونة شريط الأدوات + الاختصار `Alt+Shift+P` | `manifest.json, service-worker.ts` | FR-31 | T12 |

### المرحلة 6 — الصقل والتسليم
| # | المهمة | الإنجاز | التبعية |
|---|---|---|---|
| T29 | الوصولية: ARIA، تركيز، تباين، `aria-live` | اجتياز فحص axe بلا أخطاء حرجة | T25,T14 |
| T30 | اختبار Playwright لكل E1–E10 | كلها خضراء | T13–T26 |
| T31 | قياس الأداء عبر Performance panel على 5 مواقع | script time/frame < 1ms p95 | T19 |
| T32 | README + سياسة خصوصية + لقطات + `DECISIONS.md` | مكتملة | الكل |

**تقدير الجهد:** ~6–8 أيام عمل لمطوّر واحد متمكّن (المراحل 0–6).

---

## 17. خارطة الطريق (Roadmap)

| الإصدار | المحتوى |
|---|---|
| **1.0 (MVP)** | كل ما في §5.1 |
| 1.1 | أوضاع مؤشر إضافية (دائري، أفقي)، مزامنة عبر `storage.sync` اختياريًا، إحصاءات قراءة محلية |
| 1.2 | دعم حاويات التمرير الداخلية (اكتشاف الحاوية الأعلى مساحة)، قائمة قراءة |
| 2.0 | دعم Firefox (WebExtensions) + نسخة mobile-friendly |

---

## 18. أسئلة مفتوحة (تحتاج قرار المالك)

| # | السؤال | الافتراض الحالي |
|---|---|---|
| Q1 | هل يحتاج المستخدم لتأكيد استعادة الموضع (بدل التلقائي)؟ | لا — تلقائي مع تلميح، وإمكانية إيقافه |
| Q2 | هل نحفظ الموضع في وضع التصفح المتخفي؟ | نعم إن كان الإذن ممنوحًا، وإلا الشريط فقط |
| Q3 | هل نُظهر النسبة دائمًا أم عند Hover فقط؟ | عند Hover فقط لتقليل التشتيت |
| Q4 | هل نطبّق الشريط على صفحات `file://`؟ | لا افتراضيًا، مع إعداد |
| Q5 | هل نضيف "مؤشر تقدّم في شريط عنوان التبويب" (title)؟ | لا في 1.0 |

---

## 19. برومبت جاهز للـ Coding Agent

```text
أنت تبني إضافة Chrome باسم "ScrollFlow" وفق مواصفة SDD في الملف PRD-ScrollFlow.md.

قواعد صارمة:
1) اقرأ §9 ثم §10 ثم §11 ثم §16 قبل كتابة أي كود.
2) نفّذ المهام بالترتيب T01 → T32، مهمة واحدة لكل التزام (commit)، ولا تنتقل قبل تحقق معيار الإنجاز.
3) لا مكتبات خارجية: لا React ولا canvas-confetti ولا framer-motion. TypeScript strict فقط.
4) كل الواجهات داخل Shadow DOM مع `:host { all: initial }`. لا تلمس DOM المضيف خارج جذرنا.
5) مستمع scroll واحد passive + rAF + lerp 0.28. لا setInterval دوري. أوقف كل المراقبات عند document.hidden.
6) النسبة = clamp(scrollY / (scrollHeight - innerHeight), 0, 1). الشريط يُرسم بـ transform: scaleY فقط.
7) الاستعادة: TTL 90 يوم، قيد ±15% على docHeight، 8 محاولات حتى 5s، إلغاء فوري عند تفاعل المستخدم، فارق قبول ≤ 8px.
8) Confetti: Canvas واحد، dpr-aware، جاذبية 0.32، مقاومة 0.995، 60–140 جزيئة، تنظيف كامل + إلغاء rAF عند الانتهاء، بديل عند prefers-reduced-motion، cooldown 60s.
9) أي غموض ➜ §0.1، ودوّن القرار في DECISIONS.md.
10) بعد كل مرحلة: tsc --noEmit + Vitest خضراء + Test يدوي على wikipedia/mdn/youtube.

المخرجات المتوقعة: مستودع كامل يبنى بـ `npm i && npm run build`، مع README يشرح التحميل المحلي، وتقرير نهائي يطابق كل FR بحالته (منفّذ/مُختبَر).
```

---

## 20. ملحق: مراجع نفسية/تصميمية للتبرير

- **Goal Gradient Effect:** تقترب الناس من الهدف أسرع كلما اقتربوا منه ➜ يبرّر نبضات 75% والاحتفال النهائي.
- **Zeigarnik Effect:** المهام غير المكتملة تُبقي انتباهًا ➜ يبرّر إظهار «كم بقي» بدل «كم قرأت».
- **Reduced-motion:** احترام `prefers-reduced-motion` ليس اختياريًا (WCAG 2.3.3).
- **Least Astonishment:** الإضافة لا تغيّر أي سلوك أصلي في الصفحة ➜ يقلّل الكراهية والإلغاء.

---

---

## 21. حزمة التنفيذ (Execution Kit) — الملفات المصاحبة لهذه الوثيقة

هذه الوثيقة تحدد **ماذا** و**لماذا**. الملفات التالية تحدد **كيف تُثبَت الجودة** — وهي جزء من المواصفة، لا ملحق اختياري.

| الملف | الدور | لماذا يرفع الجودة |
|---|---|---|
| `AGENTS.md` | نقطة دخول الوكيل + أولوية السلطة + قواعد العمل | يمنع الاجتهاد العشوائي ويوحّد الـ Definition of Done |
| `specs/memory/constitution.md` | مبادئ غير قابلة للتفاوض | تُحسم كل الخلافات (الخفّة، الخصوصية، الأداء) |
| `specs/001-scrollflow/tasks.md` | قائمة عمل T01–T32 + بوابة التسليم | يحوّل الخطة إلى تقدّم قابل للقياس |
| `contracts/types.ts` · `contracts/messages.ts` | العقود البرمجية النهائية | يمنع اختلاف التسميات بين الوحدات |
| `contracts/settings.schema.json` | Schema للإعدادات | التحقق والتصدير/الاستيراد آليًا |
| `design/tokens.css` | قيم التصميم الحقيقية (تُحقن في ShadowRoot) | نقطة حقيقة واحدة للألوان والمقاسات |
| `design/preview.html` | **نموذج تفاعلي** للشريط + Confetti + البوب-أب | يزيل كل غموض بصري: يُفتح ويُطابَق، لا يُوصف بالكلام |
| `tests/unit/*.test.ts` | اختبارات النواة (تُسلَّم حمراء وتصبح خضراء) | تحوّل FR-01..FR-24 إلى إثبات قابل للتشغيل |
| `tests/e2e/core.spec.ts` | E1–E10 جاهزة | تختبر السلوك الحقيقي داخل متصفح حقيقي |
| `tests/fixtures/*.html` + `serve.mjs` | صفحات اختبار محلية (طويلة/قصيرة/SPA/Infinite/حاوية داخلية) | اختبارات حتمية بلا شبكة ولا نصوص متغيّرة |
| `docs/privacy-policy.md` · `docs/store-listing.md` | جاهزة للنشر | توفّر يومًا كاملًا قبل الإطلاق |
| `REPORT.template.md` | جدول إثبات لكل FR | يمنع «أعلنته مكتملًا» بلا دليل |

**الترتيب المثالي للتسليم إلى وكيل:** `AGENTS.md` ← `PRD-ScrollFlow.md` ← `specs/` ← `contracts/` ← `design/preview.html` ← ثم قل له: «نفّذ T01».

---

**نهاية الوثيقة.** أي تعديل على السلوك يجب أن يبدأ بتعديل هذا الملف (Spec-first)، ثم الكود، ثم الاختبارات.
