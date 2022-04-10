# Test Case

## Expect

GIVEN

- a configuration `linking.pathRewrites`

  ~~~json
  {
    "linking": {
      "pathRewrites": {
        "KEY-1/": ["section-1-1/", "section-1-2/", "section-2-1/", "section-2-2/"],
        "KEY-2/": ["section-2-1/", "section-2-2/"]
      },
      "...": ""
    }
  }
  ~~~

- AND two rewrite rules WITH two possible ways of rewriting `section-2-1/` and `section-2-2/`

THEN

- for multiple test runs results MUST NOT vary between test runs (determinism)
- AND paths with `section-1-1/` MUST be rewritten to `KEY-1/`
- AND paths with `section-1-1/` MUST be rewritten to `KEY-1/`
- AND paths with `section-2-1/` MUST be rewritten to `KEY-2/`
- AND paths with `section-2-2/` MUST be rewritten to `KEY-2/`

## Actual

- Link to Term 1.1.1.1
- Link to Term 1.1.1.2
- Link to Term 1.1.1.3
- Link to Term 1.2.1.1
- Link to Term 1.2.1.2
- Link to Term 1.2.1.3
- Link to Term 2.0.1
- Link to Term 2.0.2
- Link to Term 2.0.3
- Link to Term 2.1.1.1
- Link to Term 2.1.1.2
- Link to Term 2.1.1.3
- Link to Term 2.1.2.1
- Link to Term 2.1.2.2
- Link to Term 2.1.2.3
