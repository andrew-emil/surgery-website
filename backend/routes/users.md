# API Documentation

## Base URL

```
http://localhost:4000/api/users
```
---

### **1. Register**  

## **Endpoint**  
`POST /register`  

## **Description**  
This route handles **user registration** by validating input data, ensuring unique credentials, hashing the password, linking the user to a role, affiliation, and optionally a department, and generating an OTP for verification.  

## **Request Body**  

The request body must follow this schema:  

```json
{
	"first_name": "string",
	"last_name": "string",
	"email": "string",
	"phone_number": "string",
	"password": "string",
	"roleId": "number",
	"affiliationId": "number",
	"departmentId": "number (optional)",
	"residencyLevel": "number (only required if role is 'Resident')"
}
```

### **Field Descriptions**  
| Field           | Type    | Required | Description |
|----------------|--------|----------|-------------|
| `first_name`   | string | ✅ Yes  | User's first name. |
| `last_name`    | string | ✅ Yes  | User's last name. |
| `email`        | string | ✅ Yes  | User's email address. Must be unique. |
| `phone_number` | string | ✅ Yes  | User's phone number. Must be unique. |
| `password`     | string | ✅ Yes  | User's password (hashed before storing). |
| `roleId`       | number | ✅ Yes  | ID of the user's role (e.g., Doctor, Resident, Admin). |
| `affiliationId`| number | ✅ Yes  | ID of the affiliated hospital/clinic. |
| `departmentId` | number | ❌ No  | ID of the department (required only if applicable). |
| `residencyLevel` | number | ❌ No  | Required **only if** `roleId` corresponds to a **Resident**. |

---

## **Response**  

### ✅ **Success Response (202 Accepted)**  
```json
{
	"success": true,
	"message": "OTP sent. Please verify to complete login."
}
```

---

### ❌ **Error Responses**  

#### 🔴 **400 Bad Request**  
- **Validation errors from Zod (invalid/missing fields).**  

```json
{
	"success": false,
	"message": "Invalid affiliation ID"
}
```

#### 🔴 **409 Conflict**  
- **Email or Phone Number is already registered.**  

```json
{
	"success": false,
	"message": "Phone Number is already registered"
}
```

#### 🔴 **404 Not Found**  
- **Role, Affiliation, or Department does not exist.**  

```json
{
	"success": false,
	"message": "Affiliation Not Found"
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

### "Success" Response

#### Status: `202 Accepted`

```json
{
	"success": true,
	"message": "OTP sent. Please verify to complete login."
}
```

### Error Responses

#### Invalid Credentials

**Status:** `400 Bad Request`

```json
{
	"success": false,
	"message": "Invalid credentials"
}
```

#### Account Locked

**Status:** `403 Forbidden`

```json
{
	"success": false,
	"error": "Account locked. Try again after HH:MM:SS."
}
```

#### Validation Error

**Status:** `400 Bad Request`

```json
{
	"success": false,
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
	"success": true,
	"message": "Verification successful",
	"token": "<JWT_TOKEN>"
}
```

### Error Responses

#### 400 Bad Request

Occurs if the request does not include required fields.

```json
{
	"success": false,
	"error": "Email and OTP are required"
}
```

#### 404 Not Found

Occurs if the provided email does not match any registered user.

```json
{
	"success": false,
	"error": "User not found"
}
```

#### 401 Unauthorized

Occurs if the OTP is invalid.

```json
{
	"success": false,
	"error": "Invalid OTP"
}
```

#### 403 Forbidden

Occurs if the user has exceeded the maximum number of failed attempts and the account is locked.

```json
{
	"success": false,
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
	"success": true,
	"message": "If the email exists, a reset link will be sent."
}
```

_Note: This message is returned whether or not the email exists to prevent email enumeration attacks._

### Error Responses

- **Missing Email**
  **Status Code:** `400 Bad Request`
  ```json
  {
  	"success": false,
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

| Field         | Type   | Required | Description                             |
| ------------- | ------ | -------- | --------------------------------------- |
| `token`       | string | Yes      | The reset token received in the email.  |
| `newPassword` | string | Yes      | The new password the user wants to set. |

### Example Request Body

```json
{
	"token": "abc123xyz",
	"newPassword": "NewSecurePassword123!"
}
```

## Responses

### Success Response

**Status Code: 200 OK**

#### Response Body

```json
{
	"success": true,
	"message": "Password reset successful"
}
```

### Error Responses

#### 400 Bad Request

Occurs when:

- The token is invalid or has expired.

##### Example Response

```json
{
	"success": false,
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

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `id`      | String | Yes      | The ID of the user to delete |

## Response

### Success Response

**Status Code:** `204 No Content`

- The user was successfully deleted.

### Error Responses

| Status Code     | Message                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| 400 Bad Request | `{ "error": "Invalid user ID" }` - If the user ID is missing or invalid |
| 404 Not Found   | `{ "error": "User not found" }` - If no user exists with the given ID   |

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
	"success": false,
	"error": "Invalid user ID"
}
```

### Error Response (User Not Found)

```json
{
	"success": false,
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
	"new_password": "newpassword123"
}
```

### Body Parameters

- `first_name` (optional, string): New first name
- `last_name` (optional, string): New last name
- `email` (optional, string): New email address
- `phone_number` (optional, string): New phone number
- `old_password` (optional, string): Current password (required if changing password)
- `new_password` (optional, string): New password (required if changing password)

## Responses

### Success Response (200 OK)

```json
{
	"success": true,
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
	"success": false,
	"error": "Incorrect password"
}
```

#### 401 Unauthorized

```json
{
	"success": false,
	"error": "Unauthorized"
}
```

#### 404 Not Found

```json
{
	"success": false,
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
