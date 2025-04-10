# Schedule API Documentation

## Base URL: `http://localhost:4000/api/schedule`

## Endpoints

---

#1. Get Availability Calendar API Documentation

## Endpoint

**GET** `/availability-calendar/:userId`

## Description

This API fetches the availability calendar of a user based on their scheduled surgeries.

## Request Parameters

| Parameter | Type   | Required | Description                                                                 |
| --------- | ------ | -------- | --------------------------------------------------------------------------- |
| `userId`  | string | Yes      | The unique identifier of the user whose availability calendar is requested. |

## Response

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "availabilityCalendar": [
    {
      "date": "2025-04-01",
      "events": [
        {
          "time": "08:00 AM",
          "slots": 2,
          "estimatedEndTime": "10:00 AM"
        },
        {
          "time": "02:00 PM",
          "slots": 1,
          "estimatedEndTime": "03:30 PM"
        }
      ]
    },
    {
      "date": "2025-04-02",
      "events": []
    }
  ]
}
```

### Error Responses

#### Invalid User ID

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid user ID"
}
```

#### User Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "User not found in the system"
}
```

## Notes

- The availability calendar is determined based on the user's scheduled surgeries.
- The API checks both `doctorsTeam` and `leadSurgeon` fields to determine the user's participation in surgeries.
- The response groups events by day within the queried date range.

---

## Get Recommended Staff

**Endpoint:** `POST /recommend-staff`

**Description:**
Returns a list of recommended staff members based on expertise, availability, and department affiliation.

**Query Parameters:**

- `affiliationId` (string, required): The ID of the affiliation to search within.
- `departmentId` (string, required): The department ID to filter by.
- `date` (string, required): Date of recommendation (`YYYY-MM-DD`).
- `time` (string, required): Time slot for which staff is being recommended.
- `page` (integer, optional, default: 1): Pagination - specifies the page number.

**Response:**

```json
{
  "success": true,
  "recommendedStaff": [
    {
      "id": "123",
      "firstName": "Alice",
      "lastName": "Johnson",
      "expertise": "Cardiology"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 5,
    "numberOfPages": 1
  }
}
```
