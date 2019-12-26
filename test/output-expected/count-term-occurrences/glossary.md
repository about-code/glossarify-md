# [Glossary](#glossary)

## [Zero](#zero)

GIVEN a term "[Zero][1]"
AND the term "[Zero][1]" is mentioned twice in its own definition
AND nowhere else
THEN this term's occurrence count MUST be 0.

## [One](#one)

GIVEN a term "[One][2]"
AND the term is mentioned only once in a subsequent term definition
AND nowhere else
THEN this term's occurrence count MUST be 1.

#### [mention-one-once](#mention-one-once)

GIVEN this definition
AND it mentions another term "[One][2]" once
AND itself is being mentioned nowhere else
THEN the other term's occurrence count MUST be 1
AND this term's occurrence count MUST be 0.

## [Two](#two)

GIVEN a term "[Two][3]"
AND the term is mentioned term two times in a subsequent term definition
AND nowhere else
THEN this term's occurrence count MUST be 2.

#### [mention-two-twice](#mention-two-twice)

GIVEN this definition
AND it mentions another term "[Two][3]" [Two][3] times
AND itself is being mentioned nowhere else
THEN the other term's occurrence count MUST be 2
AND this term's occurrence count MUST be 0.

## [Mentioned-in-document-once](#mentioned-in-document-once)

GIVEN a term
AND it is mentioned once in a document
AND not in the glossary
THEN this term's occurrence count MUST be 1.

## [Mentioned-in-document-twice](#mentioned-in-document-twice)

GIVEN a term
AND it is mentioned twice in a document
AND not in the glossary
THEN this term's occurrence count MUST be 2.

[1]: #zero 'GIVEN a term "Zero"
AND the term "Zero" is mentioned twice in its own definition
AND nowhere else
THEN this term's occurrence count MUST be 0.'

[2]: #one 'GIVEN a term "One"
AND the term is mentioned only once in a subsequent term definition
AND nowhere else
THEN this term's occurrence count MUST be 1.'

[3]: #two 'GIVEN a term "Two"
AND the term is mentioned term two times in a subsequent term definition
AND nowhere else
THEN this term's occurrence count MUST be 2.'
