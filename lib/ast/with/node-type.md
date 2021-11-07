# Syntax Extensions and Custom Node Types

> This is meant to be read by [glossarify-md] *developers* (not users)

Custom node types need to adhere to a minimal interface:

~~~js
const SYMBOL = Symbol('myNode');
class MyNode {
    constructor() {
      this.type = SYMBOL;
    }
}
// ...if node.js support matrix permits it, use 'static' class fields
MyNode.type = SYMBOL;
MyNode.syntax = function() {}           // see micromark
MyNode.fromMarkdown = function() {}     // see mdast-util-from-markdown
MyNode.toMarkdown = function() {}       // see mdast-util-to-markdown
~~~

The interface reflects the overall process defined by [micromark] and implementation of those methods requires some deeper understanding of [micromark] and related projects:

*Figure 1: Parsing, Manipulating, Serializing*
~~~
1. Input            | .~~~~ ['#','F','o','o','EOL'] <~~~ file.md
                    | |
2. Tokenize         | `~~~~ micromark(symbols) => tokens ~~~~~~~~~~~~~~~~~~~~~~.
                    |                                                          o)-- syntax(symbols) => token
3. Token Stream     | .~~ ['enter:atxHeading','F','o','o','exit:atxHeading'] ~~'
                    | |
4. Grow Syntax Tree | `~~~> mdast-util-from-markdown(tokens) => treeNode ~~~~~~.
                    |                                                 o        o)-- fromMarkdown(tokens) => treeNode
5. Transform Tree   | .~~~~ transform(treeNode) => treeNode ~~~~~~~~ / \  ~~~~~'
                    | |                                             o   o
6. Serialize        | `~~~~ mdast-util-to-markdown(treeNode) => string ~~~~~~~~.
                    |                                                          o)-- toMarkdown(treeNode) => string
7. Output           | <~~~~ ['#','F','o','o','EOL'] <~~~~~~~~~~~~~~~~~~~~~~~~~~'
~~~

## `syntax()`

If your node type is a type that is only to be inserted as part of modifying or extending an existing [AST] then there's nothing to implement here. Otherwise if the node type is to be created from parsing textual syntax in input documents then it must return an instance of a [micromark] [SyntaxExtension]:

~~~js
{
  // type: "SyntaxExtension"
  document: { ... }
  text: { ... }
  flow: { ... }
}
~~~

> *"A syntax extension is an object whose fields are the names of hooks,
> referring to where constructs “hook” into."* Source: [micromark-syntax-extension]

For a deeper understanding of the different hooks familiarize yourself with [micromark] and the Common Markup State Machine ([CMSM]). We'll focus on the pipeline principles, for now. A [SyntaxExtension] "hook" must be associated with mappings of character codes onto syntax [Construct]s:

*Example: SyntaxExtension*
~~~js
{
    // type: "SyntaxExtension"
    document: {
        91: {
            // type: "Construct"
            tokenize: function(effects, ok, nok) {...}
        }
    },
    ...
}
~~~

See also built-in [micromark-constructs]. A good example may also be [micromark-extension-footnote].

The character code determines the first character participating in a syntax construct which when found causes the extension's `tokenize(effects, ok, nok)` function to be invoked.

*Example: Tokenizer in [micromark-extension-footnote]:*
~~~js
function tokenizeDefinitionStart(effects, ok, nok) {
  // ... some initializations then return initial state function
  return start

  function start(code) {
    if (code !== 91) {
      return nok(code)
    }

    effects.enter('footnoteDefinition')._container = true
    effects.enter('footnoteDefinitionLabel')
    effects.enter('footnoteDefinitionLabelMarker')
    effects.consume(code)
    effects.exit('footnoteDefinitionLabelMarker')
    return labelStart
  }

  function labelStart(code) {
      if (code !== 94) return nok(code)
      // ...
      return atBreak
  }
}
~~~

[Tokenize] functions...

- ...return a [State] function representing the *initial state* of the syntax state machine (*state-as-a-function* pattern). State functions need access to `effects, ok, nok` so may be realised as inner functions.

[State] functions...

1. ...receive the *current input character* at the head of the *character input stream*. Initially this *should* be the character the whole [Construct] has been mapped onto, so `91` in the examples above.

1. ...return a [State] function to use for the next character

1. ...*need to make sure, that the input character they receive is a character or character range it expects*. If not it should return the [NotOkay] state via `return nok(code)`.

1. ...must only return the [Okay] state if it is the final state

Given the character is an expected one, then a State function...

1. ...enqueues a *Start Token* on the token queue using `effects.enter(token)`
   - we recommend using `Symbol()` instead of strings to guarantee a unique name
1. ...consumes the *current character* using `effects.consume(code)`
1. ...at some point enqueues an *End Token* using  `effects.exit()`

So in the example above we see all this realized as...

- a [Tokenize] function `tokenizeDefinitionStart()` which returns a `start()` [State] function
- how `start()`
  1. tests for the right character
  1. puts a `"footnoteDefinitionLabelMarker"` *Start Token* onto the queue
  1. then consumes a syntax control character
  1. then puts a `"footnoteDefinitionLabelMarker"` *End Token* onto the queue
  1. eventually returns another [State] function `labelStart()`
- how `labelStart()` continues consuming the *next* character from the input stream
  1. and once again makes sure the character is one it expects
  1. and eventually returns yet another [State] function and so on...

What we can not directly see from the example, but guess, is that those tokens entered but not yet exited [will be exited at some point][micromark-extension-footnote] using `effects.exit(...)` and that eventually when processing the syntax construct is done `ok(code)` will be invoked.

## `fromMarkdown()`

> If your node type is a node that is only to be inserted as part of modifying or extending an existing [AST], then there's nothing to implement! (Remind Figure 1 above).

We have written our custom syntax tokens onto the token queue by implementing `syntax()`. If we want the tokens and data to make it into an [AST] we need some place which creates AST-[Node]s from the tokens. This is what an implementation of `fromMarkdown()` is concerned with. In particular it creates an [mdAST], that is, an [AST] *for Markdown*. For now we refer to [mdast-util-from-markdown] for any further examples.


## `toMarkdown()`

This method returns an [mdast-util-to-markdown] options object. The method must be implemented for any node type in the [AST]. It must even be implemented for nodes that might not have any serialized representation. However, in the latter case an implementation is pretty simple:

~~~js
const SYMBOL = Symbol("myNode");
class MyNode {
    static toMarkdown() {
        return {
            handlers: { [SYMBOL]: (node) => "" }
        };
    }
}
~~~

Otherwise your [`handler`][mdast-util-to-markdown-handlers] were concerned with taking `node` which might be a subtree and serialize it into a string representation. Also have a look at the [`unsafe`][mdast-util-to-markdown-unsafe] option to register various characters that might be *unsafe* to use in the
context of your syntax construct.

## Register Custom Node Type

Eventually we need to register our custom node type with the pipeline shown in
Figure 1. We've written a utility function `withNodeType()` to handle that:

*lib/reader.js*
~~~js
    unifiedNgin(
        {
            processor: unified()
                .use(withNodeType(TocInstructionNode))
                .use(withNodeType(TermDefinitionNode))
                .use(withNodeType(TermDefinitionNode))
                .use(withNodeType(MyNode))
                // ...
~~~

Internally `withNodeType` calls our Node Type's `syntax()`, `fromMarkdown()` and
`toMarkdown()` and pushes the results into Arrays

- `micromarkExtensions: [...] `
- `fromMarkdownExtensions: [...]`
- `toMarkdownExtensions: [...]`

in the [unified.processor][unified] context.

[AST]: https://github.com/syntax-tree/unist "Abstract Syntax Tree"
[Node]: https://github.com/syntax-tree/unist#node
[mdAST]: https://github.com/syntax-tree/mdast
[CMSM]: https://github.com/micromark/common-markup-state-machine#6-parsing
[Construct]: https://github.com/micromark/micromark/blob/2.11.1/lib/shared-types.d.ts#L167
[Okay]: https://github.com/micromark/micromark/blob/2.11.1/lib/shared-types.d.ts#L142
[NotOkay]: https://github.com/micromark/micromark/blob/2.11.1/lib/shared-types.d.ts#L147
[State]: https://github.com/micromark/micromark/blob/2.11.1/lib/shared-types.d.ts#L137
[SyntaxExtension]: https://github.com/micromark/micromark/blob/2.11.1/lib/shared-types.d.ts#L210
[Tokenize]: https://github.com/micromark/micromark/blob/2.11.1/lib/shared-types.d.ts#L165
[micromark]: https://github.com/micromark/micromark
[micromark-constructs]: https://github.com/micromark/micromark/blob/main/lib/constructs.mjs
[micromark-syntax-extension]: https://github.com/micromark/micromark#syntaxextension
[micromark-extension-footnote]: https://github.com/micromark/micromark-extension-footnote/blob/0.3.2/index.js#L35
[mdast-util-from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown
[mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown
[mdast-util-to-markdown-handlers]: https://github.com/syntax-tree/mdast-util-to-markdown#optionshandlers
[mdast-util-to-markdown-unsafe]: https://github.com/syntax-tree/mdast-util-to-markdown#optionsunsafe
[unified]: https://github.com/unifiedjs/unified#processordatakey-value
[glossarify-md]: https://github.com/about-code/glossarify-md
