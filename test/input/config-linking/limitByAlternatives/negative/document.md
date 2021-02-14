# Document

GIVEN option `linking.limitByAlternatives: -1` WITH a negative value
AND a term *Ambiguous* with 3 definitions, so matching rule *at least abs(-1) = 1 alternative definitions*
THEN the term MUST NOT be linkified at all.
