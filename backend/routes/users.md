# API Documentation

## Base URL

```
http://localhost:4000/api
```

### 1. Register

## Endpoint

`POST /users/register`

## Description

This route handles user registration by validating input data, hashing the password, generating an OTP for verification, and storing the user in the database.

## Request Body

The request body must follow this schema:

```json
{
	"first_name": "string",
	"last_name": "string",
	"email": "string",
	"phone_number": "string",
	"password": "string",
	"confirm_password": "string"
}
```

## Response

### Success Response (202 Accepted)

```json
{
	"message": "OTP sent. Please verify to complete login."
}
```

### Error Responses

#### 400 Bad Request

- **Passwords do not match**

```json
{
	"message": "Passwords do not match"
}
```

- **Validation errors from Zod**

```json
{
	"message": "Validation error details"
}
```

#### 409 Conflict

- **Email is already registered**

```json
{
	"error": "Email is already registered"
}
```

---

### 2. User Login

## Endpoint

`POST /users/login`

## Description

This endpoint allows users to log in using their email and password. If the credentials are valid, an OTP is generated and sent to the user's email for verification.

## Request

### Headers

- `Content-Type: application/json`

### Body Parameters

| Parameter  | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `email`    | string | Yes      | The user's registered email address. |
| `password` | string | Yes      | The user's password.                 |

### Example Request

```json
{
	"email": "user@example.com",
	"password": "securepassword123"
}
```

## Responses

### Success Response

#### Status: `202 Accepted`

```json
{
	"message": "OTP sent. Please verify to complete login."
}
```

### Error Responses

#### Invalid Credentials

**Status:** `400 Bad Request`

```json
{
	"message": "Invalid credentials"
}
```

#### Account Locked

**Status:** `403 Forbidden`

```json
{
	"error": "Account locked. Try again after HH:MM:SS."
}
```

#### Validation Error

**Status:** `400 Bad Request`

```json
{
	"message": "Validation error: Invalid input"
}
```

---

### 3. Verify 2FA

## Endpoint

**POST** `/users/verify`

## Description

This endpoint verifies the OTP (One-Time Password) provided by the user. If the OTP is valid, the user is authenticated, and a JWT token is issued. If the OTP is invalid, failed attempts are tracked, and the account may be locked after multiple failures.

## Request Body

```json
{
	"email": "user@example.com",
	"otp": "123456"
}
```

### Parameters

| Name  | Type   | Required | Description                   |
| ----- | ------ | -------- | ----------------------------- |
| email | string | Yes      | The email address of the user |
| otp   | string | Yes      | The OTP received via email    |

## Response

### Success Response

**Status Code:** `200 OK`

```json
{
	"message": "Verification successful",
	"token": "<JWT_TOKEN>"
}
```

### Error Responses

#### 400 Bad Request

Occurs if the request does not include required fields.

```json
{
	"error": "Email and OTP are required"
}
```

#### 404 Not Found

Occurs if the provided email does not match any registered user.

```json
{
	"error": "User not found"
}
```

#### 401 Unauthorized

Occurs if the OTP is invalid.

```json
{
	"error": "Invalid OTP"
}
```

#### 403 Forbidden

Occurs if the user has exceeded the maximum number of failed attempts and the account is locked.

```json
{
	"error": "Account locked. Try again after HH:MM:SS."
}
```

## Notes

- If the OTP verification fails multiple times, the user account will be locked for `30 minutes` after `5 failed attempts`.
- Upon successful verification, the user's failed attempts counter is reset, and their last login time is updated.
- The generated JWT token includes user details and a list of surgeries performed by the user.

## Authorization

- No authorization is required for this endpoint since it is part of the authentication process.
- The returned JWT should be used for subsequent authenticated requests.

---

### 4. Forgot Password

## Endpoint
**POST** `/users/forget-password`

## Description
This endpoint allows users to request a password reset by providing their registered email. If the email exists in the system, a reset link will be sent to the provided email address.

## Request Body
```json
{
  "email": "user@example.com"
}
```

## Response
### Success Response
**Status Code:** `200 OK`
```json
{
  "message": "If the email exists, a reset link will be sent."
}
```
*Note: This message is returned whether or not the email exists to prevent email enumeration attacks.*

### Error Responses
- **Missing Email**
  **Status Code:** `400 Bad Request`
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

---

### 5. Reset Password

# Reset Password API

## Endpoint
**POST** `/users/reset-password`

## Description
This endpoint allows users to reset their password using a token received via email.

## Request Body

| Field            | Type   | Required | Description |
|-----------------|--------|----------|-------------|
| `token`        | string | Yes      | The reset token received in the email. |
| `newPassword`  | string | Yes      | The new password the user wants to set. |
| `confirmPassword` | string | Yes      | Must match the `newPassword`. |

### Example Request Body
```json
{
    "token": "abc123xyz",
    "newPassword": "NewSecurePassword123!",
    "confirmPassword": "NewSecurePassword123!"
}
```

## Responses

### Success Response
**Status Code: 200 OK**

#### Response Body
```json
{
    "message": "Password reset successful"
}
```

### Error Responses

#### 400 Bad Request
Occurs when:
- The passwords do not match.
- The token is invalid or has expired.

##### Example Response
```json
{
    "message": "Passwords do not match"
}
```
OR
```json
{
    "error": "Invalid or expired token"
}
```
---

### 6. Delete User Account

# Delete Account API

## Endpoint

**DELETE** `/users/:id`

## Description

Deletes a user account by its ID.

## Request Parameters

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `id`      | String | Yes      | The ID of the user to delete |

## Response

### Success Response

**Status Code:** `204 No Content`

- The user was successfully deleted.

### Error Responses

| Status Code | Message |
|-------------|---------|
| 400 Bad Request | `{ "error": "Invalid user ID" }` - If the user ID is missing or invalid |
| 404 Not Found | `{ "error": "User not found" }` - If no user exists with the given ID |

## Example Requests

### Request

```http
DELETE /api/users/12345
```

### Successful Response

```
204 No Content
```

### Error Response (Invalid ID)

```json
{
  "error": "Invalid user ID"
}
```

### Error Response (User Not Found)

```json
{
  "error": "User not found"
}
```

## Notes
- If the user exists, it will be permanently deleted.
- If the user does not exist, a `404 Not Found` response is returned.
- If the request is malformed or missing the `id` parameter, a `400 Bad Request` response is returned.


---

### 7. Update User Account

# Update Account API

## Endpoint

**PATCH** `/users`

## Description
This endpoint allows an authenticated user to update their account details, including their name, email, phone number, and password. If the password is changed, a new authentication token will be generated.

## Request

### Headers
- `Authorization`: Bearer token (required)

### Body (JSON)
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "old_password": "oldpassword123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

### Body Parameters
- `first_name` (optional, string): New first name
- `last_name` (optional, string): New last name
- `email` (optional, string): New email address
- `phone_number` (optional, string): New phone number
- `old_password` (optional, string): Current password (required if changing password)
- `new_password` (optional, string): New password (required if changing password)
- `confirm_password` (optional, string): Must match `new_password`

## Responses

### Success Response (200 OK)
```json
{
  "message": "Account updated successfully",
  "token": "newly-generated-jwt-token"
}
```
**Notes:**
- A new token is only returned if the password is updated.

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Passwords do not match"
}
```
```json
{
  "error": "Incorrect password"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

#### 404 Not Found
```json
{
  "error": "User not found"
}
```

## Additional Notes
- The request must be authenticated.
- If the email is updated, future authentication attempts will require the new email.
- If a password update occurs, all previous tokens are invalidated.
- An email notification will be sent upon a successful account update.


---

## Notes

- All requests should be sent with `Content-Type: application/json`.
- Protected routes require authentication via JWT tokens.
- Modify the base URL according to your deployment environment.
