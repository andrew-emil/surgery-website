# Surgical Role API Documentation

## Base URL: `http://localhost:4000/api/surgical-role`

---

### 1. Get All Surgical Roles

**Endpoint:** `GET /`

**Description:**  
Fetches all available surgical roles.

**Response:**

#### Success

**Status Code:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Scrub Nurse",
    "createdAt": "2025-04-01T08:00:00.000Z"
  },
  ...
]
```

#### Error

**Status Code:** `404 Not Found`

```json
{
  "message": "No sugical role were found"
}
```

---

### 2. Add a Surgical Role

**Endpoint:** `POST /`

**Description:**  
Adds a new surgical role.

**Request Body:**

| Field | Type   | Required | Description               |
| ----- | ------ | -------- | ------------------------- |
| name  | string | Yes      | Name of the surgical role |

**Example:**

```json
{
  "name": "Assistant Surgeon"
}
```

**Response:**

#### Success

**Status Code:** `201 Created`

```json
{
  "message": "surgical role created successfully"
}
```

#### Error

**Status Code:** `400 Bad Request`

```json
{
  "message": "Invalid or missing 'name' field"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Surgical Role already exist"
}
```

---

### 3. Update a Surgical Role

**Endpoint:** `PUT /:id`

**Description:**  
Updates an existing surgical role by ID.

**Request Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| id        | number | Yes      | ID of the surgical role      |

**Request Body:**

| Field | Type   | Required | Description               |
| ----- | ------ | -------- | ------------------------- |
| name  | string | Yes      | Updated name of the role  |

**Response:**

#### Success

**Status Code:** `200 OK`

```json
{
  "message": "surgical role updated successfully"
}
```

#### Error

**Status Code:** `400 Bad Request`

```json
{
  "message": "Invalid ID format"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Surgical role not found"
}
```

---

### 4. Delete a Surgical Role

**Endpoint:** `DELETE /:id`

**Description:**  
Deletes a surgical role by ID.

**Request Parameters:**

| Parameter | Type   | Required | Description             |
| --------- | ------ | -------- | ----------------------- |
| id        | number | Yes      | ID of the surgical role |

**Response:**

#### Success

**Status Code:** `201 Created`

```json
{
  "message": "surgical role deleted successfully"
}
```

#### Error

**Status Code:** `400 Bad Request`

```json
{
  "message": "Invalid ID format"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Surgical role not found"
}
```