# [Evil Glossary](#evil-glossary)

## [Unsafe Link in Definition](#unsafe-link-in-definition)

<!--{
  "uri": "https://evil.org/unsafe/#definition-html-link-removed"
}-->

[EXPECT removed link.][1]

## [Unsafe Html in Definition (Escape)](#unsafe-html-in-definition-escape)

<!--{
  "uri": "https://evil.org/unsafe/#definition-html-script-escaped"
}-->

EXPECT script escaped <\<script src="[https://evil.org/evil.js"/>Evil\\][2]</script>.

## [Unsafe Html in Definition (Remove)](#unsafe-html-in-definition-remove)

<!--{
  "uri": "https://evil.org/unsafe/#definition-html-script-removed"
}-->

[EXPECT script removed .][3]

## [Unsafe Markdown in Definition](#unsafe-markdown-in-definition)

<!--{
  "uri": "https://evil.org/unsafe/#definition-markdown-removed"
}-->

[EXPECT removed bold text AND link.][4]

[1]: ./safe-aliases.md#unsafe-link-in-alias "Safe."

[2]: https://evil.org/evil.js"/>Evil\

[3]: ./safe-aliases.md#unsafe-html-in-aliases-remove "Safe."

[4]: ./safe-aliases.md#unsafe-markdown-in-aliases "Safe."
