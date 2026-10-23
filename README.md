# campustocorporateclub-c3-
existing deployed link:
https://c3official.vercel.app/

new deployed link :
http://campus-to-corporate-three.vercel.app/

Developer : Nabeel (The batman)

## Backend Environment Variables

The backend configuration is managed via `.env` (see `c3-backend/.env.example` for reference templates):

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port number the backend Express server listens on | `5000` |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb+srv://<user>:<password>@cluster.mongodb.net/c3db` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | Required secure random string |
| `JWT_EXPIRES_IN` | Token expiration duration (e.g. `30d`, `7d`, `24h`) | `30d` |
| `OWNER_EMAIL` | Email address of the primary club owner (grants owner permissions) | `owner@c3club.org` |
| `CLIENT_URL` | Allowed frontend origins (comma-separated for CORS and notification email links) | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier for media uploads | Placeholder / Cloudinary account |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Placeholder / Cloudinary account |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Placeholder / Cloudinary account |
| `SMTP_HOST` | *(Optional)* SMTP host for sending emails | `smtp.gmail.com` |
| `SMTP_PORT` | *(Optional)* SMTP port | `587` |
| `SMTP_EMAIL` | *(Optional)* SMTP username / email address | `your_email@gmail.com` |
| `SMTP_PASS` | *(Optional)* SMTP password or application password | App password |
| `ADMIN_EMAIL` | *(Optional)* Administrator notification recipient email | `admin@c3club.org` |