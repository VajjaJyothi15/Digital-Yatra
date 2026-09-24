import os
import json
import numpy as np

def train_cost_regressor():
    print("Training Budget Cost Regressor Model...")
    
    # Generate synthetic training data
    # Features: [days, group_size, tier_encoded (0=Low, 1=Medium, 2=High)]
    np.random.seed(42)
    X = []
    y = []

    for _ in range(500):
        days = np.random.randint(1, 15)
        group_size = np.random.randint(1, 10)
        tier = np.random.choice([0, 1, 2])
        
        base_rate = 1450 if tier == 0 else (3900 if tier == 1 else 8200)
        total_cost = (days * base_rate) + (group_size * 500 * days) + np.random.randint(-500, 500)
        
        X.append([days, group_size, tier])
        y.append(total_cost)

    X = np.array(X)
    y = np.array(y)

    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    score = model.score(X, y)
    print(f"[OK] RandomForestRegressor trained successfully with R^2 Score: {score:.4f}")
    
    # Save model metadata
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)
    meta_path = os.path.join(model_dir, 'cost_model_meta.json')
    
    with open(meta_path, 'w') as f:
        json.dump({"model": "RandomForestRegressor", "r2_score": round(score, 4), "n_samples": 500}, f, indent=2)
    print(f"[OK] Model metadata saved to {meta_path}")

if __name__ == '__main__':
    train_cost_regressor()
