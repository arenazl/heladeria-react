const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api-qa.nucleocheck.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to target
      },
      onProxyReq: function(proxyReq, req, res) {
        // Add any custom headers here if needed
        proxyReq.setHeader('Origin', 'https://prod.nucleocheck.com');
        proxyReq.setHeader('Referer', 'https://prod.nucleocheck.com/');
      },
      onProxyRes: function(proxyRes, req, res) {
        // Log response for debugging
        console.log(`Proxy response from ${req.method} ${req.url}: ${proxyRes.statusCode}`);
      },
      logLevel: 'debug',
    })
  );
};
