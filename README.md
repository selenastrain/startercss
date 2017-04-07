A postCSS starter project from [Gravity Works](http://www.gravityworksdesign.com/).

## Getting Started
1. Install [Node.js](https://nodejs.org/en/) and [Gulp.js](http://gulpjs.com/) if you don't have them already
2. Copy all the files and folders inside of /gwpostcss into your theme directory (don't forget the .gitignore)
3. Navigate to your theme directory in command line
4. Run `npm install` to download all the required node modules
5. Run `gulp` to start watching your files for changes, or `gulp thetaskname` to run a single task. See gulpfile.js for all available tasks.

### Folder Structure
`/src` = Source files. These are for dev use only.

`/dist` = Distribution files. These go on the server.

### The Gulp Tasks
The Gulp tasks are configured to

* Compile [PostCSS](https://github.com/postcss/postcss) into minified CSS
* Create a style guide with [mdcss](https://github.com/jonathantneal/mdcss)
* Open & auto reload the mdcss styleguide in the browser
* Minify JS
* Build an svg sprite sheets
* Minify images

You can add to, remove, or modify any of these tasks. 

#### Sprites Task
If you need to change the sprite image path, see /src/svg-sprites/sprites.css

## But This is Just a Starting Point
Don't feel like you have to keep all preconfigured styles or settings. 