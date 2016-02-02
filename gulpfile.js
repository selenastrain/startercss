/* Require Plugins */
const gulp = require('gulp'),
    gulpUtil = require('gulp-util'),
    postcss = require('gulp-postcss'),
        simpleVars = require('postcss-simple-vars'),
        partialImport = require('postcss-partial-import'),
        atImport = require('postcss-import'),
        nested = require('postcss-nested'),
        mathjs = require('postcss-mathjs'),
        mixins = require('postcss-mixins'),
        extend = require('postcss-extend'),
        mqpacker = require('css-mqpacker'),
        autoprefixer = require('autoprefixer'),
        csswring = require('csswring'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    svgSprite = require('gulp-svg-sprite');

// Sprite config
var spriteConfig = {
    shape: {
        spacing: {
            padding: 5
        }
    },
    mode: {
        // defs: true
        css: {
            bust: false,
            dest: 'src',
            render: {
                css: {
                    dest: 'css/_sprites.css'
                }
            },
            sprite: 'img/sprites.svg'
        }
    }
};

// JS Min
gulp.task('uglify', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

// CSS
gulp.task('css', function () {
    var processors = [
        // the order matters!
        atImport({glob: 'true'}),
        mixins,
        nested,
        simpleVars,
        mathjs,
        extend,
        partialImport,
        autoprefixer({browsers: ['last 2 versions', 'IE 10']}),
        mqpacker,
        csswring
    ];
    return gulp.src('./src/css/style.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors).on('error', gulpUtil.log))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

// Image Min
gulp.task('imagemin', function () {
    return gulp.src(['./src/img/*.{png,jpg,gif,svg}', '!./src/img/sprites/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});

// Sprites
gulp.task('sprites', function () {
    gulp.src('./src/img/sprites/*.svg')
        .pipe(svgSprite(spriteConfig))
        .pipe(gulp.dest(''));
});

// Watch task
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['uglify']);
    gulp.watch('src/css/**/*.css',['css']);
    gulp.watch(['./src/img/*', '!./src/img/sprites/*'],['imagemin']);
    gulp.watch('./src/img/sprites/*',['sprites', 'imagemin']);
});

// Default Task
gulp.task('default', ['uglify', 'css', 'sprites', 'imagemin', 'watch']);
