# MM-506-ER-TW
Based on version 2 of MM-506-ER, but using Tailwind CSS.

# How to create a presentation
Every presentation starts with a "slide" containing global options. This slide is not displayed in the preview or in the presentation. Every subsequent slide need to specify a type.

## Global options
These are written inside a []-block, and consists of comma-separated key-value pairs. An example could look like this
```
[Theme: basic, duck: quack]
```
In this example, there is valid option called duck, so this will not be parsed.

## New slides
A new slide is create with a horizontal rule, written as --- in markdown, or as ```<hr>``` with an HTML-tag.

## Slide types
For now, there a two primary slide types: text only, or slides with image. Image slides can only contain 1 image.

## Slide options
Slide options must be specified as the first content on a slide. It must also be written in a []-block. Valid options are

|Value | Description|
|------|------------|
| ti   | Title slide|
| tx   | Standard text (default)|
| il   | Image in left column, text in right|
| ir   | Image in right column, text in left|
| io   | Centered image with text overlay|
| ii   | Centered image with individual image (no text)|


# Previous versions
* [Version 1](https://github.com/espenraugstad/MM-506-ER)
* [Version 2](https://github.com/espenraugstad/MM-506-ER-V2)