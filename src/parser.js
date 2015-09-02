import markdown from 'markdown-it';
import mdHljsPlugin from 'markdown-it-highlightjs';

const parser = markdown({
  html: true,
  typographer: true
}).use(mdHljsPlugin);

export default parser;
