# Department Routes Documentation

## Base URL: `http://localhost:4000/api/departments`

### 1. **Add a Department**

**Endpoint:** `POST /`

**Description:** Adds a new department under a specific affiliation.

**Request Body:**

```json
{
	"name": "Cardiology",
	"affiliationId": 1
}
```

**Responses:**

- `201 Created` – Department added successfully.
- `400 Bad Request` – Invalid department name, affiliation ID, or department already exists.
- `404 Not Found` – Affiliation not found.

---

### 2. **Get Departments by Affiliation**

**Endpoint:** `GET /:id`

**Description:** Fetches all departments under a given affiliation.

**Path Parameters:**

- `id` (integer) – Affiliation ID

**Responses:**

- `200 OK` – Returns a list of departments.
- `400 Bad Request` – Invalid affiliation ID.
- `404 Not Found` – No departments found for this affiliation.

**Example Response:**

```json
{
	"success": true,
	"departments": [
		{ "id": 1, "name": "Cardiology" },
		{ "id": 2, "name": "Neurology" }
	]
}
```

---

### 3. **Get Doctors in a Department**

**Endpoint:** `GET /get-doctors/:id`

**Description:** Fetches all doctors assigned to a department.

**Path Parameters:**

- `id` (integer) – Department ID

**Responses:**

- `200 OK` – Returns a list of doctors.
- `400 Bad Request` – Invalid department ID.
- `404 Not Found` – No department or doctors found.

**Example Response:**

```json
{
	"doctors": [
		{
			"id": 1,
			"name": "Dr. John Doe",
			"email": "john@example.com",
			"phoneNumber": "123-456-7890",
			"role": "Surgeon"
		}
	]
}
```

---

### 4. **Update a Department**

**Endpoint:** `PUT /`

**Description:** Updates a department's details, including affiliation and surgery types.

**Request Body:**

```json
{
	"id": 1,
	"name": "Updated Department",
	"affiliationId": 2,
	"surgeryTypes": [1, 2, 3]
}
```

**Responses:**

- `200 OK` – Department updated successfully.
- `400 Bad Request` – Invalid department ID, affiliation ID, or missing fields.
- `404 Not Found` – Department, affiliation, or surgery types not found.

**Example Response:**

```json
{
	"success": true,
	"message": "Department updated successfully",
	"department": {
		"id": 1,
		"name": "Updated Department",
		"affiliationId": 2,
		"surgeryTypes": [{ "id": 1, "name": "Heart Surgery" }]
	}
}
```

---

### 5. **Delete a Department**

**Endpoint:** `DELETE /:id`

**Description:** Deletes a department and removes its associations.

**Path Parameters:**

- `id` (integer) – Department ID

**Responses:**

- `204 No Content` – Department deleted successfully.
- `400 Bad Request` – Invalid department ID.
- `404 Not Found` – Department not found.

---

### Notes:

- All requests and responses are in JSON format.
- Ensure IDs are valid integers.
- Departments with associated surgery types will have their relationships cleared before deletion.
- Departments are associated with affiliations, and this should be considered when modifying data.
