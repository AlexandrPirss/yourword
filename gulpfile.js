'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'), // Будет нужен для наблюдения за изменениями файлов
    prefixer = require('gulp-autoprefixer'), // автоматически добавляет вендорные префиксы к CSS свойствам
    uglify = require('gulp-uglify'), // будет сжимать наш JS
    sass = require('gulp-sass'), // для компиляции нашего SCSS кода
    jade = require('gulp-jade'),
    sourcemaps = require('gulp-sourcemaps'), // для генерации css sourscemaps, которые будут помогать нам при отладке кода
    rigger = require('gulp-rigger'), // это просто киллер фича. Плагин позволяет импортировать один файл в другой
    cssmin = require('gulp-minify-css'), // нужен для сжатия CSS кода
    imagemin = require('gulp-imagemin'), // для сжатия картинок
    pngquant = require('imagemin-pngquant'), // для сжатия png
    rimraf = require('rimraf'), // rm -rf для ноды
    browserSync = require("browser-sync"), // этот плагин можем легко развернуть локальный dev сервер и livereload
    reload = browserSync.reload;


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.jade', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend"
};

// Веб сервер
gulp.task('webserver', function () {
    browserSync(config);
});

// Очистка
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// Собираем html
gulp.task('jade:build', function() {
    return gulp.src('src/*.jade')
        .pipe(jade()) 
        .pipe(gulp.dest('build')) // указываем gulp куда положить скомпилированные HTML файлы
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// Собираем javascript
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

// Собираем стили
gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

// Собираем картинки
gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

// Шрифты
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


// таск с именем «build», который будет запускать все что мы накодили
gulp.task('build', [
    'jade:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

// Изменения файлов
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('jade:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});



// Последним делом — мы определим дефолтный таск, который будет запускать всю нашу сборку. 
gulp.task('default', ['build', 'webserver', 'watch']);