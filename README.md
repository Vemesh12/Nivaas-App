# Mohalla

Mohalla is a focused MVP for verified apartment, street, or neighbourhood communities. It replaces messy group chats with structured posts, notices, resident approval, directory privacy, and admin controls.

This repository intentionally excludes marketplace, payments, SOS, carpooling, borrow/lend, billing, and AI moderation.

## Project Structure

```text
mohalla/
  backend/   Express, JavaScript, Prisma, PostgreSQL, JWT
  mobile/    Expo React Native, TypeScript, NativeWind
```

## Backend Setup

```bash
cd backend
npm install
```

Create a PostgreSQL database, then copy the environment example:

```bash
cp .env.example .env
```

Update `DATABASE_URL` and `JWT_SECRET` in `.env`.

Run Prisma and seed data:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Default seed users:

- Admin: `admin@mohalla.app` / `password123`
- Resident: `9000000002` / `password123`
- Community invite code: `GREEN123`

## Mobile Setup

```bash
cd mobile
npm install
```

Set the API URL for your device or simulator:

```bash
cp .env.example .env
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

 <!-- to connect with mbile expo go app use thi scmd and: -->

 npx expo start --lan --clear


<!-- $env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.1.6"

and to again remove the hostname run thsi :  Remove-Item Env:REACT_NATIVE_PACKAGER_HOSTNAME   to conec tto android studio.

and run : npx expo start --clear -->



For a physical phone, use your computer LAN IP instead of `localhost`.

Start Expo:

```bash
npx expo start
```

## MVP Auth Rules

- Only logged-in users can access app screens.
- Users without a community see the join community screen.
- Pending users see only the pending approval screen.
- Approved residents can access community posts, notices, directory, and profile.
- All backend queries are scoped to the logged-in user's community.
- Admins can approve/reject residents, manage notices, remove residents, pin posts, and delete posts in their own community.
- Residents can edit/delete only their own posts.

## API Documentation

Base URL: `/api`

All routes except register/login require:

```http
Authorization: Bearer <token>
```

### Auth

`POST /auth/register`

```json
{
  "fullName": "Meera Iyer",
  "phone": "9000000002",
  "email": "meera@example.com",
  "password": "password123",
  "flatNumber": "A-204"
}
```

`POST /auth/login`

```json
{
  "identifier": "9000000002",
  "password": "password123"
}
```

`GET /auth/me`

### Communities

`POST /communities`

Creates a community and promotes the creator to approved admin.

```json
{
  "name": "Green Park Mohalla",
  "city": "Hyderabad",
  "area": "Kondapur"
}
```

`POST /communities/join`

```json
{
  "inviteCode": "GREEN123"
}
```

`GET /communities/my-community`

### Posts

`GET /posts`

Optional filter:

```http
GET /posts?category=LOST_FOUND
GET /posts?category=HELP
```

`POST /posts`

```json
{
  "title": "Need plumber recommendation",
  "description": "Kitchen sink is leaking.",
  "category": "HELP",
  "imageUrl": ""
}
```

`GET /posts/:id`

`PUT /posts/:id`

`DELETE /posts/:id`

`POST /posts/:id/like`

`POST /posts/:id/comments`

```json
{
  "text": "Sharing a trusted contact."
}
```

### Notices

`GET /notices`

`POST /notices` admin only

```json
{
  "title": "Monthly community meeting",
  "description": "Sunday at 6 PM in the clubhouse.",
  "isImportant": true
}
```

`PUT /notices/:id` admin only

`DELETE /notices/:id` admin only

### Directory And Profile

`GET /users/directory`

Returns approved residents in the same community. Phone numbers are hidden unless the resident enabled privacy sharing.

`PUT /users/profile`

```json
{
  "fullName": "Meera Iyer",
  "email": "meera@example.com",
  "flatNumber": "A-204",
  "profileImage": ""
}
```

`PUT /users/privacy`

```json
{
  "showPhoneNumber": true
}
```

### Admin

`GET /admin/dashboard`

`GET /admin/pending-residents`

`PUT /admin/users/:id/approve`

`PUT /admin/users/:id/reject`

`DELETE /admin/users/:id`

`PUT /admin/posts/:id/pin`

`DELETE /admin/posts/:id`
