# API 명세

| Method | Base Route | Endpoint | Description | Request Body | Response |
|--------|------------|----------|-------------|--------------|----------|
| POST   | `/` | `/register`| 회원가입 엔드포인트 | `username` (string) `email` (string) `password` (string) | Success or error message |
| POST   | `/` | `/social-register` | |  |    |
| POST   | `/` | `/login` |  |  | |
| DELETE | `/` | `/logout` |  |  |  |
| POST   | `/` | `/refresh` |  |  |  |
| GET    | `/` | `/verify-email` |  |  |  |
| GET    | `/` | `/google` | |  | |
| GET    | `/` | `/auth/google/callback` |  | |  |
| GET    | `/api` | `/account/:id` | |  | |
| PUT    | `/api` | `/account/:id` | | |    |
| DELETE | `/api` | `/account/:id` | |   |  |
