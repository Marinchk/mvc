
# Collaboration Platform

A simple web application for creating and managing collaborative projects. Users can create projects, invite participants, track progress, and manage team roles.

## Funkcje

- Rejestracja i uwierzytelnianie użytkowników
- Tworzenie i zarządzanie współpracą
- Zaproś użytkowników przez e-mail i przypisz role
- Śledź indywidualne i całkowite postępy
- Uprawnienia tylko dla właściciela do edycji i usuwania projektów

## Używane biblioteki zewnętrzne:

Express-framework do tworzenia serwera

Mongoose-praca z MongoDB

EJS-silnik szablonów dla HTML

Express-session-zarządzanie sesjami użytkowników

Body-parser - parsowanie zapytań

Nodemon-restart serwera przy zmianach (tryb dev)

Bcrypt-haszowanie haseł

dotenv-Ładowanie zmiennych środowiskowych

## Struktura aplikacji:

models
User.js-schemat użytkownika (nazwa, email, hasło) 

Collaboration.js-schemat współpracy (właściciel, uczestnicy, postęp, opis)

controllers
authController.js-rejestracja, logowanie i wylogowanie

collaborationController.js-operacje CRUD na współpracy

routes
authRoutes.js - trasy rejestracji / logowania

collaborationRoutes.js-trasy do współpracy

views
dashboard.ejs - Strona główna użytkownika z jego projektami

collaboration.ejs - strona oddzielnej współpracy

register.ejs, login.EJS-formularze rejestracji i logowania

public
styles / -style CSS dla szablonów EJS

## Przykładowe dane wejściowe:
Rejestracja użytkownika:
Imię: Marina

Email: marina@example.com

Hasło: secure password

## Tworzenie :
Tytuł: Projekt A
Opis: projekt koncepcyjny

## Co może zrobić właściciel (owner) kolaboracji:

Edytuj opis 
Dodawanie nowych członków-zapraszanie użytkowników do projektu i przypisywanie im ról.

Usuń uczestników-wyklucz każdego uczestnika z projektu.

Usuń samą współpracę — całkowicie Usuń projekt, jeśli nie jest już potrzebny. (na dashboard)

Zarządzaj postępem projektu-Aktualizuj procent wykonanej pracy u wszystkich uczestników

## Co może zrobić zwykły członek (member):
Zobacz szczegóły projektu-zobacz opis, listę uczestników i bieżące postępy.

zarządzaj swoimi postępami

Opuść projekt-Wyjdź ze współpracy samodzielnie(klikając na 🚪 ikonę na dashboard).

Ograniczony dostęp do edycji


## Install dependencies:
Pobierz repozytorium z git
Wymaga mongodb ( cmd mongodb -- version aby zrozumieć, czy masz)
npm install

npm run dev
