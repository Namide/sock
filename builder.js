
var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");

function onError(err)
{
    console.log("Error: " + err.message);
}

/*
 * Task to build the es5 minified client file ./build/sock.js
 */
browserify({ debug: false, comment: false })
  .transform(babelify, {presets: ["es2015"]})
  .transform({global: true, sourcemap: false}, 'uglifyify')
  .require("./src/client/app.js", { entry: true })
  .bundle()
  .on("error", onError)
  .pipe(fs.createWriteStream("./build/sock.js"));
