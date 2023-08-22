# [Document](#document)

GIVEN option `linking.limitByAlternatives: -2` WITH a negative value
AND a term *Ambiguous* with 3 definitions, so matching rule *stop linking once there are at least abs(-2) = 2 alternative definitions*
THEN the term MUST NOT be linkified at all.
