from flask import Flask, jsonify
from flask_cors import CORS
from models import db, StateResult
from simulation import run_simulation
import threading

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///election.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize the database tables
with app.app_context():
    db.create_all()

def run_simulation_thread():
    with app.app_context():
        run_simulation()

@app.route('/api/run-simulation', methods=['POST'])
def start_simulation():
    print("Received request to /api/run-simulation")
    # Start the simulation in a new thread
    thread = threading.Thread(target=run_simulation_thread)
    thread.start()
    return jsonify({'message': 'Simulation started'}), 200

@app.route('/api/state-results', methods=['GET'])
def get_state_results():
    results = StateResult.query.all()
    data = {
        result.state_code: {
            'democrat_votes': result.democrat_votes,
            'republican_votes': result.republican_votes,
            'democrat_percentage': result.democrat_percentage,
            'republican_percentage': result.republican_percentage,
            'winner': result.winner
        } for result in results
    }
    return jsonify(data), 200

@app.route('/api/electoral-votes', methods=['GET'])
def get_electoral_votes():
    total_democrat_ev = db.session.query(db.func.sum(StateResult.electoral_votes)).filter_by(winner='Democrat').scalar() or 0
    total_republican_ev = db.session.query(db.func.sum(StateResult.electoral_votes)).filter_by(winner='Republican').scalar() or 0
    total_undecided_ev = db.session.query(db.func.sum(StateResult.electoral_votes)).filter(StateResult.winner.is_(None)).scalar() or 0
    return jsonify({
        'democrat_ev': total_democrat_ev,
        'republican_ev': total_republican_ev,
        'undecided_ev': total_undecided_ev
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
