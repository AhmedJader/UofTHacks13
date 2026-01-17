import os
import json
import time
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from twelvelabs import TwelveLabs
from dotenv import load_dotenv

# Load environment variables from the local .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("TWELVELABS_API_KEY")
if not API_KEY:
    print("Warning: TWELVELABS_API_KEY not found in environment variables.")

client = TwelveLabs(api_key=API_KEY) if API_KEY else None

# Configuration
INDEX_NAME = "uofthacks13_cctv"
# Point to the frontend's public directory
VIDEO_DIR = os.path.join(os.path.dirname(__file__), '../frontend/public/cctv')
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

# Video mapping (filename -> camera ID)
VIDEO_MAP = {
    "downtown.mp4": "cam-1",
    "incident1.mp4": "cam-2",
    "incident2.mp4": "cam-3",
    "incident3.mp4": "cam-4",
    "ttc1.mp4": "cam-5"
}

def get_or_create_index(name):
    indexes = client.index.list()
    for index in indexes:
        if index.name == name:
            print(f"Using existing index: {index.name} ({index.id})")
            return index.id
    
    print(f"Creating new index: {name}")
    index = client.index.create(name=name, engines=[
        {"name": "marengo2.6", "options": ["visual", "conversation", "text_in_video", "logo"]},
        {"name": "pegasus1", "options": ["visual", "conversation"]}
    ])
    return index.id

def upload_videos(index_id):
    video_ids = {}
    # Check existing videos in index to avoid re-uploading
    existing_videos = client.index.video.list(index_id)
    existing_filenames = {v.metadata.filename: v.id for v in existing_videos}

    for filename in VIDEO_MAP.keys():
        filepath = os.path.join(VIDEO_DIR, filename)
        if not os.path.exists(filepath):
            print(f"Warning: File not found {filepath}")
            continue

        if filename in existing_filenames:
            print(f"Video already indexed: {filename}")
            video_ids[filename] = existing_filenames[filename]
        else:
            print(f"Uploading {filename}...")
            try:
                task = client.task.create(index_id=index_id, file=filepath)
                print(f"Task created: {task.id}")
                
                # Wait for task completion
                while True:
                    task_status = client.task.retrieve(task.id)
                    if task_status.status == "ready":
                        print(f"Indexing complete for {filename}")
                        video_ids[filename] = task_status.video_id
                        break
                    elif task_status.status == "failed":
                        print(f"Indexing failed for {filename}")
                        break
                    time.sleep(2)
            except Exception as e:
                print(f"Error uploading {filename}: {e}")

    return video_ids

def analyze_video(video_id, camera_id):
    print(f"Analyzing video {video_id} ({camera_id})...")
    
    prompt = "Identify any security threats, violence, fire, or suspicious activity in this video. Provide a JSON object with fields: 'has_threat' (boolean), 'threat_type' (string or null), 'description' (string), 'timestamp_start' (number), 'timestamp_end' (number)."
    
    try:
        res = client.generate(video_id=video_id, prompt=prompt)
        return {
            "cameraId": camera_id,
            "videoId": video_id,
            "analysis": res.data,
            "timestamp": time.time()
        }
    except Exception as e:
        print(f"Error analyzing {video_id}: {e}")
        return None

@app.route('/analyze', methods=['POST'])
def trigger_analysis():
    if not client:
        return jsonify({"error": "Twelve Labs client not initialized"}), 500

    try:
        # 1. Setup Index
        index_id = get_or_create_index(INDEX_NAME)
        
        # 2. Upload/Index Videos
        video_ids = upload_videos(index_id)
        
        # 3. Analyze Videos
        results = []
        for filename, video_id in video_ids.items():
            camera_id = VIDEO_MAP.get(filename)
            analysis = analyze_video(video_id, camera_id)
            if analysis:
                results.append(analysis)
        
        # 4. Save Results
        with open(DATA_FILE, "w") as f:
            json.dump(results, f, indent=2)
            
        return jsonify({"success": True, "results": results})
    except Exception as e:
        print(f"Analysis failed: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-video', methods=['POST'])
def analyze_single_video():
    if not client:
        return jsonify({"error": "Twelve Labs client not initialized"}), 500
        
    data = request.json
    camera_id = data.get('cameraId')
    
    # Find filename from camera ID
    filename = next((f for f, c in VIDEO_MAP.items() if c == camera_id), None)
    if not filename:
        return jsonify({"error": "Camera not found"}), 404
        
    try:
        # Ensure index exists
        index_id = get_or_create_index(INDEX_NAME)
        
        # Upload/Get video ID
        # This is a bit inefficient to list all videos every time, but fine for hackathon
        existing_videos = client.index.video.list(index_id)
        video_id = next((v.id for v in existing_videos if v.metadata.filename == filename), None)
        
        if not video_id:
            # Upload if missing
            filepath = os.path.join(VIDEO_DIR, filename)
            if not os.path.exists(filepath):
                 return jsonify({"error": "Video file not found"}), 404
            
            task = client.task.create(index_id=index_id, file=filepath)
            # Wait for it... (blocking for simplicity)
            while True:
                task_status = client.task.retrieve(task.id)
                if task_status.status == "ready":
                    video_id = task_status.video_id
                    break
                elif task_status.status == "failed":
                    return jsonify({"error": "Indexing failed"}), 500
                time.sleep(1)

        # Analyze
        analysis = analyze_video(video_id, camera_id)
        
        # Update data.json
        results = []
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                results = json.load(f)
        
        results.append(analysis)
        with open(DATA_FILE, "w") as f:
            json.dump(results, f, indent=2)
            
        return jsonify({"success": True, "result": analysis})

    except Exception as e:
        print(f"Single analysis failed: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/alerts', methods=['GET'])
def get_alerts():
    if not os.path.exists(DATA_FILE):
        return jsonify({"alerts": []})
        
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            
        alerts = []
        for i, item in enumerate(data):
            # Simple heuristic to determine if it's an alert
            text = item.get('analysis', '').lower()
            if 'threat' in text or 'violence' in text or 'suspicious' in text or 'fire' in text:
                alerts.append({
                    "id": f"analysis-{i}",
                    "cameraId": item['cameraId'],
                    "cameraName": item['cameraId'], # Could map to real name
                    "message": item.get('analysis', '')[:100] + "...",
                    "timestamp": datetime.fromtimestamp(item['timestamp']).isoformat() if 'timestamp' in item else None,
                    "severity": "high"
                })
        
        return jsonify({"alerts": alerts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
