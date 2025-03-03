# API Documentation

## Base URL

```
http://localhost:4000/api
```

### 1. User Registration

**Endpoint:** `POST users/register`

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

**Endpoint:** `POST users/login`

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

**Endpoint:** `POST users/verify`

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

**Endpoint:** `POST users/forget-password`

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

**Endpoint:** `POST users/reset-password`

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

### 6. Delete User Account

**Endpoint:**  `DELETE /users/:id`

**Request Body:**

This endpoint does not accept a request body.

**Response:**

# Success

-   **Status Code:** 204 No Content
-   **Body:** (Empty)

---

### 7. Update User Account

**Endpoint:**  `PUT /users/`

**Request Body:**

The request body should be a JSON object containing the fields to update. All fields are optional except when updating the password.

-   **`first_name` (string, optional)
-   **`last_name` (string, optional)
-   **`email` (string, optional)
-   **`phone_number` (string, optional)
-   **`old_password` (string, optional)
-   **`new_password` (string, optional)
-   **`confirm_password` (string, optional)

**Response:**

# Success

-   **Status Code:** 200 OK
-   **Body:**
    ```json
    {
      "message": "Account updated successfully",
      "token": "<new_jwt_token>" // Only present if the password was updated.
    }
    ```

---
## Notes

- All requests should be sent with `Content-Type: application/json`.
- Protected routes require authentication via JWT tokens.
- Modify the base URL according to your deployment environment.
