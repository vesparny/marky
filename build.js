#!/usr/bin/env node

/**
 * Builds app binaries for OS X, Linux, and Windows.
 */
const webpack = require('webpack')
const electronCfg = require('./webpack.config.electron')
const cfg = require('./webpack.config.prod')
var cp = require('child_process')
var electronPackager = require('electron-packager')
var fs = require('fs')
var minimist = require('minimist')
// const os = require('os')
var mkdirp = require('mkdirp')
var path = require('path')
var rimraf = require('rimraf')
var series = require('run-series')
var zip = require('cross-zip')

var pkg = require('./package.json')

var BUILD_NAME = pkg.productName + '-v' + pkg.version

var DIST_PATH = path.join(__dirname, 'release')
var ROOT_PATH = __dirname

var argv = minimist(process.argv.slice(2), {
  boolean: [
    'sign'
  ],
  default: {
    package: 'exe',
    sign: false
  },
  string: [
    'package'
  ]
})

function buildWebpack (cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function build () {
  rimraf.sync(DIST_PATH)
  var platform = argv._[0]
  if (platform === 'darwin') {
    buildDarwin(printDone)
  } else if (platform === 'win32') {
    buildWin32(printDone)
  } else if (platform === 'linux') {
    buildLinux(printDone)
  } else {
    buildDarwin(function (err) {
      printDone(err)
      buildWin32(function (err) {
        printDone(err)
        buildLinux(printDone)
      })
    })
  }
}

var all = {
  // Build 64 bit binaries only.
  arch: 'x64',

  // The human-readable copyright line for the app. Maps to the `LegalCopyright` metadata
  // property on Windows, and `NSHumanReadableCopyright` on OS X.
  'app-copyright': 'Copyright © 2016-present Alessandro Arnodo',

  // The release version of the application. Maps to the `ProductVersion` metadata
  // property on Windows, and `CFBundleShortVersionString` on OS X.
  'app-version': pkg.version,

  // Package the application's source code into an archive, using Electron's archive
  // format. Mitigates issues around long path names on Windows and slightly speeds up
  // require().
  asar: true,

  // A glob expression, that unpacks the files with matching names to the
  // "app.asar.unpacked" directory.
  'asar-unpack': 'Marky*',

  // The build version of the application. Maps to the FileVersion metadata property on
  // Windows, and CFBundleVersion on OS X. We're using the short git hash (e.g. 'e7d837e')
  // Windows requires the build version to start with a number :/ so we stick on a prefix
  'build-version': '0-' + cp.execSync('git rev-parse --short HEAD').toString().replace('\n', ''),

  // The application source directory.
  dir: ROOT_PATH,

  // Pattern which specifies which files to ignore when copying files to create the
  // package(s).
  ignore: [
    '^/release'
  ],
  // ignore: /^\/dist|\/(\.appveyor.yml|\.github|appdmg|AUTHORS|CONTRIBUTORS|bench|benchmark|benchmark\.js|bin|bower\.json|component\.json|coverage|doc|docs|docs\.mli|dragdrop\.min\.js|example|examples|example\.html|example\.js|externs|ipaddr\.min\.js|Makefile|min|minimist|perf|rusha|simplepeer\.min\.js|simplewebsocket\.min\.js|static\/screenshot\.png|test|tests|test\.js|tests\.js|webtorrent\.min\.js|\.[^\/]*|.*\.md|.*\.markdown)$/,

  // The application name.
  name: pkg.productName,

  // The base directory where the finished package(s) are created.
  out: DIST_PATH,

  // Replace an already existing output directory.
  overwrite: true,

  // Runs `npm prune --production` which remove the packages specified in
  // "devDependencies" before starting to package the app.
  prune: true,

  // The Electron version with which the app is built (without the leading 'v')
  version: pkg.dependencies['electron-prebuilt']
}

var darwin = {
  platform: 'darwin',

  // The bundle identifier to use in the application's plist (OS X only).
  'app-bundle-id': 'net.arnodo.marky',

  // The application category type, as shown in the Finder via "View" -> "Arrange by
  // Application Category" when viewing the Applications directory (OS X only).
  'app-category-type': 'public.app-category.utilities',

  // The bundle identifier to use in the application helper's plist (OS X only).
  'helper-bundle-id': 'io.webtorrent.marky-helper',

  // Application icon.
  icon: path.join(__dirname, 'assets', 'icon') + '.icns'
}

var win32 = {
  platform: 'win32',

  // Build 32 bit binaries only.
  arch: 'ia32',

  // Object hash of application metadata to embed into the executable (Windows only)
  'version-string': {
    // Company that produced the file.
    CompanyName: pkg.productName,

    // Name of the program, displayed to users
    FileDescription: pkg.productName,

    // Original name of the file, not including a path. This information enables an
    // application to determine whether a file has been renamed by a user. The format of
    // the name depends on the file system for which the file was created.
    OriginalFilename: pkg.productName + '.exe',

    // Name of the product with which the file is distributed.
    ProductName: pkg.productName,

    // Internal name of the file, if one exists, for example, a module name if the file
    // is a dynamic-link library. If the file has no internal name, this string should be
    // the original filename, without extension. This string is required.
    InternalName: pkg.productName
  },

  // Application icon.
  icon: path.join(__dirname, 'assets', 'icon.ico')
}

var linux = {
  platform: 'linux',

  // Build 32/64 bit binaries.
  arch: 'all'

// Note: Application icon for Linux is specified via the BrowserWindow `icon` option.
}

buildWebpack(electronCfg)
  .then(() => buildWebpack(cfg))
  .then(build)
  .catch(printDone)

function buildDarwin (cb) {
  var plist = require('plist')

  console.log('OS X: Packaging electron...')
  electronPackager(Object.assign({}, all, darwin), function (err, buildPath) {
    if (err) return cb(err)
    console.log('OS X: Packaged electron. ' + buildPath[0])

    var appPath = path.join(buildPath[0], pkg.productName + '.app')
    var contentsPath = path.join(appPath, 'Contents')
    var resourcesPath = path.join(contentsPath, 'Resources')
    var infoPlistPath = path.join(contentsPath, 'Info.plist')
    var infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'))

    // TODO: Use new `extend-info` and `extra-resource` opts to electron-packager,
    // available as of v6.
    infoPlist.CFBundleDocumentTypes = [
      {
        CFBundleTypeExtensions: require('./src/constants/globals').EXTENSIONS,
        CFBundleTypeIconFile: 'iconFile.icns',
        CFBundleTypeName: 'Markdown Document',
        CFBundleTypeRole: 'Editor',
        LSHandlerRank: 'Owner',
        LSItemContentTypes: ['net.daringfireball.markdown']
      }
    ]

    fs.writeFileSync(infoPlistPath, plist.build(infoPlist))

    // Copy file icon into app bundle
    cp.execSync(`cp ${path.join(__dirname, 'assets', 'iconFile') + '.icns'} ${resourcesPath}`)

    if (process.platform === 'darwin') {
      if (argv.sign) {
        signApp(function (err) {
          if (err) return cb(err)
          pack(cb)
        })
      } else {
        printWarning()
        pack(cb)
      }
    } else {
      printWarning()
    }

    function signApp (cb) {
      var sign = require('electron-osx-sign')

      /*
       * Sign the app with Apple Developer ID certificates. We sign the app for 2 reasons:
       *   - So the auto-updater (Squirrrel.Mac) can check that app updates are signed by
       *     the same author as the current version.
       *   - So users will not a see a warning about the app coming from an "Unidentified
       *     Developer" when they open it for the first time (OS X Gatekeeper).
       *
       * To sign an OS X app for distribution outside the App Store, the following are
       * required:
       *   - Xcode
       *   - Xcode Command Line Tools (xcode-select --install)
       *   - Membership in the Apple Developer Program
       */
      var signOpts = {
        app: appPath,
        platform: 'darwin',
        verbose: true
      }

      console.log('OS X: Signing app...')
      sign(signOpts, function (err) {
        if (err) return cb(err)
        console.log('OS X: Signed app.')
        cb(null)
      })
    }

    function pack (cb) {
      packageZip() // always produce .zip file, used for automatic updates

      if (argv.package === 'dmg' || argv.package === 'all') {
        packageDmg(cb)
      }
    }

    function packageZip () {
      // Create .zip file (used by the auto-updater)
      console.log('OS X: Creating zip...')

      var inPath = path.join(buildPath[0], pkg.productName + '.app')
      var outPath = path.join(DIST_PATH, BUILD_NAME + '-darwin.zip')
      zip.zipSync(inPath, outPath)

      console.log('OS X: Created zip.')
    }

    function packageDmg (cb) {
      console.log('OS X: Creating dmg...')

      var appDmg = require('appdmg')

      var targetPath = path.join(DIST_PATH, BUILD_NAME + '.dmg')
      rimraf.sync(targetPath)

      // Create a .dmg (OS X disk image) file, for easy user installation.
      var dmgOpts = {
        basepath: ROOT_PATH,
        target: targetPath,
        specification: {
          title: pkg.productName,
          icon: path.join('assets', 'icon.icns'),
          background: path.join('assets', 'appdmg.png'),
          'icon-size': 128,
          contents: [
            { x: 122, y: 240, type: 'file', path: appPath },
            { x: 380, y: 240, type: 'link', path: '/Applications' }
          ]
        }
      }

      var dmg = appDmg(dmgOpts)
      dmg.on('error', cb)
      dmg.on('progress', function (info) {
        if (info.type === 'step-begin') console.log(info.title + '...')
      })
      dmg.on('finish', function (info) {
        console.log('OS X: Created dmg.')
        cb(null)
      })
    }
  })
}

function buildWin32 (cb) {
  var installer = require('electron-winstaller')

  console.log('Windows: Packaging electron...')

  /*
   * Path to folder with the following files:
   *   - Windows Authenticode private key and cert (authenticode.p12)
   *   - Windows Authenticode password file (authenticode.txt)
   */
   /*
  var CERT_PATH
  try {
    fs.accessSync('D:')
    CERT_PATH = 'D:'
  } catch (err) {
    CERT_PATH = path.join(os.homedir(), 'Desktop')
  }
  */
  electronPackager(Object.assign({}, all, win32), function (err, buildPath) {
    if (err) return cb(err)
    console.log('Windows: Packaged electron. ' + buildPath[0])

    /*
    var signWithParams
    if (process.platform === 'win32') {
      if (argv.sign) {
        var certificateFile = path.join(CERT_PATH, 'authenticode.p12')
        var certificatePassword = fs.readFileSync(path.join(CERT_PATH, 'authenticode.txt'), 'utf8')
        var timestampServer = 'http://timestamp.comodoca.com'
        signWithParams = `/a /f "${certificateFile}" /p "${certificatePassword}" /tr "${timestampServer}" /td sha256`
      } else {
        printWarning()
      }
    } else {
      printWarning()
    }
    */

    var tasks = []
    if (argv.package === 'exe' || argv.package === 'all') {
      tasks.push((cb) => packageInstaller(cb))
    }
    if (argv.package === 'portable' || argv.package === 'all') {
      tasks.push((cb) => packagePortable(cb))
    }
    series(tasks, cb)

    function packageInstaller (cb) {
      console.log('Packaging windows installer...')
      installer.createWindowsInstaller({
        appDirectory: buildPath[0],
        authors: 'Alessandro Arnodo',
        description: pkg.productName,
        exe: pkg.productName + '.exe',
        iconUrl: 'https://github.com/vesparny/marky/tree/master/assets/icon.ico',
        // loadingGif: path.join(config.STATIC_PATH, 'loading.gif'),
        name: pkg.productName,
        noMsi: true,
        outputDirectory: DIST_PATH,
        productName: pkg.productName,
        // remoteReleases: config.GITHUB_URL,
        setupExe: pkg.productName + 'Setup-v' + pkg.version + '.exe',
        setupIcon: path.join(__dirname, 'assets', 'icon') + '.ico',
        // signWithParams: signWithParams,
        title: pkg.productName,
        usePackageJson: false,
        version: pkg.version
      })
        .then(function () {
          console.log('Windows: Created installer.')
          cb(null)
        })
        .catch(cb)
    }

    function packagePortable (cb) {
      // Create Windows portable app
      console.log('Windows: Creating portable app...')

      var portablePath = path.join(buildPath[0], 'Portable Settings')
      mkdirp.sync(portablePath)

      var inPath = path.join(DIST_PATH, path.basename(buildPath[0]))
      var outPath = path.join(DIST_PATH, BUILD_NAME + '-win.zip')
      zip.zipSync(inPath, outPath)

      console.log('Windows: Created portable app.')
      cb(null)
    }
  })
}

function buildLinux (cb) {
  console.log('Linux: Packaging electron...')
  electronPackager(Object.assign({}, all, linux), function (err, buildPath) {
    if (err) return cb(err)
    console.log('Linux: Packaged electron. ' + buildPath[0])

    var tasks = []
    buildPath.forEach(function (filesPath) {
      var destArch = filesPath.split('-').pop()

      if (argv.package === 'deb' || argv.package === 'all') {
        tasks.push((cb) => packageDeb(filesPath, destArch, cb))
      }
      if (argv.package === 'zip' || argv.package === 'all') {
        tasks.push((cb) => packageZip(filesPath, destArch, cb))
      }
    })
    series(tasks, cb)
  })

  function packageDeb (filesPath, destArch, cb) {
    // Create .deb file for Debian-based platforms
    console.log(`Linux: Creating ${destArch} deb...`)

    var deb = require('nobin-debian-installer')()
    var destPath = path.join('/opt', pkg.name)

    deb.pack({
      package: pkg,
      info: {
        arch: destArch === 'x64' ? 'amd64' : 'i386',
        targetDir: DIST_PATH,
        depends: 'libc6 (>= 2.4)'
      }
    }, [{
      src: ['./**'],
      dest: destPath,
      expand: true,
      cwd: filesPath
    }], function (err) {
      if (err) return cb(err)
      console.log(`Linux: Created ${destArch} deb.`)
      cb(null)
    })
  }

  function packageZip (filesPath, destArch, cb) {
    // Create .zip file for Linux
    console.log(`Linux: Creating ${destArch} zip...`)

    var inPath = path.join(DIST_PATH, path.basename(filesPath))
    var outPath = path.join(DIST_PATH, BUILD_NAME + '-linux-' + destArch + '.zip')
    zip.zipSync(inPath, outPath)

    console.log(`Linux: Created ${destArch} zip.`)
    cb(null)
  }
}

function printDone (err) {
  if (err) console.error(err.message || err)
}

/*
 * Print a large warning when signing is disabled so we are less likely to accidentally
 * ship unsigned binaries to users.
 */
function printWarning () {
  console.warn('############')
  console.warn('WARNING: ---- Unsigned app ----')
  console.warn('############')
}
