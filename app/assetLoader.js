export default (async function assetLoader(assets) {
  const loadImage = texture =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = texture.path;
      const data = [texture.name, { image: image, size: texture.size }];
      image.addEventListener("error", reject);
      image.addEventListener("load", () => resolve(data));
    });

  const imageLoaders = assets.images.map(loadImage);

  const images = await Promise.all(imageLoaders);
  const textureCache = new Map(images);

  const frameNames = Object.keys(assets.frames);
  const cache = frameNames.reduce(
    (acc, frameName) => {
      const sprite = assets.frames[frameName];
      sprite.texture = textureCache.get(sprite.image).image;
      return [[frameName, sprite], ...acc]
    },
    []
  );

  return new Map(cache);
});