const intToHexString = (...args) =>
  args.reduce(
    (hex, c) => c.toString(16).length > 1
      ? hex + c.toString(16)
      : hex + 0 + c.toString(16),
    "#"
  );

export default intToHexString;
