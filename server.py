from flask import Flask, request, jsonify
from flask_cors import CORS  # Importer CORS
import json
import os
import random
import string


app = Flask(__name__)
CORS(app)  # Appliquer CORS à toute l'application

# Chemin vers le fichier JSON
USERS_FILE = 'users.json'

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r') as file:
        return json.load(file)

def save_users(users):
    with open(USERS_FILE, 'w') as file:
        json.dump(users, file, indent=4)

def generate_iban():
    country_code = "FR"  # Exemple : France
    check_digits = f"{random.randint(10, 99)}"
    bban = ''.join(random.choices(string.digits, k=20))
    return f"{country_code}{check_digits}{bban}"

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email et mot de passe sont requis'}), 400

    users = load_users()

    if any(user['email'] == email for user in users):
        return jsonify({'error': 'Un compte avec cet email existe déjà'}), 400

    iban = generate_iban()
    balance = 0

    users.append({'email': email, 'password': password, 'iban': iban, 'balance': balance})
    save_users(users)

    return jsonify({'message': 'Inscription réussie', 'iban': iban, 'balance': balance}), 201



if __name__ == '__main__':
    app.run(debug=True)
