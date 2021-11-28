// This will turn any request to /api/... into a request to http://localhost:3001/api/...

module.exports = {
	port: 80,
	rewrite: [{from: "/api/(.*)", to: "http://localhost:3001/api/$1"}],
};
