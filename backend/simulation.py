import random
from models import db, StateResult
from population_data import state_data
import time

def run_simulation():
    print("Simulation started.")
    # Clear previous data
    db.session.query(StateResult).delete()
    db.session.commit()
    print("Previous data cleared.")

    # Initialize state results
    state_results = {}
    for state_code, data in state_data.items():
        # Calculate simulated population
        simulated_population = data['population'] // 50  # 1/50th of actual population
        state_result = StateResult(
            state_code=state_code,
            state_name=data['name'],
            electoral_votes=data['electoral_votes']
        )
        state_results[state_code] = {
            'state_result': state_result,
            'voter_count': simulated_population,
            'processed_voters': 0
        }
        db.session.add(state_result)
    db.session.commit()
    print("State results initialized.")

    # Simulate voting over time
    total_iterations = 100  # Adjust for smoother updates
    for iteration in range(total_iterations):
        print(f"Simulation iteration {iteration + 1}/{total_iterations}")
        for state_code, info in state_results.items():
            voters_to_process = info['voter_count'] // total_iterations
            # For the last iteration, process any remaining voters
            if iteration == total_iterations - 1:
                voters_to_process = info['voter_count'] - info['processed_voters']
            process_voters(state_code, voters_to_process)
            info['processed_voters'] += voters_to_process
        time.sleep(0.1)  # Pause to simulate real-time updates
    print("Simulation completed.")

def process_voters(state_code, num_voters):
    state_result = StateResult.query.filter_by(state_code=state_code).first()
    for _ in range(num_voters):
        party_preference = random.choices(['Democrat', 'Republican'], weights=[0.5, 0.5])[0]
        if party_preference == 'Democrat':
            state_result.democrat_votes += 1
        else:
            state_result.republican_votes += 1

    # Update percentages and winner
    total_votes = state_result.democrat_votes + state_result.republican_votes
    total_voters = state_data[state_code]['population'] // 50
    state_result.democrat_percentage = (state_result.democrat_votes / total_votes) * 100
    state_result.republican_percentage = (state_result.republican_votes / total_votes) * 100

    # Decide winner if all votes are counted
    if total_votes >= total_voters:
        if state_result.democrat_votes > state_result.republican_votes:
            state_result.winner = 'Democrat'
        else:
            state_result.winner = 'Republican'
    else:
        state_result.winner = None  # Undecided

    db.session.commit()
