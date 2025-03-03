# Roles API Documentation

## Endpoints

### 1. Add Role
**URL:** `POST /roles`

**Description:** Adds a new role.

**Request Body:**
```json
{
  "name": "string",
  "permissions": ["string"]
}
```

**Responses:**
- `201 Created`: Role added successfully.
- `409 Conflict`: Role already exists.
- `400 Bad Request`: Invalid credentials.

---

### 2. Delete Role
**URL:** `DELETE /roles/:id`

**Description:** Deletes a role by its ID.

**Request Parameters:**
- `id` (integer) - Role ID to delete.

**Responses:**
- `204 No Content`: Role deleted successfully.
- `404 Not Found`: Role not found.
- `400 Bad Request`: Invalid ID.

---

### 3. Get All Roles
**URL:** `GET /roles`

**Description:** Retrieves all roles except the "Admin" role.

**Responses:**
- `200 OK`: Returns a list of roles.
- `404 Not Found`: No roles found.

**Response Example:**
```json
{
  "roles": [
    {
      "id": 1,
      "name": "Manager",
      "permissions": ["read", "write"]
    }
  ],
  "total": 5
}
```

---

### 4. Update Role
**URL:** `PUT /roles/:id`

**Description:** Updates an existing role.

**Request Parameters:**
- `id` (integer) - Role ID to update.

**Request Body:**
```json
{
  "name": "string",
  "permissions": ["string"]
}
```

**Responses:**
- `200 OK`: Role updated successfully.
- `404 Not Found`: Role not found.
- `400 Bad Request`: Invalid Role ID.

---

## Notes
- The `permissions` array should contain valid permission actions.
- The "Admin" role is excluded from listing operations.
- Deleting a role will also update associated users to remove that role.

