GIVEN --baseUrl 'cli://localhost' AND --linking 'absolute' from command line
AND --baseUrl 'file://localhost' AND --linking 'relative' from config file
THEN command line option MUST take precedence
AND term 'Term' MUST have link domain 'cli://localhost'.
