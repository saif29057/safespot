# SafeSpot — Road safety analytics platform

A web platform that scores the **risk of a road trip** and helps choose a safer route. A Python ETL process collects weather and routing data, stores it in PostgreSQL, and feeds road-risk scoring, cost prediction and route optimisation shown in an analytics dashboard.

## Features

- **ETL pipeline** — Python jobs collect data from the **OpenWeather** and **OSRM** (routing) APIs and load it into PostgreSQL.
- **Road-risk scoring** — combines weather conditions and route characteristics into a risk score.
- **Cost prediction** — estimates the cost of a trip.
- **Route optimisation** — compares candidate routes on risk and cost.
- **Dashboard** — analytics views for users, with authentication.

## Architecture

```
OpenWeather API ─┐
                 ├─► Python ETL ─► PostgreSQL ─► Django API (scoring, prediction, routes) ─► React front end
OSRM routing API ┘
```

The data model and UML diagrams (use cases, classes) were designed before development.

## Project structure

| Folder | Content |
| --- | --- |
| `back/` | Django back end, ETL and scoring |
| `Front/` | React front end |

## Tech stack

Python · Django · PostgreSQL · ETL · OpenWeather API · OSRM · React · UML

## Author

**Saif Sbaiti** — final-year engineering student, Data Science & AI, TEK-UP University (Tunisia) · [LinkedIn](https://www.linkedin.com/in/saif-sbaiti-3b9a32360)
