import semver from 'semver'
import superagent from 'superagent'
import { version as currentVersion } from '../../package.json'

export default function autoUpdater (callback) {
  superagent
  .get('https://raw.githubusercontent.com/vesparny/marky/master/package.json')
  .end((err, res) => {
    if (!err || res.ok) {
      try {
        const newVersion = JSON.parse(res.text).version
        if (semver.gt(newVersion, currentVersion)) {
          callback(null, newVersion)
        }
      } catch (err) {
        callback(err)
      }
    } else {
      callback(err)
    }
  })
}
