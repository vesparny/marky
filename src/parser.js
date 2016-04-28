import markdown from 'markdown-it'
import mdHljsPlugin from 'markdown-it-highlightjs'
import emoji from 'markdown-it-emoji'

const parser = markdown({
  html: true,
  typographer: true
})
  .use(emoji)
  .use(mdHljsPlugin)

export default parser
