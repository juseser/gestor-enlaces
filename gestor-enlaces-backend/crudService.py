# crud_service.py
from bson.objectid import ObjectId
import time

# Necesitamos acceso a la colección de la base de datos para CRUD
# En un proyecto funcional real, esta colección se inyectaría.
# Para este ejemplo, asumimos que 'links_collection' está en el scope de app.py
# y que se importa junto con las funciones.

# Las funciones de CRUD (CREATE, READ, UPDATE, DELETE)

def create_link_db(data, title, links_collection):
    #Inserta un nuevo enlace en la base de datos.
    url = data.get('url')
    category = data.get('category', 'Otros')

    new_link = {
        "url": url,
        "title": title,
        "category": category,
        "created_at": time.ctime(),
        "clicks": 0
    }

    result = links_collection.insert_one(new_link)
    return str(result.inserted_id)

def get_all_links_db(links_collection):
    #Recupera todos los enlaces de la base de datos.
    links = []
    for link in links_collection.find():
        link["_id"] = str(link["_id"])
        links.append(link)
    return links

def update_link_db(link_id, update_data, links_collection):
    #Actualiza un enlace por su ID.
    result = links_collection.update_one(
        {"_id": ObjectId(link_id)},
        {"$set": update_data}
    )
    return result.matched_count

def delete_link_db(link_id, links_collection):
    #Elimina un enlace por su ID.
    result = links_collection.delete_one({"_id": ObjectId(link_id)})
    return result.deleted_count

def get_stats_db(collection):
    """
    Calcula el conteo de enlaces por cada categoría usando la pipeline de agregación de MongoDB.
    :param collection: La colección de MongoDB (links_collection).
    :return: Una lista de diccionarios con el formato [{'category': '...', 'count': X}, ...].
    """
    """
    1. Pipeline de agregación: 
        - Agrupa por el campo 'category'
        - Cuenta cuántos documentos hay en cada grupo
        - Renombra el campo _id a 'category'
    """
    pipeline = [
        # $group: Agrupa los documentos por el valor del campo 'category'
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        
        # $project: Redefine el formato de salida para renombrar _id a 'category'
        {"$project": {"category": "$_id", "count": 1, "_id": 0}},
        
        # $sort: Ordena los resultados de mayor a menor conteo
        {"$sort": {"count": -1}}
    ]
    
    # 2. Ejecutar la agregación y convertir el cursor a lista
    stats_cursor = collection.aggregate(pipeline)
    
    return list(stats_cursor)