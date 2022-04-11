<p align="center"><br><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="128" height="128" /></p>

<h3 align="center">SolidJS Vite SQLite App</h3>
<p align="center"><strong><code>capacitor-solid-sqlite</code></strong></p>
<p align="center">SolidJS application demonstrating the use of the</p>
<p align="center"><strong><code>@capacitor-community/sqlite</code></strong></p>
<br>
<p align="center"><strong><code>this app uses Capacitor3</code></strong></p>
<br>
<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2021?style=flat-square" />
  <a href="https://github.com/jepiqueau/capacitor-solid-sqlite"><img src="https://img.shields.io/github/license/jepiqueau/capacitor-solid-sqlite?style=flat-square" /></a>
  <a href="https://github.com/jepiqueau/capacitor-solid-sqlite"><img src="https://img.shields.io/github/package-json/v/jepiqueau/capacitor-solid-sqlite/master?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all%20contributors-1-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>

## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |


## Installation

```bash
git clone https://github.com/jepiqueau/capacitor-solid-sqlite.git 
cd capacitor-solid-sqlite
git remote rm origin
```

 - then install it

```bash
npm install
```

 - then go to the building process

```bash
npm run build
npx cap sync
npm run build
npx cap copy
```

the capacitor config parameters are:

```
  "appId": "com.jeep.app.solidjs",
  "appName": "capacitor-solid-sqlite",
```

### Building Web Code

The `@capacitor-community/sqlite` is now implementing sqlite for Web Browsers using a companion Stencil component `jeep-sqlite` which itself is based on `sql.js` for in-memory and `localforage` for storing the database in an IndexedDB storage.
if you run

```bash
npm run serve
```

### Building Native Project


#### Android

```bash
npx cap open android
```
Once Android Studio launches, you can build your app through the standard Android Studio workflow.

### iOS

```bash
npx cap open ios
```


### Test SQLite access

The ```@capacitor-community/sqlite``` test are accessible through the home page menu.

 - NoEncryption

### Documentation

To use the `@capacitor-community/sqlite`, have a look to the documentation folder [documentation sqlite](https://github.com/capacitor-community/sqlite/tree/master/docs)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jepiqueau"><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="100px;" alt=""/><br /><sub><b>Jean Pierre Quéau</b></sub></a><br /><a href="https://github.com/jepiqueau/capacitor-solid-sqlite/commits?author=jepiqueau" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
