const fs = require("fs");
const browserify = require("browserify");
const babelify = require("babelify");

function onError(err)
{
    console.log("Error: " + err.message);
}

/*
 * Task to build the production client file ./build/sock.min.js
 */
browserify({ debug: false, comment: false })
  .transform(babelify, {presets: ["es2015"]})
  .transform({global: true, sourcemap: false}, 'uglifyify')
  .require("./src/client/app.js", { entry: true })
  .bundle()
  .on("error", onError)
  .pipe(fs.createWriteStream("./build/sock.min.js"));

/*
 * Task to build the development client file ./build/sock.js
 */
browserify({ debug: true, comment: true })
  .transform(babelify, {presets: ["es2015"]})
  .require("./src/client/app.js", { entry: true })
  .bundle()
  .on("error", onError)
  .pipe(fs.createWriteStream("./build/sock.js"));