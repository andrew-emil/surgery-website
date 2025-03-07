# Roles API Documentation

## Base URL: `http://localhost:4000/api/roles`

## Endpoints

### 1. Add Role
**URL:** `POST /`

**Description:** Adds a new role with optional parent role for hierarchy.

**Request Body:**
```json
{
  "name": "Manager",
  "permissions": ["read", "write"],
  "parentName": "Admin"
}
```

**Responses:**
- `201 Created`: Role added successfully.
- `409 Conflict`: Role already exists.
- `400 Bad Request`: Invalid credentials.
- `404 Not Found`: Parent role not found.

---

### 2. Delete Role
**URL:** `DELETE /:id`

**Description:** Deletes a role by its ID and unlinks child roles and permissions.

**Request Parameters:**
- `id` (integer) - Role ID to delete.

**Responses:**
- `204 No Content`: Role deleted successfully.
- `404 Not Found`: Role not found.
- `400 Bad Request`: Invalid ID.
- `409 Conflict`: Failed to delete role.

---

### 3. Get All Roles
**URL:** `GET /`

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
      "permissions": ["read", "write"],
      "parent": "Admin"
    }
  ],
  "total": 5
}
```

---

### 4. Update Role
**URL:** `PUT /:id`

**Description:** Updates an existing role, including permissions and parent role.

**Request Parameters:**
- `id` (integer) - Role ID to update.

**Request Body:**
```json
{
  "name": "Senior Manager",
  "permissions": ["read", "write", "approve"],
  "parentName": "Manager"
}
```

**Responses:**
- `200 OK`: Role updated successfully.
- `404 Not Found`: Role or parent role not found.
- `400 Bad Request`: Invalid Role ID or parent role loop detected.

---

## Notes
- The `permissions` array should contain valid permission actions.
- The "Admin" role is excluded from listing operations.
- Deleting a role will also update associated users to remove that role.
- A role cannot be its own parent.

