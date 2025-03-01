# API Documentation

## Base URL

```
http://localhost:4000
```

### 1. Add Role

**Endpoint:** `POST /roles`

## Request Headers

-   **Authorization:** `Bearer <token>` (required) - JWT token for authentication. (Only Admins)

## Request Body

The request body should be a JSON object containing the following fields:

-   **`name` (string, required):** The name of the new role.
-   **`permissions` (array of strings, required):** An array of permission actions (strings) to associate with the role. These actions must correspond to existing permission actions.

## Response

### Success

-   **Status Code:** 201 Created
-   **Body:**
    ```json
    {
      "message": "Role added successfully"
    }
    ```

### Client Errors

-   **Status Code:** 400 Bad Request
    -   **Body:**
        ```json
        {
          "error": "Invalid credentials"
        }
        ```
        This error is returned when the `name` or `permissions` fields are missing or invalid.

-   **Status Code:** 409 Conflict
    -   **Body:**
        ```json
        {
          "error": "Role already exists"
        }
        ```
        This error is returned when a role with the same name already exists.
