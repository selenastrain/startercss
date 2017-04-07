var gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    gulpCopy = require('gulp-copy'),
    uglify = require('gulp-uglify'),
    svgSprite = require('gulp-svg-sprite'),
    imagemin = require('gulp-imagemin'),
    postcss = require('gulp-postcss'),
        simpleVars = require('postcss-simple-vars'),
        cssImport = require('postcss-easy-import'),
        nested = require('postcss-nested'),
        calc = require('postcss-calc'),
        mixins = require('postcss-mixins'),
        extend = require('postcss-extend'),
        colors = require('postcss-color-function'),
        autoprefixer = require('autoprefixer'),
        mdcss = require('mdcss'),
        cssmqpacker = require('css-mqpacker'),
        csswring = require('csswring'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create();

var paths = {
    css: 'source/css/**/*.css',
    images: 'source/images/*',
    sprites: 'source/svg-sprites/*.svg',
    js: 'source/js/*.js'
};

var spriteConfig = {
    dest: '',
    shape: {
        spacing: {
            padding: 5
        }
    },
    mode: {
      css: {
          bust: false,
          dest: './',
          sprite: 'dist/images/sprites.svg',
          render: {
              css: {
                  dest: './source/css/base/_sprites.css',
                  template: './source/svg-sprites/sprites.css'
              }
          }
      }
    }
};

/* Handle CSS build breaking the watch task */ 
function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}


gulp.task('serve', ['css'], function() {
    // for running local drupal 
    // browserSync.init({
    //     port: 8888,
    //     open: 'external',
    //     host: "YOURPROJECT.dev",
    //     proxy: "http://YOURPROJECT.dev:8888"
    // });

    // for mdcss styleguide
    browserSync.init({
      server: "./source/styleguide"
    })

    gulp.watch(paths.css, ['css']);
    gulp.watch("./source/styleguide/index.html").on('change', browserSync.reload);
});

// run all image tasks
gulp.task('build-images', function(callback) {
  runSequence('clean-images', ['imagemin', 'sprites'], 'copy-images', callback);
});
// get rid of old images
gulp.task('clean-images', function() {
    return del(['./dist/images']);
});
// build sprites
gulp.task('sprites', function() {
    return gulp.src(paths.sprites)
        .pipe(svgSprite(spriteConfig))
        .pipe(gulp.dest(''));
});
// minify images
gulp.task('imagemin', function () {
   return gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});
// copy images into styleguide
gulp.task('copy-images', function() {
  return gulp.src('./dist/images/**/*')
        .pipe(gulpCopy('./source/styleguide'))
        .pipe(gulp.dest('./source/styleguide'));
});

// JS minify
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(uglify().on('error', onError))
    .pipe(gulp.dest('./dist/js'));
});

// CSS Process
gulp.task('css', function () {
    const options = {
        browsers: ['last 2 versions', 'IE 10'], flexbox: 'no-2009'
    };

    // preprocessor order matters!
    const plugins = [
        cssImport({glob:'true'}),
        mixins,
        nested,
        simpleVars,
        colors,
        extend,
        calc,
        mdcss({
            theme: require('mdcss-theme-github'),
            destination: './source/styleguide',
            // !!! Don't use the mdcss assets option to move css to the styleguide folder. 
            // It will move the css before it's done compiling.
            assets: ['./dist/images'],
            examples: ({
                css: ['./dist/css/style.css']
            })
        }),
        cssmqpacker({sort: true}),
        autoprefixer({browsers: options.browsers}),
        csswring({map: false})
    ];
    return gulp.src('./source/css/*.css')
        .pipe(postcss(plugins).on('error', onError))
        .pipe(gulp.dest('./dist/css'))
        // copy into the styleguide
        .pipe(gulp.dest('./source/styleguide/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    // not including css watch because it's already in the serve task
    watching = true;
    gulp.watch(paths.js, ['js']);
    gulp.watch([paths.images, paths.sprites], ['build-images']);
});

gulp.task('default', ['serve', 'watch']);
// 'build-images', 'css', 'js', 