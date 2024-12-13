# About Project

Nutritional health is an area of great relevance in people's daily lives, and often those who have no experience in the kitchen turn to various sources, such as websites, magazines or even experts, to learn how to prepare their meals. In this context, the idea arose to develop a **food recipe management application using the React Native framework**, with the aim of offering users a practical and accessible tool to help them prepare and choose their meals on a daily basis.

The aim of the application is to allow users to search for various recipes, filtering them by specific categories and storing them in categories customised by users for later consultation. The backend is developed using the **Flask framework in Python**, although this is not the main focus of the project and is simplistic in nature. In addition, the application also includes a **simulation of sending e-mails, using Docker**.

Note: The application also uses an **external API** to search for meals.

# Functionalities

The application offers the following functionalities in order to provide users with a complete and interactive experience:

- Application authentication
- Password recovery by simulating sending an email
- User profile management
- Consult profile statistics using visual graphs
- Management of customizable categories
	- Create and edit categories
	- Delete categories
		- Delete the category only
		- Delete the category and associated food recipes
	- Remove recipes from categories
- Food recipe management
	- Consult/Explore food recipes
	- Apply filters to the food recipes query
	- Add a recipe to the categories customized by the user
	- Modify the categories linked to a recipe
	- Display the menu for the day (Breakfast, Lunch and Dinner) and save it in a custom category **(Receitas Consumo Diário)**

# Architecture

The technological solution was divided into five components:

- **Mobile Application** - Represents the main objective of the project and was developed in **React Native** in order to meet the named requirements.
- **REST API** - Developed using the **Flask** framework, in python, in order to introduce the management of customizable categories by end users.
- **External API** - The external API [Spoonacular](https://spoonacular.com/food-api) was used to search for culinary recipes, displaying information about the recipes, ingredients and culinary menus.
- **Database** - Used to store information on the management of user categories and the respective recipes within them.
- **Email Sending Simulation Server** - Add-on to the solution, used to simulate "recuperação da password" feature in order to simulate sending an email to technical support.

Some of the solution's libraries are important to mention because they add a lot of weight to the solution:

- Mobile Application
  - **expo-secure-store** - Unlike web applications that store content directly in the browser, more specifically in the storage session as an application token, this library replicates the behavior for mobile devices, both for Android and iOS, but applies encryption methods to the key values and stores the content locally on the device.
  - **axios** - Used to make requests to external services such as the **REST API** and the **external API**.
  - **react-redux** - Due to the use of React mechanics, where screens are composed of multiple components, state management is required. This library facilitates the sharing and synchronization of data between components in a predictable and centralized manner.
  - **react-native-paper** - Used for the layout of the application, responsible for simplistic components.
  - As these are Javascript libraries, the rest of the libraries can be consulted at the root of the mobile application in the **package.json** file.
- REST API
  - **SQLAlchemy** - Responsible for communicating with the database and building the structure in it
  - As these are python libraries, the rest of the libraries can be consulted at the root of the backend directory in the **requirements.txt** file.

## Decisions

The technologies adopted in this solution for the various components were chosen with the aim of deepening the fundamental concepts of their operation and integration, with a view to acquiring knowledge and skills in the area of mobile device development.

The **React Native** language was chosen for the development of the mobile application due to its widespread use in the development of mobile solutions, as well as the following factors:

- Allows development for multi-platforms such as Android and iOS
- Smoother learning curve by using programming languages such as Javascript and React
- Easy integration of the libraries present in the Javascript language
- Code reuse, which means there is no added complexity in understanding the technical aspects of the solution
- Great support from the community, which helped in the realization of the application
- Real-time visualization when code changes are detected, without having to recompile the application (Hot Reloading)

The Python-based Flask framework was used to develop the backend component. It should be emphasized that this component is of secondary importance, since its purpose is to help the mobile application with its requirements and not to present a well-structured REST API, so this framework was used for the following reasons:

- The simplicity of implementing and understanding the framework
- Flexibility, in terms of ease of integrating different tools and libraries without impositions
- Allows rapid development without too many setbacks
- Good performance, as it is a small solution
- Scalability, in the event of future development and more complex needs, this component facilitates growth according to demand

To avoid using static food recipe information, such as a limited selection of recipes, which would not meet the solution's objective, the external API [Spoonacular](https://spoonacular.com/food-api) was used. This API facilitates searching and filtering recipes and was chosen because it is one of the most widely used globally, offering complete information on meals, ingredients, products and menus, as well as providing support for meal and diet planning, including detailed data on nutritional information. Although it is a public domain interface with a daily limit of 500 queries on the free plan, this limit is sufficient for demonstrating the solution.

The database **can be any** for this solution, since the REST API component already contains the database schema and when you start it is automatically built on top of the database.

As the aim of the solution is the mobile application, it was used to **complement the application**, more specifically "recuperação da password" feature, through an email sending simulation server, [MailHog](https://github.com/mailhog/MailHog), which consists of a pre-configured environment that facilitates the monitoring of email sending, over the SMTP protocol.

## Structure of Mobile App

Although it was possible to use templates with automatic routing to develop the application, we opted for an approach of creating it from scratch, with the aim of studying and understanding in detail how the process would work during development. In this way, the mobile application was structured as follows:

- **api** - Contains all the functions that communicate with external services, both the REST API and Spoonacular's external API
- **assets** - Contains the application's images and styles
- **screens** - Contains the screens and subcomponents used in the application, represents the application features
- **components** - Contains the application's generic components, which are used in the **screens** directory
- **stores** - Represent the data shared and synchronized on the various screens/components by the react-redux library
- **routes** - Represents the application's navigation method, in other words, refers to the behavior of the application's navigation stack, it is associated with the screens in logical navigation order, for example when the user is not authenticated he is directed to the login screens and can navigate to the registration or password recovery screen and when authenticated he no longer has access to these screens and now has access to the corresponding business logic screens. It's important to mention that can be use different navigation stacks in an application

# Softwares Requeriments

In order to help test the application, the **Docker** tool was used to automate the preparation of the environment with which the application will communicate to carry out its services, so **two ways** of configuring this solution will be presented, from the most automatic to the most manual.

To run the application, it is necessary to install the [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) software on the mobile device, which helps with the real-time development of the application and is used to test the solution

For dependencies **npm** on mobile app - The default package manager for the JavaScript ecosystem. It is used to install and manage project dependencies

## Docker Alternative

- **Docker and Docker Desktop** - Platform for creating and managing containers to run applications in an isolated and portable way.

**Again**, this software allows you to prepare the environment with which the mobile application will communicate in an automated way, without having to configure the REST API components, the respective database and the email sending simulation server.

## Manual Alternative

- **Python** - High-level, interpreted scripting, imperative, object-oriented, functional, dynamically typed and strong programming language
- **Database** - Flask framework supports multiple database management systems like MySQL, PostgreSQL, SQLite, and SQL Server.
  - This project used mysql database format for development
- **[MailHog](https://github.com/mailhog/MailHog)** - Multi-platform software that simulates a mail server, a complement to the solution, **not the purpose of the application**.

## Optional Softwares

- **Postman** - A collaboration tool for API development. It is used to test the application's endpoints.
- **Laragon** - A local development environment that includes Apache, PHP, MySQL, and other essential tools for developers. It is a recommended option on Windows if a manual alternative is chosen.

# How to run Project

**Mobile App**

```bash
# Inside the mobileApp folder (first time, do after choise alternative)
# Dont forget to rename the file env-example.js to env.js in api folder
# The variable apiKey value must be changed to the correspondent token from spoonacular platform
# The value of the apiDomain variable must be changed to the URL of the corresponding REST API
npm install

# To run the application (Do after alternative choised)
# Scan the QRCode or use the URL in Expo Application on mobile device
npm run start
```

## Docker Alternative

```bash
# Inside the root directory
# Dont forget to rename the file .env-example to .env (in backend folder) before to run this command
# (Prepares the solution's background, REST API, database and email sending simulation server)
docker compose up -d
```

## Manual Alternative

Before configuring the REST API, it is essential to start the database and the email sending simulation server, **MailHog**.

**API REST**

```bash
# Inside the backend folder (first time)
python -m venv .venv

# When you want to start application
# In Windows
./.venv/Scripts/activate
# In Linux
. .venv/bin/activate

# To install dependencies
pip install -r requirements.txt

# Rename the file .env-example to .env
# In variable JWT_SECRET_KEY place in the value the text you want - is used to generate the tokens
# In variable SQLALCHEMY_DATABASE_URI replace the correspondent {tags} to database conection work
# Be careful, the database URI was configured to mysql conection, if you want use a diferent database for example postgres database, get information from SQLAlchemy package
# In file routes/status.py change the lines 21 and 22 to the correspondent conection of fake server sending email

python app.py
```

# Reminders

**Be careful** with the application's ports to avoid conflicts.

- **API REST** - :5000
- **Database** - normally runs on port :3306 (Docker Alternative)
- **SMTP Server** - email sending simulation server
  - :1025 - port for sending email
  - :8080 - port for monitoring incoming emails

As the focus of the solution is not on a complex structure, but on understanding development on mobile devices, access to the database structure is not exposed. If you use the **Docker** tool and want to access and consult the database, you must change the **docker-compose.yml** file, uncommenting lines 17 and 18 and commenting out lines 15 and 16, making it necessary to recompile the solution using the **Docker** alternative.

When running Docker, there may be a delay in initializing the database, which may result in the REST API not starting, making it necessary to initialize the component manually (app-1) in the **Docker Desktop** application or by command line.

When using the mobile application, it is possible to disable the External API feature, presenting only a static food recipe for consultation. This allows you to develop the application while avoiding excessive use of the External API, since the **Spoonacular** interface in the free plan has a limit of 500 daily requests. To do this, the lines to be modified are as follows:

```txt
# Inside the mobileApp folder

# On file /screens/explore/index.jsx
Uncomment lines 62, 63, 49 to 59, 36, 33
Comment lines 35, 24 to 32

# On file /screens/explore/recipe
Uncomment lines 20, 28 to 31
Comment line 21

# To reapply the use of the External API, perform the reverse operations
```

# References

The following tools were used to create this solution, which were essential for achieving the desired objective

- Spoonacular API
  - https://spoonacular.com/food-api
- Basic login template
  - https://github.com/tomekvenits/react-native-login-template
- Email sending simulation server (MailHog)
  - https://github.com/mailhog/MailHog
