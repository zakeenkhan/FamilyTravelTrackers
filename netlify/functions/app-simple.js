const { Client } = require('pg');

// Simple handler without Express
exports.handler = async (event, context) => {
  const { path, httpMethod, body, queryStringParameters } = event;
  
  console.log('Function called:', { path, httpMethod });
  
  // Database connection
  let client;
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <html>
          <body>
            <h1>Database Connection Error</h1>
            <p>Could not connect to database: ${error.message}</p>
            <p>Please check your DATABASE_URL environment variable.</p>
          </body>
        </html>
      `
    };
  }
  
  try {
    // Health check
    if (path === '/health' || path === '/.netlify/functions/app/health') {
      await client.query('SELECT 1');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'connected'
        })
      };
    }
    
    // Main page
    if (path === '/' || path === '/.netlify/functions/app' || httpMethod === 'GET') {
      // Get data from database
      const countriesResult = await client.query(
        "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1",
        [1]
      );
      
      const usersResult = await client.query("SELECT * FROM users");
      const users = usersResult.rows;
      const currentUser = users.find(user => user.id == 1) || { color: '#27ae60' };
      
      const countries = countriesResult.rows.map(row => row.country_code);
      
      // Simple HTML response
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Family Travel Tracker - Made by Zakeen Khan</title>
    <link rel="stylesheet" href="/public/styles/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <i class="fas fa-globe-americas"></i>
                    <h1>Family Travel Tracker</h1>
                </div>
                <div class="welcome-message">
                    <h2>🌍 Welcome to Your Travel Adventure! ✈️</h2>
                    <p>Track your family's amazing journeys around the world</p>
                </div>
                <div class="made-by">
                    <p>Made with ❤️ by <strong>Zakeen Khan</strong></p>
                </div>
            </div>
        </div>
    </header>
    
    <main class="main-content">
        <section class="input-section">
            <div class="container">
                <h3><i class="fas fa-map-marker-alt"></i> Add New Country</h3>
                <form action="/.netlify/functions/app" method="post" class="country-form">
                    <div class="input-group">
                        <input type="text" name="country" placeholder="Enter country name" class="country-input">
                        <button type="submit" class="add-btn" style="background-color: ${currentUser.color};">
                            <i class="fas fa-plus"></i>
                            Add Country
                        </button>
                    </div>
                </form>
            </div>
        </section>
        
        <section class="map-section">
            <div class="container">
                <div class="map-header">
                    <h3><i class="fas fa-globe"></i> World Travel Map</h3>
                    <div class="travel-stats">
                        <div class="stat-item">
                            <span class="stat-number">${countries.length}</span>
                            <span class="stat-label">Countries Visited</span>
                        </div>
                    </div>
                </div>
                <p>🎉 Your Family Travel Tracker is working on Netlify!</p>
                <p>Database connected successfully. You have visited ${countries.length} countries.</p>
                <p><strong>Countries:</strong> ${countries.join(', ') || 'None yet - add some!'}</p>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-left">
                    <p>&copy; 2025 Family Travel Tracker</p>
                    <p>Made with ❤️ by <strong>Zakeen Khan</strong></p>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html
      };
    }
    
    // Handle POST requests (add country)
    if (httpMethod === 'POST') {
      const formData = new URLSearchParams(body);
      const country = formData.get('country');
      
      if (country) {
        try {
          // Find country code
          const countryResult = await client.query(
            "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
            [country.toLowerCase()]
          );
          
          if (countryResult.rows.length > 0) {
            const countryCode = countryResult.rows[0].country_code;
            
            // Add to visited countries
            await client.query(
              "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
              [countryCode, 1]
            );
          }
        } catch (error) {
          console.log('Error adding country:', error);
        }
      }
      
      // Redirect back to main page
      return {
        statusCode: 302,
        headers: { 'Location': '/.netlify/functions/app' },
        body: ''
      };
    }
    
    // Default response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: '<h1>Family Travel Tracker</h1><p>Function is working!</p>'
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `<h1>Error</h1><p>${error.message}</p>`
    };
  } finally {
    if (client) {
      await client.end();
    }
  }
};
