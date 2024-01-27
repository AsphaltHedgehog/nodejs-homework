require('dotenv').config();

const { DB_HOST, SECRET, BREVO_API_KEY, EMAIL, GOOGLEKEY, BASE_URL } = process.env;


module.exports = {
  dbHost: DB_HOST,
  secret: SECRET,
  brevoApiKey: BREVO_API_KEY,
  email: EMAIL,
  gmailKey: GOOGLEKEY,
  baseUrl: BASE_URL
}