/*
# 9.0 ~ 9.3 Webpack Configuration
: npm i webpack webpack-cli --save-dev
: 개발자의 작업들을 보다 나은 방식으로 처리해준다. 가령, 이미지 파일을 압축해서 전달한다든지, 
작성된 코드를 브라우저나 서바가 이해할 수 있는 형태로 바꿔준다든지 등
: webpack.config.js는 옛날 js 문법만을 이해한다.
: package.json의 "scripts"에 다음의 코드를 작성한다. scripts는 명령어를 더 짧게 쓰는 데 유용하다. 
  "assests": "webpack --config wepback.config.js"
: output을 프론트 엔드 볼 수 있게끔 html에 script 코드를 작성해야 한다.
*/
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  }, // 우리가 처리하고자 하는 소스 코드를 의미한다.
  mode: "development", // "production" 일 때는 loader가 코드를 압축하기 때문에 알아보기 힘들다.
  watch: true, // 코드가 변할 때마다 자동으로 restart 해준다.
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"), // path에는 절대 경로를 기입해야 한다.
    clean: true, // directory를 비워준다.
  },
  module: {
    rules: [
      {
        test: /\.js$/, // /RegExp/; RegExp는 .으로 구분되며 \.js는 .js를 의미한다.
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      /* 
      # 9.4 SCSS Loader
      : npm install sass-loader sass webpack --save-dev: Loads a Sass/SCSS file and compiles it to CSS.
      : npm install --save-ev css-loader; The css-loader interprets @import and url() like import/require() and will resolve them.
      : npm install --save-dev style-loader; inject CSS into the DOM
      : SCSS => CSS => DOM
      : webpack은 우선 babel-loader로 js 파일은 변환한다. 그리고나서 scss 파일은 인식, css로 컴파일, 새로운 js 코드로 DOM에 inject한다.
      */
      {
        test: /\.scss$/,
        /* 
        # 9.5 MiniCssExtractPlugi
        : 하지만 하나의 소스 코드로 js와 css를 모두 작업하는 것은 좋지 않다. 이를 위해 다음의 package를 설치하자.
        : npm install --save-dev mini-css-extract-plugin; css를 별도로 관리한다.
        : webpack은 마지막에 있는 loader부터 실행한다.
        : ❌ use: ["style-loader", "css-loader", "sass-loader"],
        */
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
