module.exports = {
	port: 3000,
	rewrite: [{from: "/api/*", to: "http://localhost:3001/$1"}],
};
