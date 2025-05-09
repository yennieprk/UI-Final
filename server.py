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

@app.route('/quiz1')
def quizpage1():
   return render_template('quizpage1.html')

@app.route('/quiz2')
def quizpage2():
   return render_template('quizpage2.html')

@app.route('/quiz3')
def quizpage3():
   return render_template('quizpage3.html')

@app.route('/quiz4')
def quizpage4():
   return render_template('quizpage4.html')

@app.route('/quizresult')
def quizresult():
   return render_template('quizresult.html')

@app.route('/about')
def aboutpage():
   return render_template('aboutpage.html')

if __name__ == '__main__':
   app.run(debug = True, port=5001)
