# Surgery Equipment API Documentation

## Base URL

```
http://localhost:4000/api/surgery-equipments
```

---

## Endpoints

### 1. Get Surgery Equipment List

**Endpoint:** `GET /`

**Authorization:** Admin, Consultant

**Query Parameters:**

- `page` (optional, default: `1`): Page number for pagination

**Response:**

```json
{
	"success": true,
	"equipments": [
		{
			"id": 1,
			"equipment_name": "Scalpel"
		},
		{
			"id": 2,
			"equipment_name": "Forceps"
		}
	],
	"pagination": {
		"total": 50,
		"page": 1,
		"totalPages": 3,
		"limit": 20
	}
}
```

---

### 2. Add Surgery Equipment

**Endpoint:** `POST /`

**Authorization:** Admin

**Request Body:** (multipart/form-data)

- `name` (string, required): Equipment name
- `photo` (file, required): Image of the equipment

**Response:**

```json
{
	"success": true,
	"message": "Equipment added successfully"
}
```

**Error Responses:**

- `409 Conflict`: Equipment already exists

---

### 3. Delete Surgery Equipment

**Endpoint:** `DELETE /:id`

**Authorization:** Admin

**Response:**

```json
{
	"success": true,
	"message": "Surgery Equipment deleted successfully."
}
```

**Error Responses:**

- `400 Bad Request`: Invalid equipment ID
- `404 Not Found`: Equipment not found

---

### 4. Update Surgery Equipment

**Endpoint:** `PUT /:id`

**Authorization:** Admin

**Request Body:** (application/json)

```json
{
	"name": "Updated Scalpel",
	"photo": "<Base64 encoded image>"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Equipment updated successfully"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid request format
- `404 Not Found`: Equipment not found
- `409 Conflict`: Equipment name already exists
