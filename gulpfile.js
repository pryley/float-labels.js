var browserSync    = require( 'browser-sync' ).create();
var gulp           = require( 'gulp' );
var autoprefixer   = require( 'gulp-autoprefixer' );
var bump           = require( 'gulp-bump' );
var cssnano        = require( 'gulp-cssnano' );
var gulpif         = require( 'gulp-if' );
var jshint         = require( 'gulp-jshint' );
var moduleImporter = require( 'sass-module-importer' );
var notify         = require( 'gulp-notify' );
var rename         = require( 'gulp-rename' );
var sass           = require( 'gulp-sass' );
var uglify         = require( 'gulp-uglify' );
var watch          = require( 'gulp-watch' );
var args           = require( 'yargs' ).argv;

var paths = {
	dist: 'dist/',
	js  : 'src/float-labels.js',
	scss: [
		'demo/scss/**/*.scss',
		'src/float-labels.scss',
	],
	bump: {
		'version': [
			'bower.json',
			'package.json',
			'src/float-labels.js',
			'src/float-labels.scss',
		],
	},
};

/* CSS Task
 -------------------------------------------------- */
gulp.task( 'css', function ()
{
	return gulp
		.src( paths.scss, { base: '.' })
		.pipe( sass({
			importer: moduleImporter(),
			outputStyle: 'expanded'
		}).on( 'error', sass.logError ))
		.pipe( autoprefixer() )
		.pipe( gulpif( args.production, cssnano() ))
		.pipe( rename( function( path ) {
			path.dirname = path.dirname.replace( 'src', 'dist' );
			path.dirname = path.dirname.replace( 'scss', 'css' );
		}))
		.pipe( gulp.dest( '.' ))
		.pipe( browserSync.stream() )
		.pipe( notify({
			message: 'CSS Task complete!',
			onLast : true
		}));
});

/* JSHint Task
 -------------------------------------------------- */
gulp.task( 'jshint', function()
{
	return gulp
		.src( paths.js )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'jshint-stylish' ))
		.pipe( jshint.reporter( 'fail' ).on( 'error', function() { this.emit( 'end' ); }))
		.pipe( notify({
			message: 'JSHint Task complete!',
			onLast : true
		}));
});

/* JS Task
 -------------------------------------------------- */
gulp.task( 'js', function ()
{
	return gulp
		.src( paths.js )
		.pipe( gulpif( args.production, uglify({ preserveComments: 'license' })))
		.pipe( rename({ suffix: '.min' }))
		.pipe( gulp.dest( paths.dist ))
		.pipe( browserSync.stream() )
		.pipe( notify({
			message: 'JS Task complete!',
			onLast : true
		}));
});

/* Version Task
 -------------------------------------------------- */
gulp.task( 'bump', function() {
	['patch', 'minor', 'major'].some( function( arg ) {
		if( !args[arg] )return;
		for( var key in paths.bump ) {
			if( !paths.bump.hasOwnProperty( key ))continue;
			gulp.src( paths.bump[key], { base: '.' })
				.pipe( bump({ type: arg, key: key }))
				.pipe( gulp.dest('.'));
		}
		return true;
	});
});

/* Watch Task
 -------------------------------------------------- */
gulp.task( 'watch', function ()
{
	browserSync.init({
		server: {
			baseDir: "."
		}
	});

	gulp.watch( paths.js, ['js'] );
	gulp.watch( paths.scss, ['css'] );
	gulp.watch( '*.html' ).on( 'change', browserSync.reload );
});

/* Default Task
 -------------------------------------------------- */
gulp.task( 'default', function ()
{
	gulp.start( 'css', 'js' );
});
