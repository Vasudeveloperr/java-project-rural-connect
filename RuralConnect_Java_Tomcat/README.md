# RuralConnect — Java + Tomcat + MySQL

This version upgrades the RuralConnect marketplace demo into a Java web application for a Java class.

## Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Java Servlets
- Server: Apache Tomcat 11.0.26
- Servlet API: Jakarta Servlet 6.1
- Database: MySQL
- Database access: JDBC
- Build: Maven

Tomcat 11.0.26 implements Servlet 6.1 and is designed to run on Java 17 or later. The modern Jakarta package is `jakarta.servlet.*`.

## Project structure
```text
RuralConnect_Java_Tomcat/
├── index.html                 # Frontend source copy
├── css/                       # Frontend styling
├── js/                        # Frontend JavaScript
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/ruralconnect/
│   │   ├── model/
│   │   ├── dao/
│   │   ├── servlet/
│   │   └── util/
│   ├── src/main/resources/db.properties
│   └── src/main/webapp/
│       ├── index.html
│       ├── css/
│       ├── js/
│       └── WEB-INF/web.xml
└── database.sql
```

## Current Java backend
- `DBConnection.java` — JDBC connection
- `Product.java` — product model
- `ProductDAO.java` — reads products from MySQL
- `ProductServlet.java` — `GET /api/products`
- `database.sql` — creates database and starter products

## Setup
1. Install JDK 17 or newer.
2. Install Apache Tomcat 11.0.26.
3. Install MySQL.
4. Run `database.sql` in MySQL.
5. Edit `backend/src/main/resources/db.properties` and replace `CHANGE_ME` with your MySQL password.
6. From the `backend` folder run:
   `mvn clean package`
7. Copy `backend/target/ruralconnect.war` into Tomcat's `webapps` folder.
8. Start Tomcat.
9. Open:
   `http://localhost:8080/ruralconnect/`

## Important
The existing UI and auction demo are retained. The first Java integration stage reads marketplace products from MySQL through the Java Servlet API. Authentication, orders, auctions and bids are being moved from browser-only storage to the database in the next stage.
