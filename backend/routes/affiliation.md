# API Documentation - Affiliation Routes

## Base URL
```
http://localhost:4000/api/affiliation
```

---

## 1. Get All Affiliations

### **Endpoint**
`GET /`

### **Description**
Retrieves a paginated list of all affiliations in the database.

### **Query Parameters**
| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| `page`    | number | No       | Page number (default: 1)           |

### **Success Response**
**Status Code:** `200 OK`
```json
{
  "success": true,
  "affiliations": [
    {
      "id": 1,
      "name": "Cairo General Hospital",
      "city": "Cairo",
      "country": "Egypt",
      "address": "123 Nile Street",
      "institution_type": "Hospital"
    }
  ],
  "page": 1,
  "total": 1,
  "totalPages": 1
}
```

### **Error Responses**
**404 Not Found**
```json
{
  "success": false,
  "message": "No affiliations found"
}
```

---

## 2. Add Affiliation

### **Endpoint**
`POST /`

### **Description**
Adds a new affiliation to the database.

### **Request Body**
```json
{
  "name": "Cairo General Hospital",
  "country": "Egypt",
  "city": "Cairo",
  "address": "123 Nile Street",
  "institution_type": "Hospital"
}
```

### **Success Response**
**Status Code:** `201 Created`
```json
{
  "success": true,
  "message": "Affiliation created successfully",
  "newAffiliation": {
    "id": 1,
    "name": "Cairo General Hospital",
    "city": "Cairo",
    "country": "Egypt",
    "address": "123 Nile Street",
    "institution_type": "Hospital"
  }
}
```

### **Error Responses**
**400 Bad Request** - Validation Error
```json
{
  "success": false,
  "message": "Invalid institution type: Clinic"
}
```
**400 Bad Request** - Duplicate Entry
```json
{
  "success": false,
  "message": "Affiliation already exists"
}
```

---

## 3. Delete Affiliation

### **Endpoint**
`DELETE /:id`

### **Description**
Deletes an affiliation and unlinks related users and departments.

### **Path Parameters**
| Parameter | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| `id`      | number | Yes      | ID of the affiliation to delete |

### **Success Response**
**Status Code:** `204 No Content`

### **Error Responses**
**400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid Affiliation ID"
}
```
**404 Not Found**
```json
{
  "success": false,
  "message": "Invalid Affiliation ID"
}
```
**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 4. Update Affiliation

### **Endpoint**
`PATCH /`

### **Description**
Updates an existing affiliation.

### **Request Body**
```json
{
  "id": "1",
  "name": "Updated Hospital Name",
  "city": "Alexandria",
  "country": "Egypt",
  "address": "456 Coastal Road",
  "institution_type": "Clinic"
}
```

### **Success Response**
**Status Code:** `200 OK`
```json
{
  "success": true,
  "message": "Affiliation updated successfully",
  "affiliation": {
    "id": 1,
    "name": "Updated Hospital Name",
    "city": "Alexandria",
    "country": "Egypt",
    "address": "456 Coastal Road",
    "institution_type": "Clinic"
  }
}
```

### **Error Responses**
**400 Bad Request** - Invalid Data
```json
{
  "success": false,
  "message": "Invalid Affiliation ID"
}
```
**404 Not Found**
```json
{
  "success": false,
  "message": "Affiliation Not Found"
}
```
**400 Bad Request** - Invalid Institution Type
```json
{
  "success": false,
  "message": "Invalid institution type: Research Center"
}
```

---

## **Audit Logging**
- The `auditLogger` middleware is applied to all modification routes (`POST`, `PATCH`, `DELETE`).
- Logs user actions for tracking changes in affiliations.

---

## **Notes**
- All requests should be sent with `Content-Type: application/json`.