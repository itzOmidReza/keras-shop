import { injectHead } from '#imports';

export default defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head) return;

  // حذف متاتگ‌های منسوخ توییتر پیش از ارزیابی نهایی در Unhead جهت جلوگیری از وارنینگ‌های کنسول
  head.use({
    key: 'suppress-deprecated-twitter-card',
    hooks: {
      'tags:beforeResolve': ({ tags }) => {
        for (let i = tags.length - 1; i >= 0; i--) {
          const tag = tags[i];
          if (
            tag &&
            tag.tag === 'meta' &&
            (tag.props?.name === 'twitter:card' || tag.props?.property === 'twitter:card')
          ) {
            tags.splice(i, 1);
          }
        }
      },
    },
  });
});
