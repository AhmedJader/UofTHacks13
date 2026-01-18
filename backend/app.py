import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from twelvelabs import TwelveLabs
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("TWELVELABS_API_KEY")
client = TwelveLabs(api_key=API_KEY) if API_KEY else None
