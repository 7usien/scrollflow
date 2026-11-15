# Chrome Web Store — نصوص صفحة النشر

## الاسم
ScrollFlow — مؤشر القراءة وموضع التمرير

## الوصف القصير (≤132 حرفًا)
شريط تقدّم أنيق يُظهر كم قرأت من الصفحة، ويُعيدك إلى حيث توقفت، ويحتفل معك عند النهاية. خفيف وخاص تمامًا.

## الوصف الطويل
**لا تفقد مكانك مرّة أخرى.**

ScrollFlow يُضيف شريط تقدّم رأسيًا رقيقًا على حافة الشاشة، يُظهر نسبة ما قرأته من الصفحة الحالية — بلا أن يغطّي محتوى أو يُبطئ المتصفح.

**المزايا**
- 📊 **مؤشر تقدّم حيّ:** نسبة الصفحة، بتصميم زجاجي أنيق وثلاثة ثيمات.
- 🔖 **يعيدك إلى حيث توقفت:** يفتح كل صفحة على الموضع الذي تركتها منه، تلقائيًا.
- 🎉 **احتفال صغير عند النهاية:** وميض ورق ملوّن بسيط عند إكمال الصفحة (يمكن إيقافه).
- 📏 **قياس الصفحة:** طولها بعدد الشاشات ووقت القراءة المُقدَّر.
- ⚙️ **تحكم كامل:** إيقاف لموقع معيّن، إيقاف الاحتفال، إيقاف الاستعادة، مسح البيانات.
- 🎨 **يحترم جهازك:** يدعم تقليل الحركة والوضع الليلي وواجهة RTL.

**الخصوصية أولًا**
لا خادم، لا حساب، لا تحليلات. كل شيء يبقى على جهازك، وقابل للمسح بزر واحد.

**الأذونات:** storage (حفظ المواضع) · activeTab (حالة التبويب) · webNavigation (تطبيقات الصفحة الواحدة) · الوصول للمواقع (لتعمل على أي صفحة تقرأها، مع قائمة استثناء).

## Single purpose (مطلوب من Google)
> Provide a visual reading-progress indicator for the current page and remember the user's scroll position so they can resume where they left off.

## تبرير الأذونات (Permission justification)
- **storage:** Persist user settings and per-URL scroll positions locally. No remote transmission.
- **activeTab:** Read the current tab's URL to display page metrics in the popup when the user opens it.
- **webNavigation:** Detect SPA route changes (history.pushState) so scroll positions are saved and restored per route rather than per document.
- **content_scripts on <all_urls>:** The progress indicator must render on arbitrary pages the user reads. Users can disable it per-site; internal browser pages and the Web Store are hard-excluded.

## كلمات مفتاحية
reading progress, scroll position, resume reading, progress bar, productivity, reading

## لقطات مطلوبة
1. الشريط على مقال طويل (1280×800) — ثيم Aurora
2. حالة Hover مع النسبة
3. لحظة الاحتفال (Confetti)
4. لوحة الإضافة
5. قبل/بعد الاستعادة (مقارنة)
