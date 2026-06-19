---
layout: page
title: Full-Stack Web Development
description: Building scalable web applications with Django, FastAPI, and modern frontend technologies
img: assets/img/transparent.png
importance: 8
category: web
related_publications: false
---

## Overview

I build end-to-end web applications with a focus on clean APIs, performant backends, and responsive interfaces. My primary stack centers on **Django** and **FastAPI** for backend services, paired with modern frontend tooling.

---

## 🐍 Backend Skills

### Django
- Full-stack development with Django's ORM, class-based views, and template engine
- REST APIs via **Django REST Framework** — serializers, viewsets, token/JWT auth
- Database design with PostgreSQL; migrations, query optimization
- Background tasks with Celery + Redis
- Admin customization and role-based access control

### FastAPI
- Async REST APIs with automatic OpenAPI/Swagger documentation
- Pydantic models for request/response validation
- Dependency injection, OAuth2, and JWT authentication
- Deployment with Uvicorn/Gunicorn behind Nginx

---

## 🌐 Featured Project — Transparent Rentals

<div class="row justify-content-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/transparent.png" title="Transparent Rentals" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <a href="https://www.transparentrentals.com/" target="_blank">transparentrentals.com</a> — a rental listing platform built for transparency in the Ghanaian rental market.
</div>

**Transparent Rentals** is a full-stack rental listing platform designed to bring clarity and trust to the rental market. Key highlights:

- **Backend**: Django + Django REST Framework powering property listings, user accounts, and search
- **Search & Filtering**: Location-based filtering, price range, and property type queries
- **Authentication**: Secure user registration, login, and landlord/tenant role separation
- **Responsive UI**: Mobile-first design for accessibility across devices
- **Deployment**: Cloud-hosted with managed PostgreSQL and media storage

🔗 Live site: [transparentrentals.com](https://www.transparentrentals.com/)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Django, FastAPI, DRF |
| Database | PostgreSQL, SQLite |
| Auth | JWT, Django Auth, OAuth2 |
| Frontend | HTML/CSS, JavaScript, Bootstrap |
| DevOps | Docker, Nginx, Gunicorn, Uvicorn |
