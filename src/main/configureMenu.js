import edit from './menus/edit'
import file from './menus/file'
import help from './menus/help'
import marky from './menus/marky'
import view from './menus/view'
import windowMenu from './menus/windowMenu'

export default function configureMenu ({app}) {
  let template = process.platform === 'darwin'
    ? [marky({app})]
    : []
  return [
    ...template,
    file,
    edit,
    windowMenu,
    view,
    help
  ]
}
