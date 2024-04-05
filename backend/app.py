from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get('/')
def hello():
    return {'message': 'Hello from the backend!'}

@app.get('/api/data')
def get_data():
    data = {'name': 'John', 'age': 30}
    return data

@app.post('/api/submit')
def submit_data(data: dict):
    # Do something with the submitted data
    return {'message': 'Data received successfully'}
