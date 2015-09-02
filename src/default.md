# An h1 header

Paragraphs are separated by a blank line.

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺



## An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

 Here's an unordered list:

  * first item
  * second item
  * third item


**code with syntax higlight**

```js
const func = (val) => {
  // some code
  console.log(val);
}

componentDidMount() {
  const debouncedEditorScrollHandler = debounce(this.onPaneScroll.bind(this, 'editor'), 10);
  const debouncedPreviewScrollHandler = debounce(this.onPaneScroll.bind(this, 'preview'), 10);
  const bindEvents = (targetElRefName) => () => {
    const scrollHandler = targetElRefName === 'editor' ? debouncedEditorScrollHandler : debouncedPreviewScrollHandler;
    // unbind all
    React.findDOMNode(this.refs.editor).removeEventListener('scroll', debouncedEditorScrollHandler)
    React.findDOMNode(this.refs.preview).removeEventListener('scroll', debouncedPreviewScrollHandler)
    // bind right one
    React.findDOMNode(this.refs[targetElRefName]).addEventListener('scroll', scrollHandler)
  }
  ```
