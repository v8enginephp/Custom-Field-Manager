// webpack.mix.js

let mix = require('laravel-mix');

mix.js('resource/js/app.js', 'public/js').vue()
    .sass("resource/sass/app.sass", "public/css");