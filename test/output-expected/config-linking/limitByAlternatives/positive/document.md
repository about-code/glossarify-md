# [Document](#document)

GIVEN option `linking.limitByAlternatives: 1` WITH a positive limit
AND a term *[Ambiguous][1][<sup>2)</sup>][2]<sup>...</sup>* with 3 definitions, so matching *1 or more alternative definitions*
THEN

1.  the term MUST be linkified
2.  AND 1 alternative superscript link <sup>2)</sup> MUST BE created
3.  AND existence of more alternative definitions MUST be indicated by <sup>...</sup>.

[1]: ./def-1.md#ambiguous "Definition 1"

[2]: ./def-2.md#ambiguous "Definition 2"
