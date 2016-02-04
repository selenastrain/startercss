A starter postCSS project from [Gravity Works](http://www.gravityworksdesign.com/).

## Prereqs
* Node
* Gulp

## Install

Install the required node modules
```
npm install
```

Run the gulp tasks
```
gulp
```

## File Structure

src = Source files. These are just for production use.

dist = Distribution files. These go on the server.

## Mixins

Defining mixins:
```scss
@define-mixin media-break $break {
  @media (min-width: $break) { @mixin-content; }
}
```

Using mixins:
```scss
body {
  // mobile first css here.
  @mixin media-break $br-md {
    // Your > mobile css here.
  }
}
```

## Using The Grid
Plain percentage based grid still needs to be added in.

Flexbox grid should be used like this:
```html
<div class="flex-row">
  <div class="flex-half">...</div>
  <div class="flex-half">...</div>
</div>
```
