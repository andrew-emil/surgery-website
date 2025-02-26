# API Documentation

## Base URL

```
http://localhost:4000
```

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/users/register`

**Request Body:**

```json
{
	"first_name": "John",
	"last_name": "Doe",
	"email": "john.doe@example.com",
	"phone_number": "+201234567890",
	"password": "password123",
	"confirm_password": "password123"
}
```

**Response:**

```json
{
	"message": "OTP sent. Please verify to complete login."
}
```

---

### 2. User Login

**Endpoint:** `POST /api/users/login`

**Request Body:**

```json
{
	"email": "john.doe@example.com",
	"password": "password123"
}
```

**Response:**

```json
{
	"message": "OTP sent. Please verify to complete login."
}
```

---

### 3. Verify 2FA

**Endpoint:** `POST /api/users/verify`

**Request Body:**

```json
{
	"email": "john.doe@example.com",
	"otp": "123456"
}
```

**Response:**

```json
{
  "message": "Verification successful",
  "token": "{
	userId: string;
	userRole: string;
	name: string;
	tokenVersion: number;
	surgeries: Array<{
		id: string;
		date: Date;
		status: string;
		stars: number;
		patient_id: string;
	}>;
}"
}
```

---

### 4. Forgot Password

**Endpoint:** `POST /api/users/forget-password`

**Request Body:**

```json
{
	"email": "john.doe@example.com"
}
```

**Response:**

```json
{
	"message": "If the email exists, a reset link will be sent."
}
```

---

### 5. Reset Password

**Endpoint:** `POST /api/users/reset-password`

**Request Body:**

```json
{
	"token": "reset-token",
	"newPassword": "newpassword123",
	"confirmPassword": "newpassword123"
}
```

**Response:**

```json
{
	"message": "Password reset successful"
}
```

---

## Notes

- All requests should be sent with `Content-Type: application/json`.
- Protected routes require authentication via JWT tokens.
- Modify the base URL according to your deployment environment.
