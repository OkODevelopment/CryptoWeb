from flask import Flask, request, jsonify
from flask_cors import CORS  # Importer CORS
import json
import os
import random
import string
from datetime import datetime


app = Flask(__name__)
CORS(app)  # Appliquer CORS à toute l'application

# Chemin vers le fichier JSON
USERS_FILE = 'users.json'
TRANSACTION_FILE = 'transaction.json'

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

def load_transactions():
    if not os.path.exists(TRANSACTION_FILE):
        return {}
    with open(TRANSACTION_FILE, 'r') as file:
        return json.load(file)

def save_transactions(transactions):
    with open(TRANSACTION_FILE, 'w') as file:
        json.dump(transactions, file, indent=4)

def generate_transaction_id():
    return ''.join(random.choices('0123456789abcdef', k=8))



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    pseudo = data.get('pseudo')

    if not email or not password or not pseudo:
        return jsonify({'error': 'Email, mot de passe et pseudo sont requis'}), 400

    users = load_users()

    if any(user['email'] == email for user in users):
        return jsonify({'error': 'Un compte avec cet email existe déjà'}), 400

    if any(user['pseudo'] == pseudo for user in users):
        return jsonify({'error': 'Ce pseudo est déjà utilisé'}), 400

    iban = generate_iban()
    balance = 0

    # Ajout du nouvel utilisateur
    users.append({
        'email': email,
        'password': password,
        'pseudo': pseudo,
        'iban': iban,
        'balance': balance,
    })
    save_users(users)

    return jsonify({'message': 'Inscription réussie', 'iban': iban, 'balance': balance}), 201


@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email et mot de passe sont requis'}), 400

    users = load_users()

    # Vérification des informations d'identification
    user = next((user for user in users if user['email'] == email and user['password'] == password), None)
    if not user:
        return jsonify({'error': 'Identifiants incorrects'}), 401

    return jsonify({
        'message': 'Connexion réussie',
        'pseudo': user['pseudo'],
        'iban': user['iban'],
        'balance': user['balance']
    }), 200

@app.route('/account', methods=['POST'])
def account():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email requis'}), 400

    users = load_users()

    user = next((user for user in users if user['email'] == email), None)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    return jsonify({
        'pseudo': user['pseudo'],
        'balance': user['balance'],
        'iban': user['iban']
    }), 200

@app.route('/deposit', methods=['POST'])
def deposit():
    data = request.json
    email = data.get('email')
    amount = data.get('amount')
    iban = data.get('iban')

    if not email or not amount:
        return jsonify({'error': 'Email et montant requis'}), 400

    users = load_users()

    user = next((user for user in users if user['email'] == email), None)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    user['balance'] += amount
    save_users(users)

    # Enregistrer la transaction avec un ID unique
    transactions = load_transactions()
    if email not in transactions:
        transactions[email] = []
    transactions[email].append({
        "id": generate_transaction_id(),
        "type": "deposit",
        "amount": amount,
        "date": datetime.now().isoformat(),
        "iban": iban
    })
    save_transactions(transactions)

    return jsonify({'message': 'Dépôt réussi', 'new_balance': user['balance']}), 200


@app.route('/withdraw', methods=['POST'])
def withdraw():
    data = request.json
    email = data.get('email')
    amount = data.get('amount')
    iban = data.get('iban')
    bic = data.get('bic')

    if not email or not iban or not bic or not amount:
        return jsonify({'error': 'Tous les champs sont requis.'}), 400

    users = load_users()

    user = next((user for user in users if user['email'] == email), None)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé.'}), 404

    if user['balance'] < amount:
        return jsonify({'error': 'Solde insuffisant.'}), 400

    user['balance'] -= amount
    save_users(users)

    # Enregistrer la transaction avec un ID unique
    transactions = load_transactions()
    if email not in transactions:
        transactions[email] = []
    transactions[email].append({
        "id": generate_transaction_id(),
        "type": "withdraw",
        "amount": amount,
        "date": datetime.now().isoformat(),
        "iban": iban
    })
    save_transactions(transactions)

    return jsonify({'message': 'Retrait réussi', 'new_balance': user['balance']}), 200

@app.route('/transactions', methods=['POST'])
def get_transactions():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email requis'}), 400

    transactions = load_transactions()
    user_transactions = transactions.get(email, [])

    return jsonify(user_transactions), 200





if __name__ == '__main__':
    app.run(debug=True)
