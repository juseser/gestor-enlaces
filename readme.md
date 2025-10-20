# 🔗 Gestor de Enlaces PRO (Full-Stack)

Aplicación full-stack desarrollada para gestionar y categorizar enlaces web de interés. El sistema consta de una API RESTful en Python (Flask) y un cliente web interactivo construido con React.

La aplicación permite guardar URLs, automáticamente extrae el título de la página (Web Scraping) y sugiere una categoría.

---

## 🌐 Enlace en Producción

🔗 [https://mini-crm-1-x5jd.onrender.com/](https://mini-crm-1-x5jd.onrender.com/)

---

### 🚀 Despliegue

- **Backend** desplegado en [Render](https://render.com/)
- **Frontend** desplegado en [Render](https://render.com/)
- **Base de datos MongoDB Atlas** en la nube proporcionada por [https://www.mongodb.com/](https://www.mongodb.com/)

---

# 🚀 Tecnologías Utilizadas

Este proyecto se divide en dos entornos:

**Backend (API REST)**

- Python: Lenguaje principal.

- Flask: Microframework web para la creación de la API.

- MongoDB (a través de MongoDB Atlas): Base de datos NoSQL para almacenamiento persistente de enlaces y estadísticas.

- Requests & BeautifulSoup4: Librerías para realizar Web Scraping y obtener títulos de URLs.

- Flask-CORS: Manejo de políticas de Cross-Origin Resource Sharing.

**Frontend (Cliente Web)**

- React: Librería principal para la interfaz de usuario.

- Vite: Herramienta de construcción y entorno de desarrollo rápido.

- Tailwind CSS: Framework CSS utility-first para un diseño rápido y responsivo.

- Lucide React: Colección de iconos ligeros.

---

# ⚙️ Instalación y Configuración

Asegúrate de tener Python (versión 3.9+) y Node.js (versión 18+) instalados en tu sistema.

1. Configuración de la Base de Datos

    - Crea una cuenta gratuita en MongoDB Atlas.

    - Obtén la cadena de conexión de tu cluster (URI).

    - Reemplaza la URL de conexión en tu archivo gestor-enlaces-backend/app.py con tu propia URI.

    - app.config["MONGO_URI"] = "mongodb+srv://<TU_USUARIO>:<TU_PASSWORD>@<TU_CLUSTER>/gestor_enlaces?retryWrites=true&w=majority"



2. Configuración e Inicio del Backend (API Flask)

    - Abre una terminal dentro de la carpeta gestor-enlaces-backend/:

    - Crea el entorno virtual (si no existe):

    - python -m venv venv

    - Inicia el servidor Flask:

        - python app.py


    El API se ejecutará en http://127.0.0.1:5000. (Recuerda que si modificaste el app.py para evitar el WinError 10038, debes reiniciar el servidor manualmente después de cada cambio de código Python).

3. Configuración e Inicio del Frontend (React)

    - Abre una nueva terminal dentro de la carpeta gestor-enlaces-frontend/:

    - Instala las dependencias de Node:

    - npm install  # o yarn install

    - Inicia la aplicación React con Vite:

        - npm run dev  # o yarn dev

La aplicación se abrirá en tu navegador (generalmente en http://localhost:5173).


