from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import config  # your config.py

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # change in production!

# MySQL Configuration
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)


# ---------- Routes ---------- #

@app.route('/')
def index():
    return render_template('login.html')     # your login/register HTML page


@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    if not (name and email and password):
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

    cur = mysql.connection.cursor()

    # Check if user already exists
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    if user:
        return jsonify({'status': 'error', 'message': 'Email already registered'}), 400

    hashed_pw = generate_password_hash(password)

    cur.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        (name, email, hashed_pw)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({'status': 'success'}), 200


@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    if not (email and password):
        return jsonify({'status': 'error', 'message': 'Both email and password required'}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT user_id, name, password FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()

    if user and check_password_hash(user[2], password):
        # store in session
        session['user_id'] = user[0]
        session['name'] = user[1]
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401


@app.route('/home')
def home():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    return render_template('home.html', name=session.get('name'))


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
