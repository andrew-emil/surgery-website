# ProcedureType API Documentation

## Base URL
```
http://localhost:4000/api/procedure-types
```

---
## Endpoints

### 1. Create a ProcedureType
**Endpoint:**
```
POST /api/procedure-types
```
**Request Body:**
```json
{
  "name": "string",
  "category": "SURGERY_TYPE"
}
```
**Response:**
```json
{
  "id": 1,
  "name": "Example Procedure",
  "category": "GENERAL_SURGERY"
}
```
**Status Codes:**
- `201 Created` - Successfully created the procedure type
- `500 Internal Server Error` - Server error

---

### 2. Get All ProcedureTypes
**Endpoint:**
```
GET /api/procedure-types
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Example Procedure",
    "category": "GENERAL_SURGERY"
  }
]
```
**Status Codes:**
- `200 OK` - Successfully retrieved the procedure types
- `500 Internal Server Error` - Server error

---

### 3. Update a ProcedureType
**Endpoint:**
```
PUT /api/procedure-types/:id
```
**Request Body:**
```json
{
  "name": "Updated Procedure",
  "category": "SPECIALIZED_SURGERY"
}
```
**Response:**
```json
{
  "id": 1,
  "name": "Updated Procedure",
  "category": "SPECIALIZED_SURGERY"
}
```
**Status Codes:**
- `200 OK` - Successfully updated the procedure type
- `404 Not Found` - Procedure type not found
- `500 Internal Server Error` - Server error

---

### 4. Delete a ProcedureType
**Endpoint:**
```
DELETE /api/procedure-types/:id
```
**Response:**
```json
{
  "message": "ProcedureType deleted successfully"
}
```
**Status Codes:**
- `200 OK` - Successfully deleted the procedure type
- `404 Not Found` - Procedure type not found
- `500 Internal Server Error` - Server error

