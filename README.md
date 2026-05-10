# Nivaas

Nivaas is a full-stack MVP for verified apartment, street, or neighbourhood communities. It helps residents move from noisy chat groups to structured posts, notices, resident approvals, a directory, and admin controls.

This MVP intentionally excludes marketplace, payments, SOS, carpooling, borrow/lend, billing, and AI moderation.

## Project Structure

```text
nivaas/
  backend/   Express, JavaScript, Prisma, PostgreSQL, JWT
  mobile/    Expo React Native, TypeScript, NativeWind
```

## Demo Accounts

After seeding the database, use these accounts:

```text
Admin:    admin@nivaas.app / password123
Resident: 9000000002 / password123
Pending:  9000000005 / password123
Invite:   GREEN123
```

Seed data creates one community, approved residents, one pending resident, posts, comments, likes, and notices.

## Backend Setup

```bash
cd backend
npm install
```

Create a PostgreSQL database named `nivaas`, then copy the environment file:

```bash
cp .env.example .env
```

Update `DATABASE_URL` and `JWT_SECRET` in `backend/.env`.

Run migrations, seed data, and start the API:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Health check:

```http
GET http://localhost:4000/health
```

For physical-phone testing, the backend listens on `0.0.0.0`. Use your laptop IPv4 address in the mobile `.env`, for example:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.15:4000/api
```

If the phone cannot reach `http://YOUR_IP:4000/health`, allow inbound TCP port `4000` in Windows Firewall.

## Mobile Setup

```bash
cd mobile
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

For Android emulator:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000/api
```

$env:REACT_NATIVE_PACKAGER_HOSTNAME="laptop IP"
npx expo start --clear

For Expo Go on a physical phone:

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LAPTOP_IPV4:4000/api
```

Start Expo:

```bash
npx expo start --tunnel --clear
```

Use `--tunnel` when LAN does not connect reliably. Use `--lan` only when your phone and laptop can reach each other on the same Wi-Fi.

## Demo Flow

1. Start PostgreSQL and the backend.
2. Run `npx prisma db seed` if you want a fresh demo database.
3. Start Expo and open the app.
4. Login as admin: `admin@nivaas.app` / `password123`.
5. Review the admin dashboard, pending residents, notices, and members.
6. Logout and register a new resident.
7. Enter invite code `GREEN123`.
8. Login as admin again and approve the pending resident.
9. Login as the resident and create a post.
10. Open the post, like it, add a comment, then edit/delete your own post.

## MVP Auth Rules

- Only logged-in users can access app screens.
- Users without a community see the join community screen.
- Pending users see only the pending approval screen.
- Approved residents can access community posts, notices, directory, and profile.
- All backend queries are scoped to the logged-in user's community.
- Admins can approve/reject residents, manage notices, remove residents, pin posts, and delete posts in their own community.
- Residents can edit/delete only their own posts.

## Useful Commands

Backend:

```bash
npm run dev
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

Mobile:

```bash
npm run typecheck
npx expo start --tunnel --clear
npx expo start --lan --clear
```

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
  "name": "Green Park Nivaas",
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

Optional filters:

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
  "title": "Monthly residents meeting",
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
