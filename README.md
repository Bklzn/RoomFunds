[![Deploy to GitHub Pages](https://github.com/Bklzn/RoomFunds/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Bklzn/RoomFunds/actions/workflows/pages/pages-build-deployment)
![API Status](https://img.shields.io/website?url=https%3A%2F%2Froomfunds-backend.onrender.com&down_message=freeze&down_color=blue&label=API%20Status)

# RoomFunds 💰🏠

_Django + React application for managing individual and group expenses_

---

## 🚀 Demo

👉 [RoomFunds Live Demo](https://bklzn.github.io/RoomFunds/)  
_(Note: API hosted on [Render](https://render.com) may have cold-start and take a few minutes to respond)_

<!-- ---

## 📸 Screenshots

_Add some screenshots of the app here:_

![Dashboard](docs/images/dashboard.png)
![Group View](docs/images/groups.png)
![Expense Form](docs/images/expense_form.png) -->

---

## 📌 Features

- 🔑 **Google OAuth authentication**
- 👤 **Guest login**
- ➕ **Add expense records** (with automatic detection and adding of new categories according to user preferences)
- 🏷️ **Add expense categories**
- 👥 **Create groups**
- 📊 **View expense balance**

---

## 🔧 Installation & self-host

You can run the project locally using **Docker Compose**:

```bash
git clone https://github.com/Bklzn/RoomFunds.git
cd RoomFunds
docker-compose up --build
```

You just need to adjust `settings.py` (e.g. database credentials).

---

## 🛠️ Tech Stack

**Backend**  
[![Django][django-shield]][django-url] [![DRF][drf-shield]][drf-url] [![JWT][simplejwt-shield]][simplejwt-url]  
[![PostgreSQL][postgres-shield]][postgres-url] [![OAuth][oauth-shield]][oauth-url]

**Frontend**  
[![React][react-shield]][react-url] [![Vite][vite-shield]][vite-url] [![Axios][axios-shield]][axios-url]  
[![MUI][mui-shield]][mui-url] [![Tailwind][tailwind-shield]][tailwind-url] [![Orval][orval-shield]][orval-url]

**Infrastructure**  
[![Docker][docker-shield]][docker-url] [![Render][render-shield]][render-url] [![Supabase][supabase-shield]][supabase-url]

---

## 🔄 Roadmap

### Upcoming updates

- ✏️ Edit & delete expense records
- ✏️ Edit & delete own groups
- ➕ Add users to groups
- 📈 Visualization: monthly, yearly, daily expenses

### Planned features

- 📂 Import multiple records (CSV/Excel)
- 📊 Advanced visualizations:
  - user comparison
  - categories (pie, bar charts, line trends)
  - top 5 categories
  - percentage share of categories
- 🔔 Notifications
- 📑 Report export

---

## 👨‍💻 Authors

| Name         | GitHub                                   | Info                                           |
| ------------ | ---------------------------------------- | ---------------------------------------------- |
| **Bklzn**    | [@Bklzn](https://github.com/Bklzn)       | Fullstack Developer, backend & frontend author |
| **agatagry** | [@agatagry](https://github.com/agatagry) | Software Tester                                |

---

## 📜 License

MIT License

---

[axios-shield]: https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white
[axios-url]: https://axios-http.com/
[django-shield]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white
[django-url]: https://www.djangoproject.com/
[docker-shield]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/
[drf-shield]: https://img.shields.io/badge/Django%20REST-ff1709?style=for-the-badge&logo=django&logoColor=white
[drf-url]: https://www.django-rest-framework.org/
[simplejwt-shield]: https://img.shields.io/badge/simple%20JWT-F15B29?style=for-the-badge&logo=jsonwebtokens&logoColor=black
[simplejwt-url]: https://django-rest-framework-simplejwt.readthedocs.io/
[mui-shield]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[mui-url]: https://mui.com/
[oauth-shield]: https://img.shields.io/badge/OAuth-Google-blue?style=for-the-badge&logo=google&logoColor=white
[oauth-url]: https://developers.google.com/identity
[orval-shield]: https://img.shields.io/badge/Orval-2563EB?style=for-the-badge&logo=swagger&logoColor=white
[orval-url]: https://orval.dev/
[postgres-shield]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[postgres-url]: https://www.postgresql.org/
[react-shield]: https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb
[react-url]: https://react.dev/
[render-shield]: https://img.shields.io/badge/Render-2E3A59?style=for-the-badge&logo=render&logoColor=white
[render-url]: https://render.com/
[supabase-shield]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[supabase-url]: https://supabase.com/
[tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vitejs.dev/
