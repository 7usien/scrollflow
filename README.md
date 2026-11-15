# ScrollFlow — حزمة المواصفات والتنفيذ (SDD Kit)

إضافة Chrome تُظهر مؤشر تقدّم قراءة رأسيًا، تحفظ موضع التمرير لكل صفحة، وتحتفل عند النهاية.

> **هذه ليست الكود.** هذه هي المواصفة + الأدوات التي تجعل بناء الكود حتميًا وقابلًا للإثبات.

---

## ابدأ من هنا

| أنت… | اقرأ/افتح |
|---|---|
| **مالك المنتج** | `PRD-ScrollFlow.md` (كل شيء: الرؤية، المتطلبات، الخوارزميات، المهام) |
| **تريد أن ترى الشكل** | `design/preview.html` — افتحه في المتصفح والعب به |
| **Coding Agent** | `AGENTS.md` ← ثم `specs/001-scrollflow/tasks.md` |
| **مراجع الكود** | `contracts/*` (الأنواع والرسائل) + `tests/*` (الإثباتات) |

---

## خريطة الملفات

```
scrollflow/
├── PRD-ScrollFlow.md            ★ مصدر الحقيقة للمتطلبات (21 قسمًا)
├── AGENTS.md                    ★ نقطة دخول الوكيل + قواعد العمل
├── DECISIONS.md                   سجل القرارات (يضيفه الوكيل أثناء البناء)
├── REPORT.template.md             قالب تقرير الإثبات النهائي
│
├── specs/
│   ├── memory/constitution.md     مبادئ غير قابلة للتفاوض
│   └── 001-scrollflow/tasks.md    T01–T32 + بوابة التسليم
│
├── contracts/
│   ├── types.ts                   الأنواع النهائية (Settings, ScrollEntry, Metrics…)
│   ├── messages.ts                عقد الرسائل بين content/background/popup
│   └── settings.schema.json       JSON Schema للإعدادات
│
├── design/
│   ├── preview.html             ★ النموذج التفاعلي (الحقيقة البصرية)
│   └── tokens.css                 قيم التصميم تُحقن في ShadowRoot
│
├── tests/
│   ├── unit/*.test.ts             اختبارات النواة — تُسلَّم وتصبح خضراء
│   ├── e2e/core.spec.ts           E1–E10 على متصفح حقيقي
│   └── fixtures/                  صفحات اختبار + سيرفر محلي
│
└── docs/
    ├── privacy-policy.md          جاهزة للنشر
    └── store-listing.md           نصوص صفحة المتجر + تبرير الأذونات
```

---

## المسار المختصر للوكيل

```bash
# 1) اقرأ
cat AGENTS.md PRD-ScrollFlow.md specs/memory/constitution.md specs/001-scrollflow/tasks.md

# 2) نفّذ بالترتيب
T01 → T03 → T04…T07 (النواة، اختبارات جاهزة) → T08…T12 → T13…T17 → T18…T24 → T25…T32

# 3) أثبت
npm run verify && npm run test:e2e   # + املأ REPORT.md
```

---

## أسئلة يتوقعها الوكيل

**هل أعدّل الـ PRD؟** لا. سجّل القرار في `DECISIONS.md`.
**أين أضع ألوانًا جديدة؟** لا مكان. الثيمات الثلاثة مغلقة في `design/tokens.css`.
**اختبار فشل وأنا متأكد أن الكود صحيح؟** الاختبار هو المرجع. أصلح الكود؛ إن كان الاختبار خاطئًا، وثّق السبب في `DECISIONS.md` وعدّل الاختبار مع المتطلب.
**هل أضيف مكتبة صغيرة؟** لا. `constitution.md` البند I.
