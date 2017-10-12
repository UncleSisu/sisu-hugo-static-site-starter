# Sisu Hugo Static Site Starter

This is a boilerplate for using [Hugo](https://gohugo.io/) as a static site generator and Gulp +
Webpack as your asset pipeline. Initially based on [victor-hugo](https://github.com/netlify/victor-hugo)


## Stack

### Client
- [Modernizr](https://modernizr.com) - Browser feature detection (touch-events)

### Development

- [Hugo](https://gohugo.io/) - Generate static site
- [Gulp](http://gulpjs.com/) - Efficient, configurable, streaming task runner
- [BrowserSync](https://www.browsersync.io/) - Live reload changes
- [Webpack 2.6](https://webpack.github.io) - Automatic common module chunk bundling and tree shaking
- [Babel](https://babeljs.io/) - Use the latest ECMAScript features
- [Sass](http://sass-lang.com/) - Easier CSS dev with variables, nesting, partials, import, mixins, inheritance, and operators
- [PostCSS](http://postcss.org/) - Autoprefix CSS
- [ESLint](http://eslint.org/) - Catch syntax and style issues

## To Do
- [ ] Type checking with Flow
- [ ] Progressive web app with offline support?
- [ ] Adjust Gulp to only update changed files
- [ ] Improve Readme documentation
- [ ] Add better example site starting point

## Get Started

1. Install [Hugo](http://gohugo.io/overview/installing/)
1. Install [Node v6.9+](https://nodejs.org/en/) globally if you don't have it already
1. Install [Yarn](https://yarnpkg.com/) globally if you don't have it already
1. Clone or download this repo
1. Using terminal change directories to the project root `cd /path/to/hugo-starter`
1. Install dependencies by running `yarn`
1. Run any of the available commands found below

## Commands

| Command | Description |
|---------|-------------|
| `yarn` | Install dependencies |
| `yarn dev` | - Transpile CSS and Javascript <br>- View at [http://localhost:3000/](http://localhost:3000/) <br>- BrowserSync will automatically reload CSS or refresh the page when stylesheets or content changes. |
| `yarn build` | Use Gulp to build your static output to the `/dist` folder |
| `yarn build-preview` | - `build`, including drafts and future posts |
| `yarn lint` | Lint code using ESLint |
| `hugo new <page-name>.md` | Create new page in `content` directory |
| `hugo new <content-type>/<content-name>.md` | Create new file in `content/<content-type>` directory |

## Project Structure

- **dist** - Files compiled by the Gulp/Hugo build pipeline
- **src** - Files that will pass through the Gulp/Hugo build pipeline and be output in the `dist` directory
	- **data** - Custom data in YAML/JSON/TOML files to be used in templates, shortcodes, and javascript
	- **docs** - PDFs and other static files that can be linked to. Copied over to the `dist` directory
  - **fonts** - Copied over to the `dist` directory
	- **images** - Copied over to the `dist` directory
	- **markup** - Everything in here will be built with Hugo
		- **archetypes** - Blueprints that define default [front mater](https://gohugo.io/content/front-matter/) and Markdown structure for different types of content. (e.g. Post, Tutorial, Product)
		- **content** - Content pages and sections
			- **< section-name >** - Nested group of pages. Renders to example.com/section-name. (e.g. posts, tutorials, products)
			- `page-name.md` - Individual page. Renders to example.com/page-name
		- **layouts** - Template files using the [Go html/template language](https://gohugo.io/templates/go-templates/)
			- **_defaults** - Default templates
			- **partials** - Reusable template partials (e.g. header, footer)
			- **shortcodes** - Reusable partials used inside templates
			- **< content-type >** - Templates for custom content type (e.g. posts, tutorials, products)
			- `index.html` - The index page
	- **scripts** - Scripts will be compiled with Webpack. See `webpack.config.js` for more details
		- **components** - javascript class files grouped by the areas of the application that they are used
		- **constants** - Constants groups into files by type (ActionTypes.js, NotificationTypes.js, etc..)
		- **services** - Stand-alone JavaScript modules (non-class components)
		- `scripts.js` - File is the entrypoint for webpack and will be built to `/dist/scripts.js`
	- **styles** - Sass files in the root of this folder will end up in /css/...
- `config.toml` - Site wide Hugo configuration. (e.g. Title, global variables, permalinks)
- `dotfiles` - Various configs for the different parts of the stack

## Author Workflow

Everything is a 'Page'. Where you put the page and the front matter (meta data) you give it is what
makes it a post, tutorial, product, etc...

To create a new page run

```
hugo new <page-name>.md
```

This will use the `page` archetype as a blueprint to create a new markdown file in the `site/content` directory.

To create a new file that is a custom content type (e.g. post, tutorial, product) run

```
hugo new <content-type>/<content-name>.md
```

This will use the matching archetype asa blueprint to create a new markdown file in `content/<content-type>` directory.

Leveraging content archetypes the content builder will not only insert the current date and appropriate metadata, but it will pre-populate values based on the content type.

## Front Matter

Meta data for a page found at the top of the markdown file.

```
+++
categories = []
date = "2017-05-31T15:21:13+10:00"
draft = true
slug = ""
tags = []
title = "My Example"
+++
```

Default front mater for different content types can be found in the `site/archetypes` directory.
The name of the markdown file matches the directory name for that content type in `site/content`
(e.g. `site/archetypes/post.md` is for the `site/content/posts` directory)

### Variables

- **title** - The title for the content
- **description** - The description for the content. Used for page meta data (SEO)
- **date** - The date the content will be sorted by. Automatically added when using `hugo new` command
- **publishdate** - If in the future, content will not be rendered unless using `yarn build-preview`
- **< taxonomy >** - e.g. categories, tags
- **draft** - If true, the content will not be rendered unless using `yarn build-preview`
- **weight** - Used for sorting instead of the date
- **slug** - Can be used to change the part of the url that is based on the filename

See [the Hugo Docs](https://gohugo.io/content/front-matter/) for other variables that are used less often.

## Custom Content Types

A custom content type can have a unique set of meta data and template.

Type is determined by which section directory the page's markdown file is inside the `site/content` directory.

e.g. A post would be in `site/content/post` while tutorial would be in `site/content/tutorial`

## Development Workflow

For assets that are completely static and don't need to go through the asset pipeline,
use the `site/static` folder (e.g. images, font files).

Files in the static folder ends up in the web root. So a file called `site/static/favicon.ico`
will end up being available as `/favicon.ico`.

You can use ES6 and use both relative imports or import libraries from npm.

Any CSS file directly under the `src/css/` folder will get compiled with [PostCSS Next](http://cssnext.io/)
to `/dist/css/{filename}.css`. Import statements will be resolved as part of the build

### Templates

Template files are all located in the `site/layouts` directory.

#### Template types

##### Primary templates:

- Single - Render a single piece of content
- List - Page that list multiple pieces of content
- Homepage - The home page of your site

##### Secondary templates:

- Partials - Common page parts included in templates
- Content Views - Different ways of rendering a single content type
- Taxonomy Terms - A list of the terms used for a specific taxonomy (e.g. all the categories)
- RSS - Render RSS feed
- Sitemap - Render XML sitemap for SEO purposes
- 404 - 404 page
- Alias - Override the default page used to create aliases of pages

#### Partials

```go
{{ partial "header" . }}
```

Notice that the partials folder is left off the path. You can organize partials within subfolders, but the partials folder should still be left off of the path.

##### SVG Partials

Store SVGs that will be inlined in the `site/layouts/partials/svgs` directory. You can then add them
by using:

```go
{{ partial "svgs/search.svg" . }}
```

To add a class to your SVG:

```go
// in svg
<svg class="{{ .class }}">...</svg>

// in template
{{ partial "svgs/search.svg" (dict "class" "my-class-name")}}
```

### Taxonomies

User-defined groupings of content so they can have a variety of relationships.

Default taxonomies are `tags` and `categories`

For more info [https://gohugo.io/taxonomies/overview/](https://gohugo.io/taxonomies/overview/)

#### Define

Add taxonomies to the `config.toml` file using the format `singular-key = "plural value"`

```
# config.toml

[taxonomies]
  tag = "tags"
  category = "categories"
  series = "series"
```

#### Assign

Once a taxonomy is defined at the site level, any piece of content can be assigned to it regardless of content type or section.

Inside a piece of content's front matter; create a variable with the plural name of the taxonomy and assign all terms you want to apply to this content.

```
// site/content/examplePage.md

---
title: "Example"
date: 2017-06-29T17:46:49-07:00
tags = [ "Development", "Go", "fast", "Blogging" ]
categories = [ "Development" ]
series = [ "Go Web Dev" ]
---
```

#### Display

##### For a single piece of content

```go
<ul id="tags">
  {{ range .Params.tags }}
    <li><a href="{{ "/tags/" | relLangURL }}{{ . | urlize }}">{{ . }}</a> </li>
  {{ end }}
</ul>
```

##### Content grouped by taxonomy

```go
<ul>
  {{ range .Site.Taxonomies.series.golang }}
    <li><a href="{{ .Page.RelPermalink }}">{{ .Page.Title }}</a></li>
  {{ end }}
</ul>
```

### Production Workflow

TODO: Instructions for deployment

### Git
- Make server act like a github repository
- Git post update hook

### GitHub

### Dropbox?

### Netlify?

### Amazon S3

# Javascript

This is placeholder

## Modernizr

```javascript
if (Modernizr.touchevents) {
  console.log('touch events');
} else {
  console.log('no touch events');
}
```

## Postal

```javascript
import postal from 'postal';
import { HOME } from '../constants/Channels';

const channel = postal.channel(HOME);

channel.subscribe('some.event', (args) => {
	console.log('some.event called');
	console.log('args', args);
});

channel.publish('some.event', {
	foo: true,
	bar: false
});

```




