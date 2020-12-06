# Test Case 'option linking.terms'

## Section 1

GIVEN option `linking: { terms: "first-in-paragraph" }`
AND a glossary term 'Lorem'
AND a document with term 'Lorem' in this *first* paragraph *of section 1*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
THEN only the first occurrence of the term MUST be linkified.

GIVEN option `linking: { terms: "first-in-paragraph" }`
AND a glossary term 'Lorem'
AND a document with term 'Lorem' in this *second* paragraph *of section 1*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
THEN only the first occurrence of the term MUST be linkified.

GIVEN option `linking: { terms: "first-in-paragraph" }`
AND a glossary term 'Lorem'
AND a glossary term 'Ipsum'
AND a document with term 'Lorem' in this *third* paragraph *of section 1*
AND a document with term 'Ipsum' in this *third* paragraph *of section 1*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
AND and the term 'Ipsum' being mentioned *three times* in this paragraph
THEN only the first occurrence of *each* term MUST be linkified.

## Section 2

GIVEN option `linking: { terms: "first-in-paragraph" }`
AND a glossary term 'Lorem'
AND a document with term 'Lorem' in this *first* paragraph *of section 2*
AND and the term 'Lorem' being mentioned *three times* in this paragraph
THEN only the first occurrence of the term MUST be linkified.
