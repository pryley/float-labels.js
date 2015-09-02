var gulp   = require( 'gulp' );
var Elixir = require( 'laravel-elixir' );

require( 'elixir-jshint' );

Elixir.config.production = true;
Elixir.config.sourcemaps = false;
Elixir.config.assetsPath = 'src/';
Elixir.config.publicPath = 'dist/';

Elixir.config.css.sass.folder = 'scss';

var paths = {
    src  : Elixir.config.assetsPath,
    dest : Elixir.config.publicPath
};

Elixir( function( mix )
{
    mix
    .jshint( [ paths.src + 'js/**/*.js'] )
    .scripts( 'float-labels.js', paths.dest + 'float-labels.min.js' )
    .sass( 'float-labels.scss', paths.dest + 'float-labels.css' );
});
