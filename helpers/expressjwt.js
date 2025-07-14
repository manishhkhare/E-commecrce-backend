const { expressjwt: jwt } = require("express-jwt");

function authjwt() {
  const secret="mykey";
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked  // Uncomment if needed
    }).unless({
      path: [
    { url: '/', methods: ['GET','HEAD'] },
    { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
    { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS'] },
    { url: /\/api\/v3\/user\/login/, methods: ['POST'] },
        // { url: /\/api\/v6\/cart\/add/, methods: ['POST'] },
    { url: /\/api\/v3\/user\/registration/, methods: ['POST'] },
        // { url: /\/api\/v3\/user\/count/, methods: ['GET'] },
    { url: /\/public\/uploads(.*)/, methods: ['GET'] },
    { url: /\/api\/v5\/admin-register/, methods:[ 'POST'], },
        ]
    });
}

// Optional admin-only protection
async function isRevoked(req, token) {
  const adminOnlyRoutes = [
   
        { method: 'POST', pathRegex: /^\/api\/v1\/Product/ },
        { method: 'PUT', pathRegex: /^\/api\/v1\/Product/ },
        { method: 'DELETE', pathRegex: /^\/api\/v1\/Product/ },

        // Order Routes
        { method: 'GET', pathRegex: /^\/api\/v2\/orders\/?$/ },
        { method: 'GET', pathRegex: /^\/api\/v2\/orders\/[^/]+$/ },
        { method: 'PUT', pathRegex: /^\/api\/v2\/orders/ },
        { method: 'DELETE', pathRegex: /^\/api\/v2\/orders/ },
        { method: 'GET', pathRegex: /^\/api\/v2\/orders\/get\/totalsales/ },
        { method: 'GET', pathRegex: /^\/api\/v2\/orders\/get\/count/ },

        // User Routes (Admin Only)
        { method: 'DELETE', pathRegex: /^\/api\/v3\/user\/delete/ },
        { method: 'PUT', pathRegex: /^\/api\/v3\/user\/put/ },
        { method: 'GET', pathRegex: /^\/api\/v3\/user\/count/ },

        // Category roue
        { method: "GET", pathRegex: /\/api\/v4/},
        { method:"POST", pathRegex:/\/api\/v4\/categories/}
        
    ];
  
    const isAdminRoute = adminOnlyRoutes.some(route =>
      route.method === req.method && route.pathRegex.test(req.originalUrl)
    );
  
    if (isAdminRoute && !(token && token.payload && token.payload.isAdmin)) {
      return true;
    }
  
    return false; // allow access
  }
module.exports = authjwt;