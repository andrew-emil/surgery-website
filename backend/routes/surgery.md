# Surgery API Documentation

## Base URL

```
http://localhost:4000/api/surgery
```

---

##1. Add Surgery

### **Endpoint**  
`POST /`

### **Description**  
This route allows the creation of a new surgery record, including assigning doctors, setting surgery details, and logging information.

### **Authorization**  
- **TODO:** Implement authentication/authorization middleware to restrict access.

### **Request Body**  
| Parameter            | Type      | Required | Description  |
|----------------------|-----------|----------|--------------|
| `hospitalId`        | `number`  | ✅       | ID of the hospital where surgery is performed. |
| `departmentId`      | `number`  | ✅       | ID of the department. |
| `name`              | `string`  | ✅       | Name of the surgery. |
| `leadSurgeon`       | `string`  | ✅       | ID of the lead surgeon. |
| `slots`             | `number`  | ✅       | Number of slots available for doctors. |
| `doctorsTeam`       | `array`   | ✅       | List of doctors participating in the surgery. |
| `procedureTypeId`   | `number`  | ✅       | ID of the procedure type. |
| `date`              | `string`  | ✅       | Date of surgery (ISO format). |
| `time`              | `string`  | ✅       | Time of surgery. |
| `estimatedEndTime`  | `string`  | ✅       | Estimated completion time. |
| `surgeryEquipments` | `array`   | ✅       | List of required equipment IDs. |
| `cptCode`          | `string`  | ✅       | CPT code for the procedure. |
| `icdCode`          | `string`  | ✅       | ICD code for the procedure. |
| `patientBmi`       | `number`  | ❌       | Patient's BMI (optional). |
| `patientComorbidity` | `array` | ❌       | List of comorbidities (optional). |
| `patientDiagnosis`  | `string`  | ❌       | Patient's diagnosis (optional). |

### **Process Flow**  
1. **Validate Request:**  
   - Ensures all required fields are present and properly formatted.
2. **Fetch Required Entities:**  
   - Retrieves hospital, department, lead surgeon, and procedure type.
   - Verifies that doctors and roles exist and match the procedure requirements.
   - Checks if surgery slots accommodate the number of doctors.
3. **Transaction Handling:**  
   - Creates a new surgery record in SQL database.
   - Logs surgery details in MongoDB.
   - Updates training credits and progress records for doctors.
4. **Response Construction:**  
   - Returns success message or relevant warnings.

### **Success Response**

**Status Code:** `201 Created`

```json
{
	"success": true,
	"message": "Surgery created successfully, some team members roles not qualified for category XYZ procedures."
}
```

### **Error Handling**

If validation fails, or any required entity is missing, an appropriate error response should be returned.

**Example Error Response:**

```json
{
	"success": false,
	"message": "Invalid procedure type",
	"errorDetails": "Error at line 45"
}
```

---
##2. Delete Surgery

### **Endpoint**  
`DELETE /:id`

### **Description**  
This route deletes a surgery record, along with associated logs, authentication requests, and user progress data.

### **Authorization**  
- **TODO:** Implement authentication/authorization middleware to restrict access.

### **Request Parameters**  
| Parameter | Type    | Required | Description                  |
|-----------|---------|----------|------------------------------|
| `id`      | `number` | ✅       | The ID of the surgery to delete. |

### **Process Flow**  
1. **Validate Request:**  
   - Ensure `id` is a valid number; otherwise, return an error.
2. **Fetch Surgery Record:**  
   - Check if the surgery exists in the database.
   - If not found, return a `404 Not Found` error.
3. **Retrieve Related Data:**  
   - Fetch associated `surgeryLogs`, `postSurgery`, and `authenticationRequests` records.
   - Retrieve doctors' progress records related to the deleted surgery.
4. **Update User Progress:**  
   - Reduce the completed count for the procedure if applicable.
   - Remove progress records if `completedCount` becomes zero.
5. **Delete Records:**  
   - Remove the surgery entry and all associated logs, posts, and authentication requests.
   - Call `trainingService.removeSurgeryRecords()` to update training data.
6. **Transaction Handling:**  
   - All operations run in a database transaction.
   - If any step fails, rollback changes and return an error response.

### **Success Response**  

**Status Code:** `204 No Content`

```json
(success response does not return a body)
```

### **Error Handling**  

If an invalid ID is provided:

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid surgery ID format"
}
```

If the surgery record is not found:

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Surgery record not found"
}
```

If an internal server error occurs:

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---
##3. Get Surgery Details

### **Endpoint**  
`GET /:id`

### **Description**  
This route retrieves detailed information about a specific surgery, including hospital and department details, medical codes, the surgical team, patient details, and post-surgery outcomes if available.

### **Authorization**  
- **TODO:** Implement authentication/authorization middleware to restrict access.

### **Request Parameters**  
| Parameter  | Type   | Required | Description                      |
|------------|--------|----------|----------------------------------|
| `id`       | `string` | ✅ | The ID of the surgery to fetch details for. |

### **Process Flow**  
1. **Validate Request:**  
   - Ensure `id` is provided and is a valid number; otherwise, throw an error.
2. **Query Data:**  
   - Fetch the surgery record along with related hospital, department, and equipment details.
   - Retrieve surgery logs to get team members, patient details, and medical codes.
   - Fetch hospital and department details.
   - Get ratings associated with the surgery.
   - Retrieve lead surgeon details.
   - If surgery is completed, fetch post-surgery outcome details.
3. **Format Data:**  
   - Construct a structured response with relevant metadata, medical codes, team details, patient data, and post-surgery outcomes.
4. **Response Construction:**  
   - Return the complete surgery details in a JSON response.

### **Success Response**  

**Status Code:** `200 OK`

```json
{
  "success": true,
  "surgeryId": 123,
  "metadata": {
    "surgeryEquipments": ["Scalpel", "Monitor"],
    "department": "Cardiology",
    "name": "Heart Bypass Surgery",
    "hospital": "City General Hospital",
    "leadSurgeon": "Dr. John Doe"
  },
  "timeline": {
    "date": "2025-04-01",
    "time": "09:00 AM",
    "status": "Completed"
  },
  "medicalCodes": {
    "cpt": "33533",
    "icd": "I25.810"
  },
  "team": [
    {
      "id": 1,
      "name": "Dr. Alice Smith",
      "role": "Assistant Surgeon"
    }
  ],
  "patient": {
    "age": 58,
    "gender": "Male",
    "diagnosis": "Coronary Artery Disease"
  },
  "outcomes": {
    "duration": 180,
    "result": "Successful",
    "dischargeStatus": "Stable"
  },
  "ratings": {
    "overall": 4.5,
    "reviews": 10
  }
}
```

### **Error Handling**  
If the `id` is invalid, missing, or the surgery record is not found, an appropriate error response should be returned.

**Example Error Response:**  

```json
{
  "success": false,
  "message": "Surgery record not found"
}
```
---
#4. Search Surgery API

## Endpoint

`GET /search`

## Description

This API allows users to search for surgeries based on various criteria, including CPT code, ICD code, date, and participant name. Results are paginated.

## Request Parameters

### Query Parameters
| Parameter     | Type   | Required | Description |
|--------------|--------|----------|-------------|
| `cptCode`    | string | No       | Filters surgeries by CPT code (case-insensitive). |
| `icdCode`    | string | No       | Filters surgeries by ICD code (case-insensitive). |
| `date`       | string | No       | Filters surgeries by date (format: `YYYY-MM-DD`). |
| `participant`| string | No       | Searches for surgeries involving a doctor by first or last name. |
| `page`       | number | No       | The page number for pagination (default: `1`). |
| `limit`      | number | No       | Number of results per page (default: `10`, max: `100`). |

## Response

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "surgeries": [
    {
      "surgeryId": 101,
      "date": "2024-03-20",
      "time": "14:00",
      "cptCode": "12345",
      "icdCode": "A00",
      "status": "COMPLETED",
      "leadSurgeon": {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe"
      },
      "doctorsTeam": [
        {
          "doctorId": 7,
          "first_name": "Jane",
          "last_name": "Smith",
          "participationStatus": "CONFIRMED"
        }
      ],
      "patient_details": {
        "id": 50,
        "name": "Alice Johnson",
        "age": 45,
        "gender": "Female"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 5,
    "totalRecords": 1,
    "totalPages": 1
  }
}
```

### Error Responses

**Invalid Date Parameter**

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid date parameter"
}
```

**No Matching Surgeries**

**Status Code:** `200 OK`

```json
{
  "success": true,
  "surgeries": []
}
```

## Notes
- The search is case-insensitive for CPT and ICD codes.
- If a participant's name is provided, the system searches by both first and last name.
- Pagination helps limit the number of returned records, improving performance.

---
#5. Get Surgeries with Open Slots API Documentation

## Endpoint

`GET /open-slots`

## Description

This API retrieves a list of surgeries that have open slots for doctors to join. It filters ongoing surgeries and checks whether they have available slots compared to the number of assigned doctors.

## Request Parameters

This endpoint does not require any query parameters.

## Response

### Success Response

**Status Code:** `200 OK`

```json
{
    "success": true,
    "surgeries": [
        {
            "id": 123,
            "surgeryName": "Heart Bypass Surgery",
            "availableSlot": "2 available (3/5)",
            "hospital": "General Hospital",
            "department": "Cardiology"
        },
        {
            "id": 456,
            "surgeryName": "Appendectomy",
            "availableSlot": "1 available (4/5)",
            "hospital": "City Medical Center",
            "department": "General Surgery"
        }
    ],
    "total": 2
}
```

### Error Responses

#### No Surgeries with Open Slots Found

**Status Code:** `200 OK`

```json
{
    "success": true,
    "surgeries": [],
    "total": 0,
    "message": "No surgeries with open slots found."
}
```

#### Metadata Retrieval Error

**Status Code:** `404 Not Found`

```json
{
    "success": false,
    "message": "Some MetaData are invalid",
    "data": [...]
}
```

## Notes
- The API only returns surgeries with available slots.
- The `availableSlot` field shows the number of available slots and the current number of assigned doctors.
- The response includes hospital and department information for each surgery.

## Implementation Details
- The API fetches ongoing surgeries with a `status` of `ONGOING`.
- It ensures that the `doctorsTeam` field exists and is not empty.
- The response filters surgeries where the `slots` value is greater than the number of assigned doctors.
- Metadata for the surgeries is retrieved from the database and included in the response.

---

This documentation provides a clear overview of how the `getSurgeriesWithOpenSlots` API works. If you need any modifications or additional details, let me know! 🚀

