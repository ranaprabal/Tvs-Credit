import sys
import json
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from datetime import datetime

def process_data(data):
    return data

seasonal_mapping = {
    'tractor_loan': ['2024-11-01', '2025-11-01'],
    'mobile_loan': ['2024-12-01', '2025-12-01'],
    'two_wheeler_loan': ['2025-01-01', '2026-01-01'],
    'used_car_loan': ['2025-02-01', '2026-02-01'],
    'consumer_durable_loan': ['2025-03-01', '2026-03-01'],
    'instacard': ['2025-04-01', '2026-04-01'],
    'gold_loan': ['2025-05-01', '2026-05-01'],
    'loan_against_property': ['2025-06-01', '2026-06-01'],
    'used_commercial_loan': ['2025-07-01', '2026-07-01'],
    'three_wheeler_loan': ['2025-08-01', '2026-08-01'],
    'mobile_loan': ['2025-09-01', '2026-09-01'],
    'online_personal_loan': ['2025-10-01', '2026-10-01'],
    'emerging_&_mid-corporate_business_loan': ['2025-11-01', '2026-11-01'],
}

def get_adjusted_best_time(best_time):
    best_date = pd.to_datetime(best_time, format='%Y-%m-%d')
    if best_date < datetime.now():
        best_date = datetime.now()
    return best_date.strftime('%Y-%m-%d')

try:
    loan_data = pd.read_csv('./controllers/dataset.csv')

    loan_data.columns = loan_data.columns.str.strip().str.lower().str.replace(' ', '_')

    loan_data['marital_status'] = loan_data['marital_status'].fillna('').str.split(',')
    loan_data['occupation'] = loan_data['occupation'].fillna('').str.split(',')
    loan_data['location_type'] = loan_data['location_type'].fillna('').str.split(',')

    loan_data['product_features'] = loan_data.apply(
        lambda product: f"{' '.join(product['marital_status'])} {' '.join(product['occupation'])} {product['education']} "
                        f"{product['credit_score']} {product['life_events']} {product['gender']} {product['children']} "
                        f"{product['age']} {' '.join(product['location_type'])} {product['property']}", axis=1)

    vectorizer = TfidfVectorizer(stop_words='english')
    loan_vectors = vectorizer.fit_transform(loan_data['product_features'])

    input_data = sys.stdin.read()
    user_data = ast.literal_eval(json.loads(input_data))

    user_profile = f"{user_data['marital_status']} {user_data['occupation']} {user_data['education']} " \
                   f"{user_data['credit_score']} {user_data['life_events']} {user_data['gender']} " \
                   f"{user_data['children']} {user_data['age']} {user_data['location_type']} {user_data['property']}"
    
    user_vector = vectorizer.transform([user_profile])

    life_events = user_data['life_events'].split(',')
    life_events_dates = user_data['life_events_date'].split(',')
    event_date_mapping = {event.strip(): pd.to_datetime(date.strip(), format='%d-%m-%Y', errors='coerce') 
                          for event, date in zip(life_events, life_events_dates)}

    if user_vector.shape[1] != loan_vectors.shape[1]:
        print(json.dumps({"error": "User profile does not match the loan features space."}))
        sys.exit(1)

    similarity_matrix = cosine_similarity(user_vector, loan_vectors)
    if similarity_matrix.size == 0 or len(similarity_matrix[0]) == 0:
        print(json.dumps({"error": "No similar products found. Please check the input or data."}))
        sys.exit(1)

    top_n = 3
    sim_scores = sorted(enumerate(similarity_matrix[0]), key=lambda x: x[1], reverse=True)
    top_products_indices = [i[0] for i in sim_scores[:min(top_n, len(sim_scores))]]
    recommended_products = loan_data.iloc[top_products_indices]

    recommendations = []
    current_date = datetime.now()
    for _, product in recommended_products.iterrows():
        event_date = next((date for event, date in event_date_mapping.items() if event in product['life_events']), None)
        best_time = (get_adjusted_best_time(event_date.strftime('%Y-%m-%d')) 
                     if event_date and event_date >= current_date 
                     else get_adjusted_best_time(seasonal_mapping.get(product['product_name'].lower().replace(' ', '_'), [current_date.strftime('%Y-%m-%d')])[0]))

        recommendations.append({
            'productName': product['product_name'],
            'interestRate': product['interest_rate'],
            'duration': product['duration'],
            'bestTimeToRecommend': best_time,
        })

    print(json.dumps(recommendations))

except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
