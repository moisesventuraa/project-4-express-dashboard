# project-4-express-dashboard
## Features

### Front-End Features

- Responsive dashboard layout

- Profile update form with validation

- Dynamic task list management

- Sort and clear task functionality

- JSON save functionality

- API item loading section

- Error handling and loading messages

- Responsive card-based UI

### Back-End Features

- Express.js server

- RESTful API endpoints

- JSON middleware using `express.json()`

- Request logging middleware

- Environment variable integration using `process.env`

- GET and POST API routes

---

## API Endpoints

### GET /api/items

Returns JSON containing dashboard items and a deployment greeting message.

Example response:

```json

{

  "message": "Hello from Render Deployment!",

  "items": [

    {

      "id": 1,

      "title": "Finish Project 4",

      "category": "School"

    }

  ]

}
