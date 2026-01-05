module.exports = {
  plugins: [
    {
      name: 'convertPathData',
      params: {
        convertToAbsolute: true,
        floatPrecision: 6, 
        straightCurves: true,
        applyTransforms: true
      }
    }
  ],
  js2svg: {
    pretty: true,
    indent: 1
  }
};

