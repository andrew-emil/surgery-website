# API Documentation - Notification Routes

## Base URL
```
http://localhost:4000/api/notification
```

---
### 1. Create Notification
**POST** `/`

#### Request Body
```json
{
  "userId": "string",
  "type": enum NOTIFICATION_TYPES {
	INVITE = "invite",
	AUTH_REQUEST = "auth_request",
	SCHEDULE_UPDATE = "schedule_update",
},
  "message": "string"
}
```
#### Response
```json
{
  "success": true,
  "notification": {}
}
```
---
### 2. Get User Notifications
**GET** `/:userId`

#### Response
```json
{
  "success": true,
  "notifications": [],
  "unreadCount": "number"
}
```
---
### Mark Notification as Read
**PUT** `/`

#### Request Body
```json
{
  "userId": "string",
  "notificationId": "string"
}
```
#### Response
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```
---
