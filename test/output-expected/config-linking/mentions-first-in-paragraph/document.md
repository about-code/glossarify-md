# [Test Case 'option linking.terms'](#test-case-option-linkingterms)

## [Section 1](#section-1)

GIVEN option `linking: { mentions: "first-in-paragraph" }`
AND a glossary term '[Lorem][1]'
AND a document with term 'Lorem' in this *first* paragraph *of section 1*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
THEN only the first occurrence of the term MUST be linkified.

GIVEN option `linking: { mentions: "first-in-paragraph" }`
AND a glossary term '[Lorem][1]'
AND a document with term 'Lorem' in this *second* paragraph *of section 1*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
THEN only the first occurrence of the term MUST be linkified.

GIVEN option `linking: { mentions: "first-in-paragraph" }`
AND a glossary term '[Lorem][1]'
AND a glossary term '[Ipsum][2]'
AND a document with term 'Lorem' in this *third* paragraph *of section 1*
AND a document with term 'Ipsum' in this *third* paragraph *of section 1*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
AND and the term 'Ipsum' being mentioned *three times* in this paragraph
THEN only the first occurrence of *each* term MUST be linkified.

## [Section 2](#section-2)

GIVEN option `linking: { mentions: "first-in-paragraph" }`
AND a glossary term '[Lorem][1]'
AND a document with term 'Lorem' in this *first* paragraph *of section 2*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
THEN only the first occurrence of the term MUST be linkified.

[1]: ./glossary.md#lorem "Test term"

[2]: ./glossary.md#ipsum "Test term"
