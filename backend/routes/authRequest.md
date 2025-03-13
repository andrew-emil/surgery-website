# Authentication Requests API Documentation

## Base URL

```
http://localhost:4000/api/auth-requests
```

---

## Endpoints

### 1. Create Authentication Request

**POST** `/`

#### Request Body

```json
{
	"surgeryId": "1",
	"traineeId": "2",
	"consultantId": "3",
	"roleId": "4",
	"permissions": ["1", "2"],
	"notes": "Some notes about the request"
}
```

#### Responses

- **201 Created**: Request has been successfully created.
- **400 Bad Request**: Validation error or invalid data.
- **404 Not Found**: Surgery, trainee, or consultant not found.
- **409 Conflict**: A request is already pending.

---

### 2. Approve Authentication Request

**PUT** `/:id/approve`

#### Parameters

- `id` (path): The ID of the authentication request to approve.

#### Responses

- **200 OK**: Request approved successfully.
- **400 Bad Request**: Only pending requests can be approved.
- **404 Not Found**: Authentication request or surgery not found.

---

### 3. Cancel Authentication Request

**PUT** `/:id/cancel`

#### Parameters

- `id` (path): The ID of the authentication request to cancel.

#### Responses

- **200 OK**: Request cancelled successfully.
- **400 Bad Request**: Only pending requests can be cancelled.
- **404 Not Found**: Authentication request or surgery not found.

---

### 4. Get Authentication Requests by Surgery

**GET** `/:surgeryId/request`

#### Parameters

- `surgeryId` (path): The ID of the surgery.

#### Responses

- **200 OK**: Returns the list of authentication requests for the given surgery.
- **400 Bad Request**: Invalid Surgery ID.
- **404 Not Found**: Surgery or requests not found.

---

### 5. Edit Authentication Request

**PUT** `/`

#### Request Body

```json
{
	"surgeryId": "1",
	"traineeId": "2",
	"roleId": "4",
	"permissions": ["1", "2"],
	"notes": "Updated notes"
}
```

#### Responses

- **200 OK**: Request updated successfully.
- **400 Bad Request**: Validation error or invalid data.
- **404 Not Found**: Surgery, trainee, or authentication request not found.

---

### 6. Delete Authentication Request

**DELETE** `/:id`

#### Parameters

- `id` (path): The ID of the authentication request to delete.

#### Responses

- **204 No Content**: Request deleted successfully.
- **400 Bad Request**: Invalid request ID.
- **404 Not Found**: Authentication request or surgery not found.
- **500 Internal Server Error**: Failed to delete authentication request.
