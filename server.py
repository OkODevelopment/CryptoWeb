from flask import Flask, request, jsonify
from flask_cors import CORS  # Importer CORS
import json
import os
import random
import string
from datetime import datetime
import traceback

app = Flask(__name__)
CORS(app)

USERS_FILE = 'users.json'
TRANSACTION_FILE = 'transaction.json'
CRYPTO_FILE = 'crypto.json'

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r') as file:
        return json.load(file)

def save_users(users):
    with open(USERS_FILE, 'w') as file:
        json.dump(users, file, indent=4)

def generate_iban():
    country_code = "CX"
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

def load_crypto():
    if not os.path.exists(CRYPTO_FILE):
        return {}
    with open(CRYPTO_FILE, 'r') as file:
        return json.load(file)

def save_crypto(crypto):
    with open(CRYPTO_FILE, 'w') as file:
        json.dump(crypto, file, indent=4)

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

@app.route('/buy', methods=['POST'])
def buy_crypto():
    try:
        print("Données reçues:", request.json)

        data = request.json
        email = data.get('email')
        crypto_id = data.get('crypto_id')
        quantity = float(data.get('quantity', 0))
        price = float(data.get('price', 0))

        print(f"Email: {email}, Crypto: {crypto_id}, Quantity: {quantity}, Price: {price}")  # Log des valeurs

        if not all([email, crypto_id, quantity, price]):
            print("Champs manquants")
            return jsonify({'error': 'Tous les champs sont requis.'}), 400

        users = load_users()
        user = next((user for user in users if user['email'] == email), None)
        print(f"Utilisateur trouvé: {user is not None}")

        if not user:
            return jsonify({'error': 'Utilisateur non trouvé.'}), 404

        total_cost = quantity * price
        print(f"Coût total: {total_cost}, Balance utilisateur: {user['balance']}")  # Log du coût et de la balance

        if user['balance'] < total_cost:
            return jsonify({'error': 'Solde insuffisant.'}), 400

        user['balance'] -= total_cost
        save_users(users)

        crypto = load_crypto()
        if email not in crypto:
            crypto[email] = {}
        crypto[email][crypto_id] = crypto[email].get(crypto_id, 0) + quantity
        save_crypto(crypto)

        print("Transaction réussie")
        return jsonify({'message': 'Achat réussi.', 'new_balance': user['balance']}), 200

    except Exception as e:
        print("Erreur détaillée:", traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@app.route('/sell', methods=['POST'])
def sell_crypto():
    data = request.json
    email = data.get('email')
    crypto_id = data.get('crypto_id')
    quantity = data.get('quantity')
    price = data.get('price')

    if not email or not crypto_id or not quantity or not price:
        return jsonify({'error': 'Tous les champs sont requis.'}), 400

    crypto = load_crypto()
    if email not in crypto or crypto[email].get(crypto_id, 0) < quantity:
        return jsonify({'error': 'Quantité de crypto insuffisante.'}), 400

    users = load_users()
    user = next((user for user in users if user['email'] == email), None)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé.'}), 404

    total_gain = quantity * price
    user['balance'] += total_gain
    save_users(users)

    crypto[email][crypto_id] -= quantity
    if crypto[email][crypto_id] == 0:
        del crypto[email][crypto_id]
    save_crypto(crypto)

    return jsonify({'message': 'Vente réussie.', 'new_balance': user['balance']}), 200

@app.route('/user-cryptos', methods=['POST'])
def get_user_cryptos():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email requis'}), 400

    crypto = load_crypto()
    user_cryptos = crypto.get(email, {})

    crypto_prices = {
        'BTC': 45000,
        'ETH': 2500,
        'USDT': 1,
        'XRP': 0.5,
        'BNB': 300,
        'SOL': 100,
        'DOGE': 0.1,
        'USDC': 1,
        'ADA': 0.5,
        'LDO': 3
    }

    crypto_details = []
    for crypto_id, quantity in user_cryptos.items():
        price = crypto_prices.get(crypto_id, 0)
        eur_value = quantity * price
        crypto_details.append({
            'id': crypto_id,
            'quantity': quantity,
            'price': price,
            'eur_value': eur_value
        })

    return jsonify(crypto_details), 200

@app.route('/verify-iban', methods=['POST'])
def verify_iban():
    data = request.json
    iban = data.get('iban')

    if not iban:
        return jsonify({'error': 'IBAN requis'}), 400

    users = load_users()
    iban_exists = any(user.get('iban') == iban for user in users)

    return jsonify({'exists': iban_exists}), 200

@app.route('/send', methods=['POST'])
def send_crypto():
    # Load crypto data first
    crypto = load_crypto()
    
    data = request.json
    print("Received data:", data)
    
    sender_email = data.get('email')
    destination_iban = data.get('destinationIban', '').strip()
    amount = float(data.get('amount', 0))
    crypto_currency = data.get('cryptoCurrency')

    # Debug print
    print(f"Processing IBAN: '{destination_iban}'")
    
    users = load_users()
    available_ibans = [user.get('iban', '').strip() for user in users]
    
    print("Available IBANs:", available_ibans)
    
    # Exact match without truncation
    recipient = next((user for user in users if user.get('iban', '').strip() == destination_iban), None)
    
    if not recipient:
        print(f"No match found. Comparing '{destination_iban}' with {available_ibans}")
        return jsonify({'error': 'IBAN de destination invalide'}), 404

    recipient_email = recipient['email']

    sender_cryptos = crypto.get(sender_email, {})

    recipient_email = recipient['email']

    sender_cryptos = crypto.get(sender_email, {})
    if crypto_currency not in sender_cryptos:
        return jsonify({'error': 'Vous ne possédez pas cette crypto-monnaie'}), 400

    if sender_cryptos[crypto_currency] < amount:
        return jsonify({'error': 'Solde insuffisant en crypto-monnaie'}), 400

    crypto[sender_email][crypto_currency] -= amount
    if crypto[sender_email][crypto_currency] == 0:
        del crypto[sender_email][crypto_currency]

    if recipient_email not in crypto:
        crypto[recipient_email] = {}
    if crypto_currency not in crypto[recipient_email]:
        crypto[recipient_email][crypto_currency] = 0

    crypto[recipient_email][crypto_currency] += amount

    save_crypto(crypto)

    transactions = load_transactions()
    if sender_email not in transactions:
        transactions[sender_email] = []

    transaction_id = generate_transaction_id()
    transactions[sender_email].append({
        "id": transaction_id,
        "type": "send",
        "amount": amount,
        "crypto": crypto_currency,
        "date": datetime.now().isoformat(),
        "destination_iban": destination_iban
    })
    save_transactions(transactions)

    return jsonify({
        'message': 'Transfert réussi',
        'transaction_id': transaction_id
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
