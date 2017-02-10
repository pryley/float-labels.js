var browserSync  = require( 'browser-sync' ).create();
var gulp         = require( 'gulp' );
var autoprefixer = require( 'gulp-autoprefixer' );
var bump         = require( 'gulp-bump' );
var cssnano      = require( 'gulp-cssnano' );
var gulpif       = require( 'gulp-if' );
var jshint       = require( 'gulp-jshint' );
var notify       = require( 'gulp-notify' );
var rename       = require( 'gulp-rename' );
var sass         = require( 'gulp-sass' );
var uglify       = require( 'gulp-uglify' );
var watch        = require( 'gulp-watch' );
var args         = require( 'yargs' ).argv;

var paths = {
	dist: 'dist/',
	js  : 'src/float-labels.js',
	scss: [
		'demo/scss/**/*.scss',
		'src/float-labels.scss',
	],
};

/* CSS Task
 -------------------------------------------------- */
gulp.task( 'css', function ()
{
	return gulp
		.src( paths.scss, { base: '.' })
		.pipe( sass({ outputStyle: 'expanded' }).on( 'error', sass.logError ))
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

/* Version Bump Task
 -------------------------------------------------- */
var bumpPaths = [
	'bower.json',
	'package.json',
	'src/float-labels.js',
	'src/float-labels.scss',
];

gulp.task( 'bump:patch', function()
{
	return gulp
		.src( bumpPaths, { base: './' })
		.pipe( bump() )
		.pipe( gulp.dest( './' ));
});

gulp.task( 'bump:minor', function()
{
	return gulp
		.src( bumpPaths, { base: './' })
		.pipe( bump({ type: 'minor' }))
		.pipe( gulp.dest( './' ));
});

gulp.task( 'bump:major', function()
{
	return gulp
		.src( bumpPaths, { base: './' })
		.pipe( bump({ type: 'major' }))
		.pipe( gulp.dest( './' ));
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
