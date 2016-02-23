# posthtml-css-modules
[![npm version](https://badge.fury.io/js/posthtml-css-modules.svg)](http://badge.fury.io/js/posthtml-css-modules)
[![Build Status](https://travis-ci.org/maltsev/posthtml-css-modules.svg?branch=master)](https://travis-ci.org/maltsev/posthtml-css-modules)

[PostHTML](https://github.com/posthtml/posthtml) plugin that inlines [CSS modules](https://github.com/css-modules/css-modules) in HTML.


## Usage
I suggest using [postcss-modules](https://github.com/outpunk/postcss-modules) to generate CSS modules.

### Global file
Let's say we have `cssClasses.json` with all CSS modules inside:
```json
{
  "title": "_title_116zl_1 _heading_9dkf",
  "profile": {
    "user": "_profile_user_f93j"
  }
}
```

Now we can inline these CSS modules in our HTML:
```js
var posthtml = require('posthtml');

posthtml([require('posthtml-css-modules')('./cssClasses.json')])
    .process(
        '<h1 css-module="title">My profile</h1>' +
        // You can also use nested modules
        '<div css-module="profile.user">John</div>'
    )
    .then(function (result) {
        console.log(result.html);
    });

// <h1 class="_title_116zl_1 _heading_9dkf">My profile</h1>
// <div class="_profile_user_f93j">John</div>
```

### Directory with several files
CSS modules could be also separated into several files.
For example, `profile.js` and `article.js` inside directory `cssModules/`:
```js
// profile.js
module.exports = {
  user: '_profile_user_f93j'
}
```

```js
// article.js
module.exports = {
  title: '_article__tile _heading'
}
```
You can use both JS and JSON for a declaration, as long as the file could be required via `require()`.

```js
var posthtml = require('posthtml');

posthtml([require('posthtml-css-modules')('./cssModules/')])
    .process(
        '<div class="baseWrapper" css-module="profile.user">John</div>' +
        '<h2 css-module="article.title"></h2>'
    )
    .then(function (result) {
        console.log(result.html);
    });

// <div class="baseWrapper _profile_user_f93j">John</div>
// <h2 class="_article__tile _heading"></h2>
```
