from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

@app.route('/')
def homepage():
   return render_template('homepage.html')

@app.route('/learn')
def learnpage():
   return render_template('learnpage.html')

@app.route('/quiz')
def quizpage():
   return render_template('quizpage.html')

@app.route('/about')
def aboutpage():
   return render_template('aboutpage.html')

if __name__ == '__main__':
   app.run(debug = True, port=5001)
