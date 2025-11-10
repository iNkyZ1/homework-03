const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: path.resolve(__dirname, 'src'),

	entry: './index.ts',

	output: {
		filename: 'js/[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'assets/[name][hash][ext][query]',
		clean: true,
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'index.html'),
			favicon: false,
		}),
	],

	module: {
		rules: [
			// TypeScript
			{
				test: /\.tsx?$/i,
				use: 'ts-loader',
				exclude: /node_modules/,
			},

			{
				test: /\.(png|jpe?g|gif|svg|ico|webp|avif|mp3|wav|ogg|ttf|otf|woff2?)$/i,
				type: 'asset/resource',
			},
		],
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
};
