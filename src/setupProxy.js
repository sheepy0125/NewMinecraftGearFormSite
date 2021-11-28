// This is used ONLY IN TESTING / DEVELOPMENT
// For production, please use local web server (lws) and the rewrite feature
// Check out /lws.config.js and /scripts/run-frontend.cmd for info on how to do that

// This will turn any request to /api/... into a request to http://localhost:3001/api/...

const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			target: "http://127.0.0.1:3001/",
			changeOrigin: true,
		})
	);
};
