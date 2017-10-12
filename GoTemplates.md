
# Go Templates

## Syntax

Every field that you intend to be rendered within a template should be put inside of `{{}}`

```go
{{ foo }}

// parentheses can be used to group items together
{{ if or (isset .Params "alt") (isset .Params "caption" )}} Caption {{ end }}
```

The `{{ .Get 0 }}` part is for retrieving the first (and, in this case, only) argument supplied —
the Codepen ID. Hugo also supports named arguments, which are supplied like HTML attributes.

The . syntax refers to the current context. So, .Get 0 means “Get the first argument supplied for
the current shortcode.”

```
{{<demo>}}
    This is the content!
{{</demo>}}
```

“This is the content!” would be available as `{{ .Inner }}` in the demo.html template that parses it.

`{{ .Content }}` pulls the content from the corresponding page in the `/content/` folder.

Give page a unique layout

```
+++
page = "static/single.html" // option 1: then create layouts/static/single.html
type = "about" // option 2: then create
layout = "about" // option 3: then create layouts/about.html
+++
```

## Variables

Templates have access to a large number of global and local variables that can be found in the
[Hugo Docs](https://gohugo.io/templates/variables/) and used within double curly braces using dot
notation. `{{ .Params.foo }}`

### Site Variables

Are taken from the sites `config.toml` file and accessible through `.Site`.

```go
baseurl = "/"

[params]
Copyright = "Copyright &#xA9; 2013 John Doe. All Rights Reserved."
```

```go
{{ .Site.baseurl}}
{{ .Site.Params.Copyright}}
```

### Page Variables

Are taken from the pages front mater and accessible through `.Params`

```go
+++
title = "My Example"
+++
```

```go
{{ .Params.title }} // My Example
```

### Node Variables

### Define custom variables

Custom variables can also be defined and referenced.

`:=` is the equivalent of `var $address =`

```go
{{ $address := "Example"}}
{{ $address }}
```

## Context

The period character '.' or "dot" is the current context (object). In the top level of your template,
this will be the data set made available to it.

Use `$.` to access global context from anywhere.

## Index

`index` returns the result of indexing its first argument by the following arguments. Thus “index x 1 2 3”
is, in Go syntax, x[1][2][3]. Each indexed item must be a map, slice, or array.

## Whitespace

By default, all text between actions is copied verbatim when the template is executed.

To remove trailing white space add minus sign to left delimiter.

To remove leading white space add a minus sign to the right delimiter.

```go
"{{23 -}} < {{- 45}}" // outputs 23<45

<div>
  {{ .Title }}
</div>

<div>
  Hello, World!
</div>

<div>
  {{- .Title -}}
</div>

<div>Hello, World!</div>
```

## Comments

```go
{{/* a comment */}}
```

## Conditionals

```go
// if
{{if foo}} There is foo! {{end}}

// if else
{{if foo}} There is foo! {{else}} No foo :( {{end}}

// if not
{{if not foo}} No foo :( {{end}}

// if else if
{{if foo}} There is foo! {{else if bar}} There is bar! {{end}}

// with (changes context)
{{with foo}} . is now foo {{end}}

// with else (changes context)
{{with foo}} . is now foo {{else}} No foo :( {{end}}

```

## Comparison

Uses Polish notation

```go
// if ==
{{if eq foo "example"}} foo is equal to "example" {{end}}

// if !=
{{if ne foo "example"}} foo is NOT equal to "example" {{end}}

// if <
{{if lt foo 10}} foo is less than 10 {{end}}

// if <=
{{if le foo 10}} foo is less than, or equal to, 10 {{end}}

// if >
{{if gt foo 10}} foo is greater than 10 {{end}}

// if >=
{{if ge foo 10}} foo is greater than, or equal to, 10 {{end}}

```

## Loops

```go
// foo must be array, slice, map, or channel
// dot is set to the current element
{{range foo}} {{ . }} {{end}}

// declare value variable name
{{range $element := foo}} {{ $element }} {{end}}

// fallback if array is empty
{{range foo}} {{ . }} {{else}} Foo had length of zero {{end}}

// index of loop
{{range $index, $element := foo}}
	{{ $index }}
	{{ $element }}
{{end}}
```

## Pipes

Chain together action function calls. They can only work with a single value.

The result of each command is passed as the last argument of the following command

```go
{{ (seq 1 5) | shuffle }} // same as {{ shuffle (seq 1 5) }}

{{ index .Params "disqus_url" | html }} // escape the html

{{ if or (or (isset .Params "title") (isset .Params "caption")) (isset .Params "attr") }}
Stuff Here
{{ end }}

// could be
{{ if isset .Params "caption" | or isset .Params "title" | or isset .Params "attr" }}
Stuff Here
{{ end }}
```

## Functions

You can add logic to your templates (e.g. loops, comparisons, ordering, etc... ) using the
[Go html/template library](https://golang.org/pkg/text/template/#hdr-Functions) along with
[Hugo specific functions](https://gohugo.io/templates/functions/).

You can also extend the available functions with your own.

```go
// function with parameters
{{ add 1 2 }}
```


## Defaults

Checks whether a given value is set and returns a default value if it is not.

```go
{{ index .Params "font" | default "Roboto" }} // default is "Roboto"
{{ default "Roboto" (index .Params "font") }} // default is "Roboto"
```

## Delimit

Loops through any array, slice or map and returns a string of all the values separated by the
delimiter. There is an optional third parameter that lets you choose a different delimiter to go
between the last two values.

```go
{{ delimit .Params.tags ", " " and " }} // Outputs tag1, tag2 and tag3
```

## Dict

Creates a dictionary `(map[string, interface{})`, expects parameters added in value:object fashion. Invalid combinations like keys that are not strings or uneven number of parameters, will result in an exception thrown. Useful for passing maps to partials when adding to a template.

e.g. Pass into “foo.html” a map with the keys “important, content”

```go
{{$important := .Site.Params.SomethingImportant }}
{{range .Site.Params.Bar}}
    {{partial "foo" (dict "content" . "important" $important)}}
{{end}}
```

foo.html

```go
Important {{.important}}
{{.content}}
```

## Templates

Template files are all located in the `site/layouts` directory.

```go
// load template
{{template "name"}}

// pass data to template
{{template "name" foo}}
```

The templates location will always be starting at the `site/layouts/` directory.

To assign a unique layout to a page put this in the frontmatter

```
layout = "myUniqueLayout"
```

Then create the layout in `site/layouts/page/myUniqueLayout.html` or `site/layouts/_default/myUniqueLayout.html`

## Shortcodes

Can nest shortcodes and reference the parent shortcode.
