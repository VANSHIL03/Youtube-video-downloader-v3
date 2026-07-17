const axios = require('axios');

axios.post('http://localhost:5000/api/analyze', {
  url: 'https://youtu.be/m_pdyZUOrJE?si=D08b_XDOXJqoPaq2'
}).then(res => {
  console.log('SUCCESS:', res.data.title);
  process.exit(0);
}).catch(err => {
  console.error('ERROR:', err.response ? err.response.data : err.message);
  process.exit(1);
});
