import sqlite3

def list_tables():
    # Chemin vers la base de données
    db_path = 'db.sqlite3'
    
    try:
        # Connexion à la base de données
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Récupérer la liste des tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("Tables dans la base de données:")
        for table in tables:
            print(f"- {table[0]}")
            
            # Afficher les colonnes de chaque table
            cursor.execute(f"PRAGMA table_info({table[0]});")
            columns = cursor.fetchall()
            print(f"  Colonnes: {', '.join([col[1] for col in columns])}")
            
    except sqlite3.Error as e:
        print(f"Erreur: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    list_tables()
