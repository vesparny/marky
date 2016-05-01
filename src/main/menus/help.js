import { shell } from 'electron'

export default {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Learn More',
    click: function () {
      shell.openExternal('https://github.com/vesparny/marky#marky')
    }
  }, {
    label: 'Report Issue',
    click: function () {
      shell.openExternal('https://github.com/vesparny/marky/issues')
    }
  }, {
    label: 'Source Code on GitHub',
    click: function () {
      shell.openExternal('https://github.com/vesparny/marky')
    }
  }, {
    label: 'Changelog',
    click: function () {
      shell.openExternal('https://github.com/vesparny/marky/blob/master/CHANGELOG.md')
    }
  }, {
    label: 'Markdown syntax',
    click: function () {
      shell.openExternal('https://daringfireball.net/projects/markdown/syntax')
    }
  }, {
    type: 'separator'
  }, {
    label: 'Follow @vesparny on Twitter',
    click: function () {
      shell.openExternal('https://twitter.com/vesparny')
    }
  }]
}
