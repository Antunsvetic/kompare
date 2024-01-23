# KOMPARE TASK

## MERN stack with GraphQL, Docker and Typescript

## Features:
 - Add new customer
 - View and add coverages
 - View and add discounts
 - Select existing customers and update their coverages or discounts
 - Price details of each customer and their selected coverages or discounts in eur

## Clone repo and install dependencies
 - Clone project `git clone <github-repo>`
 - Move to frontend folder using `cd frontend`
 - Install all dependencies `npm i`
 - Move to backend folder `cd backend`
 - Install all dependencies `npm i`

### Deployment

#### just run
    - docker-compose up -d

## to stop all containers
    - docker-compose down

## to stop and remove all containers
    - docker-compose down -v

### Accessing database

## Exec into mongo container
    - docker exec -it kompare-task-mongo-1 mongosh

## Exec into mongo container
    - use kompare
