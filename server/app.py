import os
from flask import Flask, jsonify, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask('__name__')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key= True)
    content = db.Column(db.String(200), nullable = False)
    date_created = db.Column(db.DateTime, default = datetime.utcnow)
    
    def __repr__(self):
        return f'<Task {self.id}>'


@app.route('/api/tasks', methods = ['POST','GET'])
def index():
    if request.method == 'POST':
        content = request.json['content']
        new_task = Tasks(content=content)
        try:
            db.session.add(new_task)
            db.session.commit()
            return jsonify({'id':new_task.id, 'content': new_task.content, 'dateCreated': new_task.date_created})
        except:
            return 'There was a problem adding this task '
    else:
        tasks = Tasks.query.order_by(Tasks.date_created).all()
        return jsonify([{'id':task.id, 'content': task.content, 'dateCreated': task.date_created} for task in tasks])
        


@app.route('/api/tasks/<int:id>', methods=["DELETE"])
def delete(id):
    task_to_be_deleted = Tasks.query.get_or_404(id)
    try:
        db.session.delete(task_to_be_deleted)
        db.session.commit()
        return jsonify({"message": "The task was deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
 
@app.route('/api/tasks/edit/<int:id>' , methods=["PUT"])
def edit(id):
    task_to_updated = Tasks.query.get_or_404(id)
    task_to_updated.content = request["content"]

    try: 
        db.session.commit()
        return jsonify({"message":"The task was completed successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


 
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
