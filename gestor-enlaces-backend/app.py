import os
from dotenv import load_dotenv

import requests
from bs4 import BeautifulSoup
import re


# Dependencias del Servidor
from flask import Flask, request, jsonify
from flask_cors import CORS

# Dependencias de MongoDB
from pymongo import MongoClient
from bson.objectid import ObjectId

# IMPORTACIÓN DE MÓDULOS FUNCIONALES (Corregidos)
from analysis import get_title_from_url, classify_text_simple
from crudService import create_link_db, get_all_links_db, update_link_db, delete_link_db, get_stats_db # <-- Usa 'crudService'

# --- 1. CONFIGURACIÓN INICIAL Y CONEXIÓN DB ---
load_dotenv()
app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# Inicialización y Variables Globales de Conexión
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    links_collection = db["links"]
    print(f"Conectado a MongoDB Atlas. Base de datos: {DB_NAME}")
except Exception as e:
    print(f"Error al conectar con MongoDB: {e}")

# Definimos las categorías conocidas para la clasificación
CATEGORIES = {
    'programación': ['algoritmo', 'código', 'desarrollo', 'software', 'python', 'java', 'html', 'css', 'javascript', 'framework', 'mongodb', 'flask'],
    'tecnología': ['noticias', 'gadgets', 'inteligencia artificial', 'ia', 'computación', 'hardware', 'cyberseguridad'],
    'finanzas': ['economía', 'inversión', 'bolsa', 'crypto', 'criptomoneda', 'trading', 'mercado', 'negocios'],
    'deportes': ['fútbol', 'baloncesto', 'tenis', 'formula 1', 'juegos olímpicos', 'deporte', 'partido'],
    'música': ['canción', 'álbum', 'artista', 'banda', 'género musical', 'concierto', 'video musical'],
    'educación': ['tutorial', 'aprender', 'curso', 'universidad', 'escuela', 'historia', 'ciencia']
}

# --- 2. ENDPOINTS DE LA API (CRUD y Análisis) ---

# POST: CREAR un nuevo enlace (TU RUTA DE EJEMPLO ADAPTADA AL SERVICIO)
@app.route("/links", methods=["POST"])
def create_link_route():
    try:
        data = request.json
        url = data.get('url')
        title_provided = data.get('title')

        if not url:
            return jsonify({"error": "La URL es requerida"}), 400

        # Llama a la función de analysis.py
        title = title_provided if title_provided else get_title_from_url(url)

        # Llama a la función de crudService.py
        link_id = create_link_db(data, title, links_collection)

        return jsonify({
            "message": "Enlace creado con éxito",
            "id": link_id,
            "title_used": title
        }), 201

    except Exception as e:
        return jsonify({"error": f"Error al crear el enlace: {str(e)}"}), 500


# GET: LEER todos los enlaces (EJEMPLO COMPLETO)
@app.route("/links", methods=["GET"])
def get_all_links_route():
    try:
        # Llama a la función de crudService.py
        links = get_all_links_db(links_collection)
        return jsonify(links), 200

    except Exception as e:
        return jsonify({"error": f"Error al obtener enlaces: {str(e)}"}), 500

# PUT: ACTUALIZAR UN ENLACE
@app.route("/links/<id>", methods=["PUT"])
def update_link(id):
    try:
        data = request.json
        url = data.get('url')
        title_manual = data.get('title') # Capturamos el título si lo pasa el usuario
        
        # 1. Si la URL fue modificada, evaluamos si necesitamos hacer Web Scraping
        if url:
            # Si el usuario NO proporcionó un título manual, intentamos obtener uno con scraping
            if not title_manual: 
                # Reutilizamos la lógica del servicio de análisis
                # Llama a la función y guarda el resultado en una variable temporal 'result'
                result = get_title_from_url(url)
                
                # Aseguramos que el resultado sea una tupla de 2 elementos
                if result and len(result) == 2:
                    title, category_guess = result
                else:
                    # Si el scraping falla, usamos valores de respaldo
                    title, category_guess = "Título no disponible", "Sin Categoría"
                
                # Actualizamos el diccionario 'data' con el título (solo si se tuvo que hacer scraping)
                data['title'] = title
            
            # Si el usuario NO proporcionó categoría, usamos la sugerencia del análisis
            # Nota: category_guess solo se define si se hizo scraping (o con "Sin Categoría")
            if 'category' not in data or not data.get('category'):
                # Solo podemos usar category_guess si el scraping fue necesario/ejecutado
                if not title_manual and 'category_guess' in locals():
                    data['category'] = category_guess
                else:
                    # Si no se hizo scraping y no hay categoría, usamos un default
                    data['category'] = "Otros"
        
        # 2. Actualizamos el documento en la base de datos
        modified_count = update_link_db(id, data, links_collection)

        if modified_count == 0:
            return jsonify({
                "error": "No se encontró un enlace con ese ID para actualizar."
            }), 404

        return jsonify({
            "message": "Enlace actualizado con éxito",
            "id": id,
            # Devolvemos el título final (sea manual o scrapeado)
            "new_title": data.get('title') 
        }), 200 # Usamos 200 OK para actualizaciones exitosas

    except Exception as e:
       return jsonify({"error": f"Error al actualizar el enlace: {str(e)}"}), 500

# DELETE: ELIMINAR UN ENLACE
@app.route("/links/<id>", methods=["DELETE"])
def delete_link(id):
        try:
            # 1. Llamar a la función del servicio de CRUD (crudService.py)
            deleted_count = delete_link_db(id, links_collection)

            # 2. Verificar el resultado y responder
            if deleted_count == 1:
                return jsonify({
                    "message": f"Enlace con ID '{id}' eliminado con éxito"
                }), 200
            else:
                return jsonify({
                    "error": "No se encontró un enlace con ese ID o ya fue eliminado."
                }), 404

        except Exception as e:
            # 3. Manejo de errores
            return jsonify({"error": f"Error al eliminar el enlace: {str(e)}"}), 500

# GET: OBTENER ESTADÍSTICAS POR CATEGORÍA
# Llama a una función del CRUD para usar la pipeline de agregación de MongoDB.
@app.route("/stats", methods=["GET"])
def get_stats_route():
    try:
        # La función get_stats_db debe hacer un COUNT y GROUP BY en MongoDB
        stats = get_stats_db(links_collection)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener estadísticas: {str(e)}"}), 500


# POST: ANALIZAR ENLACE SIN GUARDAR (PRE-VISUALIZACIÓN)
@app.route("/analyze_link", methods=["POST"])
def analyze_link_route():
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "La URL es requerida para el análisis."}), 400
        
        # LLAMADA AL SCRAPER
        result = get_title_from_url(url)

        # Manejar NoneType si el scraper falla
        if result and len(result) == 2:
            title, category_guess = result
        else:
            # Si el scraping falla, establecemos valores por defecto para no romper el unpack
            title = "Título no disponible"
            category_guess = "Sin Categoría"
        
        return jsonify({
            "title": title,
            "category_guess": category_guess
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error al analizar el enlace: {str(e)}"}), 500

def classify_text_simple(text):
    """Clasifica un texto simple (título) en una de las categorías predefinidas."""
    text = text.lower()
    
    # Busca coincidencias palabra por palabra
    for category, keywords in CATEGORIES.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text):
                return category.capitalize()
                
    return "Otros"


def get_title_from_url(url):
    """
    Realiza web scraping para obtener el título de una URL y sugiere una categoría.
    
    :param url: La URL del enlace.
    :return: Una tupla (título, categoría sugerida) o None si falla.
    """
    
    # 1. Definir un User-Agent para simular un navegador real (MUY IMPORTANTE)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        # 2. Hacer la solicitud HTTP con un timeout para evitar que se quede colgado
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Lanza una excepción para 4xx/5xx errors
        
        # 3. Parsear el contenido
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 4. Extraer el título
        title_tag = soup.find('title')
        if title_tag and title_tag.string:
            title = title_tag.string.strip()
        else:
            # Si no hay etiqueta <title>, usamos la URL como fallback
            title = f"Título no disponible para: {url[:50]}..."

        # 5. Clasificar el título
        category_guess = classify_text_simple(title)
        
        return title, category_guess
        
    except requests.exceptions.HTTPError as e:
        print(f"Error HTTP al acceder a {url}: {e}")
    except requests.exceptions.ConnectionError as e:
        print(f"Error de conexión al acceder a {url}: {e}")
    except requests.exceptions.Timeout as e:
        print(f"Tiempo de espera agotado al acceder a {url}: {e}")
    except Exception as e:
        print(f"Error desconocido en el scraping de {url}: {e}")
        
    # Si cualquier excepción ocurre, devolvemos None para que app.py lo maneje
    return None

# --- 3. INICIO DEL SERVIDOR (¡ESTE BLOQUE DEBE ESTAR AL FINAL!) ---
if __name__ == "__main__":
    print("Iniciando el servidor Flask...")
    # Esto inicia el servidor y lo mantiene en ejecución
    app.run(debug=True, use_reloader=False)