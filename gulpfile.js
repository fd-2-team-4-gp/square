var gulp = require("gulp"),
    browserSync = require("browser-sync"),
    rigger = require("gulp-rigger"),
    del = require("del"),
    autoprefixer = require("gulp-autoprefixer");

gulp.task("default", ["clean", "browser-sync", "rigger", "watch"], function() {});

gulp.task("rigger", function() {
    gulp.src("app/assets/js/**/*.js")
        .pipe(rigger())
        .pipe(gulp.dest("dist/assets/js"));

    gulp.src("app/assets/css/**/*.css")
        .pipe(autoprefixer(["last 15 versions", "> 1%", "ie 7", "ie 8"], {
            cascade: true
        }))
        .pipe(rigger())
        .pipe(gulp.dest("dist/assets/css"));

    gulp.src("app/*.html")
        .pipe(rigger())
        .pipe(gulp.dest("dist"));

    gulp.src("app/assets/pages/**/*.html")
        .pipe(rigger())
        .pipe(gulp.dest("dist/assets/pages"));
        
    gulp.src("app/assets/images/**/*.*")
        .pipe(gulp.dest("dist/assets/images"));
    
    gulp.src("app/assets/fonts/**/*.*")
        .pipe(gulp.dest("dist/assets/fonts"));
});

gulp.task("browser-sync", ["clean"], function() { 
    browserSync({
        server: {
            baseDir: "dist" 
        },
        port: 8082, // для c9.io открыты порты 8081, 8082
        notify: false
    });
});

gulp.task("reload", ["rigger"], function() {
    browserSync.reload();
})

gulp.task("clean", function() {
    del.sync("dist");
})

gulp.task("watch", ["browser-sync", "rigger"], function() {
    gulp.watch("app/assets/js/**/*.js", ["reload"]);
    gulp.watch("app/assets/css/**/*.css", ["reload"]);
    gulp.watch("app/**/*.html", ["reload"]);
});