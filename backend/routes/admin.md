# API Documentation - Admin Routes

## Base URL

```
http://localhost:4000/api/admin
```

---
##1. Get Pending Users

### **Endpoint**  
`GET /pending-users`

### **Description**  
This route allows an **Admin** to retrieve a list of all users whose accounts are pending approval. The response includes details such as the user's name, email, residency level, phone number, profile picture, role, affiliation, and department.

### **Authorization**  
- **Role Required:** Admin  
- The request must be made by an authenticated user with an Admin role. If the user is not an Admin, the route throws an "Access Denied" error.

### **Process Flow**  
1. **Authorization Check:**  
   - Ensures the request is made by an Admin. Otherwise, an "Access Denied" error is thrown.
2. **Database Query:**  
   - Fetches users with `account_status` set to `PENDING` from the database.
   - Joins related tables (`role`, `affiliation`, `department`) to include relevant information.
   - Orders users by `created_at` in ascending order.
3. **Data Sanitization:**  
   - Converts the user's profile picture into a base64 string.
   - Formats the response with essential user details.
4. **Response:**  
   - Returns a `200 OK` response with the list of pending users.

### **Success Response**

**Status Code:** `200 OK`

```json
{
	"success": true,
	"message": "Pending users retrieved successfully",
	"data": [
		{
			"id": "user123",
			"first_name": "John",
			"last_name": "Doe",
			"email": "john.doe@example.com",
			"residencyLevel": "Level 3",
			"phone_number": "+1234567890",
			"picture": "base64_encoded_string",
			"role": "User",
			"affiliation": "Some Organization",
			"department": "IT"
		}
	]
}
```

### **Error Responses**

1. **Unauthorized Request**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "Access denied"
     }
     ```

2. **No Pending Users Found**
   - **Status:** `200 OK`
   - **Response:**  
     ```json
     {
     	"success": true,
     	"message": "No pending user accounts found",
     	"data": []
     }
     ```

---

##2. Approve User Account

### **Endpoint**  
`PATCH /approve-user/:userId`

### **Description**  
This route is used by an **Admin** to approve a user's account. It validates the provided activation token against the token stored for the user. If the token is valid and the account is not already active, the user’s account status is updated to active, the activation token and token expiry are cleared, and an account approval email is sent.

### **Authorization**  
- **Role Required:** Admin  
- The request must be made by an authenticated user with an Admin role. If the user is not an Admin, the route throws an "Unauthorized" error.

### **Request Parameters**  

#### URL Parameters  
| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `userId`  | string | ✅ Yes   | ID of the user to be approved. |

#### Query Parameters  
| Parameter         | Type   | Required | Description                                    |
| ----------------- | ------ | -------- | ---------------------------------------------- |
| `activationToken` | string | ✅ Yes   | Activation token to validate the account.      |

### **Process Flow**  
1. **Token Validation:**  
   - Checks if both `userId` and `activationToken` are provided. If not, throws an "Invalid token" error.
2. **Authorization Check:**  
   - Verifies that the request is made by an Admin. Otherwise, an "Unauthorized" error is thrown.
3. **User Retrieval:**  
   - Searches for the user in the database by `userId`. If no user is found, an error "User not found" is thrown.
4. **Status Verification:**  
   - If the user account is already active, the response returns a `400 Bad Request` with a message "Account is already active".
5. **Token Comparison:**  
   - Compares the provided `activationToken` with the one stored for the user. If they do not match, an "Invalid token" error is thrown.
6. **Account Update:**  
   - Sets the user's account status to active, clears the activation token and expiry, then saves the updated user.
7. **Notification:**  
   - Sends an account approval email to the user.
8. **Response:**  
   - Returns a `200 OK` response with a success message.

### **Success Response**

**Status Code:** `200 OK`

```json
{
	"success": true,
	"message": "User approved successfully"
}
```

### **Error Responses**

1. **Missing or Invalid Token**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "Invalid token"
     }
     ```
   
2. **Unauthorized Request**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "Unauthorized"
     }
     ```

3. **User Not Found**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "User not found"
     }
     ```

4. **Account Already Active**
   - **Status:** `400 Bad Request`
   - **Response:**  
     ```json
     {
     	"success": false,
     	"message": "Account is already active"
     }
     ```

5. **Invalid Activation Token**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "Invalid token"
     }
     ```

---

##3. Reject User Account

### **Endpoint**  
`PATCH /reject-user/:userId`

### **Description**  
This route allows an **Admin** to reject a user's account. The request must include a valid activation token and a rejection reason. If the user’s account is successfully rejected, a notification email is sent to inform them.

### **Authorization**  
- **Role Required:** Admin  
- The request must be made by an authenticated user with an Admin role. If the user is not an Admin, the route throws an "Unauthorized" error.

### **Request Parameters**  

#### URL Parameters  
| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `userId`  | string | ✅ Yes   | ID of the user to be rejected. |

#### Query Parameters  
| Parameter         | Type   | Required | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| `activationToken` | string | ✅ Yes   | Activation token for validating the request.    |

#### Request Body  
| Parameter         | Type   | Required | Description                      |
| ----------------- | ------ | -------- | -------------------------------- |
| `rejectionReason` | string | ✅ Yes   | Reason for rejecting the account. |

### **Process Flow**  
1. **Validation:**  
   - Checks if `userId`, `activationToken`, and `rejectionReason` are provided. If any is missing, a `400 Bad Request` is returned.
2. **Authorization Check:**  
   - Ensures the request is made by an Admin. Otherwise, an "Unauthorized" error is thrown.
3. **User Retrieval:**  
   - Searches for the user in the database by `userId`. If no user is found, an error "User not found" is thrown.
4. **Account Status Check:**  
   - If the user account is already rejected (`INACTIVE` status), the response returns a `400 Bad Request` with a message "Account is already rejected".
5. **Token Validation:**  
   - Compares the provided `activationToken` with the one stored for the user. If they do not match, an "Invalid activation token" error is returned.
6. **Account Update:**  
   - Updates the user’s `account_status` to `INACTIVE`, clears the activation token and expiry, and saves the rejection reason.
7. **Notification:**  
   - Sends an account rejection email to the user.
8. **Response:**  
   - Returns a `200 OK` response confirming the rejection.

### **Success Response**

**Status Code:** `200 OK`

```json
{
	"success": true,
	"message": "User account rejected successfully"
}
```

### **Error Responses**

1. **Missing Parameters**
   - **Status:** `400 Bad Request`
   - **Response:**  
     ```json
     {
     	"success": false,
     	"message": "Missing user ID or activation token"
     }
     ```
   
2. **Missing Rejection Reason**
   - **Status:** `400 Bad Request`
   - **Response:**  
     ```json
     {
     	"success": false,
     	"message": "Rejection reason is required"
     }
     ```

3. **Unauthorized Request**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "Unauthorized"
     }
     ```

4. **User Not Found**
   - **Status:** `500 Internal Server Error` (or as handled by global error middleware)
   - **Response:**  
     ```json
     {
     	"error": "User not found"
     }
     ```

5. **Account Already Rejected**
   - **Status:** `400 Bad Request`
   - **Response:**  
     ```json
     {
     	"success": false,
     	"message": "Account is already rejected"
     }
     ```

6. **Invalid Activation Token**
   - **Status:** `400 Bad Request`
   - **Response:**  
     ```json
     {
     	"success": false,
     	"message": "Invalid activation token"
     }
     ```

---

##4. Get Surgery Success Rates

### **Endpoint**  
`GET /dashboard/success-rates`

### **Description**  
This route retrieves the success rate of surgeries by calculating the percentage of successful surgeries out of the total number of surgeries recorded in the database.

### **Authorization**  
- **TODO:** Implement authentication/authorization middleware to restrict access.

### **Request Parameters**  
None.

### **Process Flow**  
1. **Data Retrieval:**  
   - Fetches the total number of surgeries from the `postSurgeryRepo`.
   - Fetches the number of successful surgeries where the outcome equals `OUTCOME.SUCCESS`.
2. **Success Rate Calculation:**  
   - If there are recorded surgeries, the success rate is calculated as:  
     ```
     successRate = (totalSuccess / total) * 100
     ```
   - The result is rounded to two decimal places.
3. **Response Construction:**  
   - Returns the calculated success rate along with surgery statistics.

### **Success Response**

**Status Code:** `200 OK`

```json
{
	"success": true,
	"data": {
		"successRate": 75.5,
		"totalSurgeries": 200,
		"successfulSurgeries": 151,
		"failedSurgeries": 49
	}
}
```

### **Error Handling**

If an error occurs while fetching data or performing calculations, an appropriate error response should be returned (to be handled by error middleware).

---

##5. Get Surgery Complication Trends

### **Endpoint**  
`GET /dashboard/complication-trends`

### **Description**  
This route retrieves data on surgery complications, analyzing trends based on discharge status, complication types, and success rates.

### **Authorization**  
- **TODO:** Implement authentication/authorization middleware to restrict access.

### **Request Parameters**  
None.

### **Process Flow**  
1. **Data Retrieval:**  
   - Filters records where `complications` exist and are not empty.
   - Splits complication strings into arrays and trims unnecessary spaces.
   - Filters out cases where the complication is explicitly marked as “none.”
2. **Data Aggregation:**  
   - Groups data by `dischargeStatus` and individual complications.
   - Computes:
     - **Total Cases** per complication.
     - **Average Surgical Duration** for cases with the complication.
     - **Outcome Distribution** (Success/Failure).
   - Calculates the **Success Rate** for each complication.
   - Sorts and limits results to the **Top 10 Complications** per discharge status.
3. **Response Construction:**  
   - Returns aggregated data, categorized by discharge status.
   - Includes total analyzed records.

### **Success Response**

**Status Code:** `200 OK`

```json
{
	"analysis": [
		{
			"dischargeStatus": "Stable",
			"totalComplications": 50,
			"complications": [
				{
					"complication": "infection",
					"count": 20,
					"successRate": 0.85,
					"avgDuration": 120.5
				},
				...
			]
		}
	],
	"analyzedRecords": 100
}
```

### **Error Handling**

If an error occurs during data retrieval or processing, an appropriate error response should be returned (to be handled by error middleware).

---
##6. Get Team Performance Metrics

### **Endpoint**  
`GET /dashboard/team-performance/:affiliationId`

### **Description**  
This route retrieves performance metrics for doctors based on their affiliation.

### **Authorization**  
- **TODO:** Implement authentication/authorization middleware to restrict access.

### **Request Parameters**  
| Parameter       | Type   | Required | Description                      |
|---------------|--------|----------|----------------------------------|
| `affiliationId` | `string` | ✅ | The ID of the affiliation to fetch performance data for. |

### **Process Flow**  
1. **Validate Request:**  
   - Ensure `affiliationId` is provided; otherwise, throw an error.
2. **Query Data:**  
   - Retrieves users and joins their progress and affiliation data.
   - Computes the **average number of completed surgeries** for each doctor.
3. **Response Construction:**  
   - Returns a list of doctors with their average surgeries performed.

### **Success Response**

**Status Code:** `200 OK`

```json
{
	"success": true,
	"teams": [
		{
			"doctorName": "Dr. John Doe",
			"avg_surgeries": 15.6
		},
		...
	]
}
```

### **Error Handling**

If `affiliationId` is missing or invalid, an appropriate error response should be returned (to be handled by error middleware).

---
## Export Logs

### Endpoint
`GET /export`

### Description
Exports surgery logs within a specified date range in CSV, PDF, or Excel format.

### Query Parameters
| Parameter   | Type   | Required | Description |
|------------|--------|----------|-------------|
| format     | string | Yes      | The format of the export file (`csv`, `pdf`, or `excel`). |
| startDate  | string | Yes      | The start date for filtering logs (ISO 8601 format). |
| endDate    | string | Yes      | The end date for filtering logs (ISO 8601 format). |

### Responses
- **200 OK**: Returns the exported file in the requested format.
- **400 Bad Request**: If the format is invalid.
- **404 Not Found**: If no logs exist in the given date range.

---

## Get Audit Trail

### Endpoint
`GET /audit`

### Description
Retrieves audit trail logs based on action type and date range.

### Query Parameters
| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| action    | string | Yes      | The type of action (e.g., `Login`, `Signup`, `UPDATE`). |
| startDate | string | No       | Start date for filtering logs. |
| endDate   | string | No       | End date for filtering logs. |
| page      | number | No       | Page number for pagination. Defaults to `1`. |

### Responses
- **200 OK**: Returns a list of audit logs with pagination info.
- **400 Bad Request**: If the action type is invalid or startDate is after endDate.

---

## Get Users

### Endpoint
`GET /users`

### Description
Retrieves a paginated list of active users who are not consultants.

### Query Parameters
| Parameter | Type   | Required | Description |
|----------|--------|----------|-------------|
| page     | number | No       | The page number for pagination. Defaults to `1`. |

### Responses
- **200 OK**: Returns a list of users with role, affiliation, and department details.

---

## Promote User

### Endpoint
`GET /promote/:userId`

### Description
Promotes a user to a higher role in the hierarchy.

### Path Parameters
| Parameter | Type   | Required | Description |
|----------|--------|----------|-------------|
| userId   | string | Yes      | The ID of the user to promote. |

### Responses
- **200 OK**: If the user was successfully promoted.
- **400 Bad Request**: If the user is already at the highest role.
- **404 Not Found**: If the user does not exist.

