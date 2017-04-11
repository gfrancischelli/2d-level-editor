var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

var dir = "assets";

function readFileNames(directory) {
  return fs.readdirSync(directory).reduce(function(list, file) {
    if (file === "game.assets.json") return list;
    var filePath = path.join(directory, file);
    var isDir = fs.statSync(filePath).isDirectory();
    var isJson = file.slice(-4) === "json";
    if (isDir) {
      var fileNames = readFileNames(filePath);
      return [...fileNames, ...list];
    }
    if (isJson) {
      return [filePath, ...list];
    }
    return list;
  }, []);
}

var filePaths = readFileNames(dir);

function getFrames(textureAtlas) {
  const frameNames = Object.keys(textureAtlas.frames);
  const imageName = textureAtlas.meta.image;
  return frameNames.reduce(
    function(framesList, frameName) {
      const sprite = textureAtlas.frames[frameName];
      const asset = {
        frame: sprite.frame,
        image: imageName,
        relativeSize: {
          x: sprite.frame.w / 16,
          y: sprite.frame.h / 16
        }
      };
      framesList[frameName] = asset;
      return framesList;
    },
    {}
  );
}

function setTransparency(imageName, imagePath) {
  exec(
    `convert ${path.resolve(imagePath)} -texture "#FF00FF" ${path.resolve(imageName)}`,
    err => {
      if (err) console.log(err);
      if (!err) console.log(`${imageName} transparency successfully set`);
    }
  );
}

const gameAssets = filePaths.reduce(
  (assets, assetPath) => {
    var textureAtlas = JSON.parse(fs.readFileSync(assetPath));
    var imageName = textureAtlas.meta.image;
    var imagePath = path.join(assetPath, "..", imageName);
    setTransparency(imageName, imagePath);
    assets.images.push({
      path: imagePath,
      name: imageName,
      size: textureAtlas.meta.size
    });
    assets.frames = Object.assign(assets.frames, getFrames(textureAtlas));
    return assets;
  },
  { images: [], frames: {} }
);

const jsonString = JSON.stringify(gameAssets, null, 2);

fs.writeFile(path.resolve(dir, "game.assets.json"), jsonString, err =>
  console.log(err || "Assets bundle successfully completed"));
