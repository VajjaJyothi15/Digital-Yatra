import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database.db import init_db
from routes.auth_routes import auth_bp
from routes.destination_routes import destination_bp
from routes.trip_routes import trip_bp
from routes.guide_routes import guide_bp
from routes.report_routes import report_bp
from routes.safety_routes import safety_bp
from routes.assistant_routes import assistant_bp
from routes.admin_routes import admin_bp
from routes.guide_booking_routes import guide_booking_bp
from routes.review_routes import review_bp

def create_app():
    app = Flask(__name__, static_folder='uploads')
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database handlers
    init_db(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(destination_bp)
    app.register_blueprint(trip_bp)
    app.register_blueprint(guide_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(safety_bp)
    app.register_blueprint(assistant_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(guide_booking_bp)
    app.register_blueprint(review_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "app": "Digital Yatra Backend API",
            "version": "2.0.0"
        })

    # Serve React SPA build from frontend/dist if available
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    if os.path.exists(dist_dir):
        from flask import send_from_directory
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_frontend(path):
            if path and os.path.exists(os.path.join(dist_dir, path)):
                return send_from_directory(dist_dir, path)
            return send_from_directory(dist_dir, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Resource or endpoint not found."}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "message": "An internal server error occurred."}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"[OK] Digital Yatra Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
