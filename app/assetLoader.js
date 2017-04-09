export default (async function assetLoader(assets) {
  const loadImage = filename =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = `/assets/${filename}`;
      image.addEventListener("error", reject);
      image.addEventListener("load", () => resolve(image));
    });

  async function loadTexture(filename, spriteName, frame = {}) {
    const image = await loadImage(filename);
    return [spriteName || filename, {texture: image, frame}];
  }

  function loadAtlas(atlas) {
    const filename = atlas.meta.image;
    const textures = Object.keys(atlas.frames);
    const spritesLoader = textures.map(texture => 
      loadTexture(filename, texture, atlas.frames[texture])
    );
    return spritesLoader
  }

  const loadReducer = (acc, asset) =>
    typeof asset === "string"
      ? acc.push(loadImage(asset))
      : [...acc, ...loadAtlas(asset)];

  const loaders = assets.reduce(loadReducer, []);

  const cache = await Promise.all(loaders);

  return new Map(cache);
});
