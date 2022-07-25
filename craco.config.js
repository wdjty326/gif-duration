const { ProvidePlugin } = require('webpack');

const fs = require('fs');
const {
	loaderByName,
	removeLoaders,
	addAfterLoader,
	// removePlugins,
	// pluginByName,
} = require('@craco/craco');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');

const removeMinimizer = (webpackConfig, name) => {
	const idx = webpackConfig.optimization.minimizer.findIndex(
		(m) => m.constructor.name === name
	);
	webpackConfig.optimization.minimizer.splice(idx, 1);
};

const replaceMinimizer = (webpackConfig, name, minimizer) => {
	const idx = webpackConfig.optimization.minimizer.findIndex(
		(m) => m.constructor.name === name
	);
	idx > -1 && webpackConfig.optimization.minimizer.splice(idx, 1, minimizer);
};

module.exports = {
	reactScriptsVersion: 'react-scripts',
	webpack: {
		plugins: {
			// tsconfig.json `react-jsx` 옵션 미동작 해결
			add: [
				new ProvidePlugin({
					React: 'react',
				}),
			],
		},
		configure: (webpackConfig, { paths }) => {
			const useTypeScript = fs.existsSync(paths.appTsConfig);

			// esbuild-loader 추가
			addAfterLoader(webpackConfig, loaderByName('babel-loader'), {
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				include: [paths.appSrc],
				loader: require.resolve('esbuild-loader'),
				options: {
						loader: useTypeScript ? 'tsx' : 'jsx',
						target: 'es2015',
						tsconfigRaw: require('./tsconfig.json'),
				},
			});

			// babel-loaders 제거
			removeLoaders(webpackConfig, loaderByName('babel-loader'));

			// terser를 esbuild로 변경
			const minimizerOptions = {
				target: 'es2015',
				css: true,
			};
			replaceMinimizer(
				webpackConfig,
				'TerserPlugin',
				new ESBuildMinifyPlugin(minimizerOptions)
			);

			// OptimizeCssAssetsWebpackPlugin css 플러그인 제거
			if (minimizerOptions.css) {
				removeMinimizer(webpackConfig, 'OptimizeCssAssetsWebpackPlugin');
			}

			// `SpeedMeasureWebpackPlugin` 오류 해결을 위해 `MiniCssExtractPlugin` 을 후순위로 지정
			// 주의: `SpeedMeasureWebpackPlugin` 모듈 사용시 `HtmlWebpackPlugin`의 %PUBLIC_URL% 이 동작하지 않는 버그가 있습니다. 빌드 성능을 체크할때만 사용해주세요
			// const plugins = [];
			// webpackConfig.plugins.forEach((plugin) => {
			// 	if (plugin.constructor.name === "MiniCssExtractPlugin") {
			// 		plugins.push(plugin);
			// 	}
			// });
			// removePlugins(webpackConfig, pluginByName('MiniCssExtractPlugin'));
			// webpackConfig = new SpeedMeasureWebpackPlugin().wrap(webpackConfig);
			// webpackConfig.plugins.push(...plugins);

			return webpackConfig;
		},
	},
	jest: {
		configure: (jestConfig) => {
			const esbuildJestOptions = {
				loaders: {
					'.js': 'jsx',
					'.test.js': 'jsx',
					'.ts': 'tsx',
					'.test.ts': 'tsx',
				},
			};

			// Replace babel transform with esbuild
			// babelTransform is first transformer key
			/*
			transform:
				{
					'^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'node_modules\\react-scripts\\config\\jest\\babelTransform.js',
					'^.+\\.css$': 'node_modules\\react-scripts\\config\\jest\\cssTransform.js',
					'^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': 'node_modules\\react-scripts\\config\\jest\\fileTransform.js'
				}
			*/
			const babelKey = Object.keys(jestConfig.transform)[0];

			// We replace babelTransform and add loaders to esbuild-jest
			jestConfig.transform[babelKey] = [
				require.resolve('esbuild-jest'),
				esbuildJestOptions,
			];

			// Adds loader to all other transform options (2 in this case: cssTransform and fileTransform)
			// Reason for this is esbuild-jest plugin. It considers only loaders or other options from the last transformer
			// You can see it for yourself in: /node_modules/esbuild-jest/esbuid-jest.js:21 getOptions method
			// also in process method line 32 gives empty loaders, because options is already empty object
			// Issue reported here: https://github.com/aelbore/esbuild-jest/issues/18
			Object.keys(jestConfig.transform).forEach((key) => {
				if (babelKey === key) return; // ebuild-jest transform, already has loader

				// Checks if value is array, usually it's not
				// Our example is above on 70-72 lines. Usually default is: {"\\.[jt]sx?$": "babel-jest"}
				// (https://jestjs.io/docs/en/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object)
				// But we have to cover all the cases
				if (
					Array.isArray(jestConfig.transform[key]) &&
					jestConfig.transform[key].length === 1
				) {
					jestConfig.transform[key].push(esbuildJestOptions);
				} else {
					jestConfig.transform[key] = [
						jestConfig.transform[key],
						esbuildJestOptions,
					];
				}
			});

			return jestConfig;
		},
	},
};
