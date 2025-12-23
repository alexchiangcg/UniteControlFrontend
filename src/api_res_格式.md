### 取得booking 資料
```
[
  {
    "id": "bk-123",
    "resourceName": "Robert08000",
    "startTime": "2024-06-13T09:00:00Z",
    "endTime": "2024-06-13T11:00:00Z",
    "status": "running",
    "dataRoom": "Data room Left",
    "utilization": {
      "leftCapacity": "5%",
      "bookingStatus": "Booking Now"
    },
    "server": {
      "name": "Robert0808",
      "type": "analytics",
      "gpu": 2,
      "dataUsed": 42
    }
  },
  {
    "id": "bk-124",
    "resourceName": "Alice-001",
    "startTime": "2024-06-13T12:00:00Z",
    "endTime": "2024-06-13T14:00:00Z",
    "status": "overlap",
    "dataRoom": "Data room Right",
    "utilization": {
      "leftCapacity": "0%",
      "bookingStatus": "Full"
    },
    "server": {
      "name": "Alice-srv",
      "type": "training",
      "gpu": 4,
      "dataUsed": 88
    }
  }
]
```