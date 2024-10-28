from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class StateResult(db.Model):
    __tablename__ = 'state_results'
    state_code = db.Column(db.String(2), primary_key=True)
    state_name = db.Column(db.String(50))
    democrat_votes = db.Column(db.Integer, default=0)
    republican_votes = db.Column(db.Integer, default=0)
    democrat_percentage = db.Column(db.Float, default=0.0)
    republican_percentage = db.Column(db.Float, default=0.0)
    winner = db.Column(db.String(50), nullable=True)
    electoral_votes = db.Column(db.Integer, default=0)
